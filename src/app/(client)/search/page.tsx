"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useSearchCourse } from "@/hooks/useCourse";

import SearchHero from "@/components/search/SearchHero";
import SearchCard from "@/components/search/SearchCard";

import SearchSidebar, {
  SortOption,
  ViewOption,
} from "@/components/search/SearchSidebar";

function SearchContent() {
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") || "";

  const { data, isLoading } = useSearchCourse(keyword);

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [category, setCategory] = useState("Tất cả");

  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [viewRange, setViewRange] = useState<ViewOption>("all");

  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // =====================================================
  // FAVORITES
  // =====================================================

  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("FAVORITE_COURSES");

      if (!storedFavorites) {
        return;
      }

      const parsed = JSON.parse(storedFavorites);

      if (Array.isArray(parsed)) {
        setFavorites(parsed.map((item) => String(item)));
      }
    } catch (error) {
      console.error("Không thể đọc danh sách yêu thích:", error);
    }
  }, []);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories: string[] = [
    "Tất cả",
    ...Array.from(
      new Set(
        (data ?? []).map((item: any) => item.danhMucKhoaHoc?.tenDanhMucKhoaHoc),
      ),
    ).filter((item): item is string => Boolean(item)),
  ];

  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredCourses = useMemo(() => {
    let result = [...(data ?? [])];

    // =================================================
    // 1. CATEGORY
    // =================================================

    if (category !== "Tất cả") {
      result = result.filter(
        (course: any) => course.danhMucKhoaHoc?.tenDanhMucKhoaHoc === category,
      );
    }

    // =================================================
    // 2. VIEW RANGE
    // =================================================

    switch (viewRange) {
      case "under-100":
        result = result.filter(
          (course: any) => Number(course.luotXem || 0) < 100,
        );
        break;

      case "100-500":
        result = result.filter((course: any) => {
          const views = Number(course.luotXem || 0);

          return views >= 100 && views <= 500;
        });
        break;

      case "500-1000":
        result = result.filter((course: any) => {
          const views = Number(course.luotXem || 0);

          return views > 500 && views <= 1000;
        });
        break;

      case "over-1000":
        result = result.filter(
          (course: any) => Number(course.luotXem || 0) > 1000,
        );
        break;

      case "all":
      default:
        break;
    }

    // =================================================
    // 3. FAVORITES
    // =================================================

    if (onlyFavorites) {
      result = result.filter((course: any) =>
        favorites.includes(String(course.maKhoaHoc)),
      );
    }

    // =================================================
    // 4. SORT
    // =================================================

    switch (sortBy) {
      case "views":
        result.sort(
          (a: any, b: any) => Number(b.luotXem || 0) - Number(a.luotXem || 0),
        );
        break;

      case "name-asc":
        result.sort((a: any, b: any) =>
          String(a.tenKhoaHoc || "").localeCompare(
            String(b.tenKhoaHoc || ""),
            "vi",
          ),
        );
        break;

      case "name-desc":
        result.sort((a: any, b: any) =>
          String(b.tenKhoaHoc || "").localeCompare(
            String(a.tenKhoaHoc || ""),
            "vi",
          ),
        );
        break;

      case "newest":
      default:
        result.sort((a: any, b: any) => {
          const dateA = new Date(a.ngayTao || 0).getTime();

          const dateB = new Date(b.ngayTao || 0).getTime();

          return dateB - dateA;
        });
        break;
    }

    return result;
  }, [data, category, sortBy, viewRange, onlyFavorites, favorites]);

  // =====================================================
  // LOADING
  // =====================================================
  // QUAN TRỌNG:
  // useMemo ở trên if này để Hooks không bị đổi thứ tự.
  // =====================================================

  if (isLoading) {
    return <section className="py-20 text-center">Đang tìm kiếm...</section>;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <SearchHero keyword={keyword} total={filteredCourses.length} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <SearchSidebar
          categories={categories}
          category={category}
          setCategory={setCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewRange={viewRange}
          setViewRange={setViewRange}
          onlyFavorites={onlyFavorites}
          setOnlyFavorites={setOnlyFavorites}
        />

        {/* =================================================
            RESULTS
        ================================================= */}

        <div>
          {filteredCourses.length === 0 ? (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-3xl border bg-white shadow-sm">
              <img
                src="/empty-search.svg"
                alt="Không tìm thấy khóa học"
                className="w-64"
              />

              <h2 className="mt-6 text-3xl font-bold text-slate-900">
                Không tìm thấy khóa học
              </h2>

              <p className="mt-2 text-gray-500">Hãy thử thay đổi bộ lọc.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCourses.map((course: any) => (
                <SearchCard key={course.maKhoaHoc} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <section className="py-20 text-center">Đang tải tìm kiếm...</section>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

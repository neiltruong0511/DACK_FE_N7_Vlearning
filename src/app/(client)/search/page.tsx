"use client";

import { Suspense, useMemo, useState } from "react";
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
    // 3. SORT
    // =================================================

    switch (sortBy) {
      // -----------------------------------------------
      // NHIỀU LƯỢT XEM
      // -----------------------------------------------

      case "views":
        result.sort(
          (a: any, b: any) => Number(b.luotXem || 0) - Number(a.luotXem || 0),
        );
        break;

      // -----------------------------------------------
      // TÊN A -> Z
      // -----------------------------------------------

      case "name-asc":
        result.sort((a: any, b: any) =>
          String(a.tenKhoaHoc || "").localeCompare(
            String(b.tenKhoaHoc || ""),
            "vi",
          ),
        );
        break;

      // -----------------------------------------------
      // TÊN Z -> A
      // -----------------------------------------------

      case "name-desc":
        result.sort((a: any, b: any) =>
          String(b.tenKhoaHoc || "").localeCompare(
            String(a.tenKhoaHoc || ""),
            "vi",
          ),
        );
        break;

      // -----------------------------------------------
      // MỚI NHẤT
      // -----------------------------------------------

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
  }, [data, category, sortBy, viewRange]);

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <section className="min-h-[500px] py-20 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Đang tìm kiếm khóa học...
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      {/* =================================================
          HERO
      ================================================= */}

      <SearchHero keyword={keyword} total={filteredCourses.length} />

      {/* =================================================
          CONTENT
      ================================================= */}

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
        />

        {/* =================================================
            RESULTS
        ================================================= */}

        <div className="min-w-0">
          {filteredCourses.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 text-center shadow-sm">
              <img
                src="/empty-search.svg"
                alt="Không tìm thấy khóa học"
                className="w-64 max-w-full"
              />

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Không tìm thấy khóa học
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Hãy thử thay đổi từ khóa hoặc bộ lọc.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* =================================================
                  RESULT HEADER
              ================================================= */}

              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Tìm thấy{" "}
                  <span className="font-bold text-slate-900">
                    {filteredCourses.length}
                  </span>{" "}
                  khóa học
                </p>

                {keyword && (
                  <p className="text-sm text-slate-400">
                    Từ khóa:{" "}
                    <span className="font-semibold text-slate-600">
                      "{keyword}"
                    </span>
                  </p>
                )}
              </div>

              {/* =================================================
                  COURSE LIST
              ================================================= */}

              <div className="space-y-8">
                {filteredCourses.map((course: any) => (
                  <SearchCard key={course.maKhoaHoc} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// =====================================================
// PAGE
// =====================================================

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-[500px] py-20 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Đang tải tìm kiếm...
            </p>
          </div>
        </section>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

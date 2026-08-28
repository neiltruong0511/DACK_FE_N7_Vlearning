"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Search, X, Loader2, ChevronDown, BookOpen } from "lucide-react";

import { useCourseByCategory } from "@/hooks/useCourse";

import CategoryCourseList from "@/components/course/CategoryCourseList";
import CourseLoading from "@/components/common/CourseLoading";

const PAGE_SIZE = 8;

export default function CategoryPage() {
  const { category } = useParams();

  // =====================================================
  // CATEGORY
  // =====================================================

  const categoryId = Array.isArray(category) ? category[0] : category;

  // =====================================================
  // GET COURSES
  // =====================================================

  const {
    data: courses = [],
    isLoading,
    isFetching,
  } = useCourseByCategory(categoryId as string);

  // =====================================================
  // SEARCH
  // =====================================================

  const [keyword, setKeyword] = useState("");

  // =====================================================
  // VISIBLE COUNT
  //
  // Ban đầu chỉ hiển thị 8 khóa học
  // =====================================================

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // =====================================================
  // RESET KHI ĐỔI CATEGORY
  // =====================================================

  useEffect(() => {
    setKeyword("");
    setVisibleCount(PAGE_SIZE);
  }, [categoryId]);

  // =====================================================
  // CATEGORY NAME
  // =====================================================

  const categoryName =
    courses?.[0]?.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Khóa học";

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredCourses = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    // Không search
    if (!search) {
      return courses;
    }

    return courses.filter((course: any) => {
      // Tên khóa học
      const name = String(course?.tenKhoaHoc || "").toLowerCase();

      // Mã khóa học
      const courseId = String(course?.maKhoaHoc || "").toLowerCase();

      // Mô tả
      const description = String(course?.moTa || "").toLowerCase();

      // Tên danh mục
      const categoryName = String(
        course?.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "",
      ).toLowerCase();

      return (
        name.includes(search) ||
        courseId.includes(search) ||
        description.includes(search) ||
        categoryName.includes(search)
      );
    });
  }, [courses, keyword]);

  // =====================================================
  // RESET VISIBLE COUNT KHI SEARCH
  // =====================================================

  useEffect(() => {
    if (keyword.trim()) {
      setVisibleCount(PAGE_SIZE);
    }
  }, [keyword]);

  // =====================================================
  // DANH SÁCH ĐANG HIỂN THỊ
  // =====================================================

  const displayedCourses = useMemo(() => {
    return filteredCourses.slice(0, visibleCount);
  }, [filteredCourses, visibleCount]);

  // =====================================================
  // CHECK CÒN COURSE
  // =====================================================

  const hasMore = visibleCount < filteredCourses.length;

  // =====================================================
  // LOAD MORE
  // =====================================================

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);

    // Tạo cảm giác loading giống Infinite Loading
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);

      setIsLoadingMore(false);
    }, 500);
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const handleClearSearch = () => {
    setKeyword("");
    setVisibleCount(PAGE_SIZE);
  };

  // =====================================================
  // INITIAL LOADING
  // =====================================================

  if (isLoading) {
    return <CourseLoading />;
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <section>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {/* CATEGORY */}

              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
                <BookOpen className="h-4 w-4" />
                Danh mục khóa học
              </div>

              {/* TITLE */}

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {categoryName}
              </h1>

              {/* DESCRIPTION */}

              <p className="mt-3 text-sm text-slate-500 sm:text-base">
                Khám phá các khóa học thuộc danh mục{" "}
                <span className="font-semibold text-slate-700">
                  {categoryName}
                </span>
              </p>
            </div>

            {/* COUNT */}

            <div className="w-fit rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
              {keyword.trim() ? filteredCourses.length : courses.length} khóa
              học
            </div>
          </div>
        </section>

        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="mt-8">
          <div className="relative">
            {/* SEARCH ICON */}

            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            {/* INPUT */}

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={`Tìm kiếm trong ${categoryName}...`}
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

            {/* CLEAR BUTTON */}

            {keyword && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Xóa tìm kiếm"
                className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* =================================================
              SEARCH RESULT INFO
          ================================================= */}

          {keyword.trim() && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-slate-500">
                Tìm thấy{" "}
                <span className="font-bold text-slate-800">
                  {filteredCourses.length}
                </span>{" "}
                khóa học với từ khóa{" "}
                <span className="font-semibold text-blue-600">"{keyword}"</span>
              </p>

              {/* CLEAR */}

              <button
                type="button"
                onClick={handleClearSearch}
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Xem tất cả khóa học
              </button>
            </div>
          )}
        </section>

        {/* =================================================
            COURSE LIST
        ================================================= */}

        <section className="mt-8">
          {/* =================================================
              NO RESULT
          ================================================= */}

          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-8 w-8 text-slate-300" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                Không tìm thấy khóa học
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {keyword.trim()
                  ? `Không có khóa học nào trong danh mục "${categoryName}" phù hợp với từ khóa "${keyword}".`
                  : `Danh mục "${categoryName}" hiện chưa có khóa học.`}
              </p>

              {keyword.trim() && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Xem tất cả khóa học
                </button>
              )}
            </div>
          ) : (
            <>
              {/* =================================================
                  COURSE LIST
              ================================================= */}

              <CategoryCourseList courses={displayedCourses} />

              {/* =================================================
                  LOAD MORE
              ================================================= */}

              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore || isFetching}
                    className="group inline-flex min-w-[200px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
                        Xem thêm khóa học
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* =================================================
                  SKELETON LOAD MORE
              ================================================= */}

              {isLoadingMore && (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      {/* IMAGE */}

                      <div className="aspect-[16/10] animate-pulse bg-slate-200" />

                      {/* CONTENT */}

                      <div className="space-y-3 p-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                        <div className="h-12 animate-pulse rounded bg-slate-200" />

                        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

                        <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* =================================================
                  END
              ================================================= */}

              {!hasMore && filteredCourses.length > 0 && (
                <div className="mt-10 text-center">
                  <div className="mx-auto h-px max-w-xs bg-slate-200" />

                  <p className="mt-4 text-sm font-medium text-slate-400">
                    🎉 Bạn đã xem hết tất cả khóa học trong danh mục này
                  </p>
                </div>
              )}

              {/* =================================================
                  SEARCH FOOTER
              ================================================= */}

              {keyword.trim() && (
                <div className="mt-8 text-center">
                  <p className="text-xs text-slate-400">
                    Kết quả được tìm kiếm trong toàn bộ khóa học của danh mục
                    này.
                  </p>

                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

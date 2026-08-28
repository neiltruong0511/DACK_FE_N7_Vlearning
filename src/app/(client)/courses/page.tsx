"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Heart,
  Search,
  Star,
  Users,
  Loader2,
  ChevronDown,
  X,
} from "lucide-react";

import { useCoursePagination, useCourses } from "@/hooks/useCourse";

import {
  addFavoriteCourse,
  removeFavoriteCourse,
  isFavoriteCourse,
} from "@/lib/favorite";

import { useToast } from "@/components/common/ToastProvider";

const PAGE_SIZE = 8;

export default function CoursesPage() {
  const toast = useToast();

  // =====================================================
  // PAGINATION
  // =====================================================

  const [page, setPage] = useState(1);

  const [allCourses, setAllCourses] = useState<any[]>([]);

  const [hasMore, setHasMore] = useState(true);

  // =====================================================
  // SEARCH
  // =====================================================

  const [keyword, setKeyword] = useState("");

  // =====================================================
  // FAVORITE
  // =====================================================

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // =====================================================
  // GET PAGINATION
  // =====================================================

  const {
    data: paginationData,
    isLoading,
    isFetching,
    error,
  } = useCoursePagination(page, PAGE_SIZE);

  // =====================================================
  // GET ALL COURSES
  //
  // Dùng riêng cho SEARCH
  // =====================================================

  const { data: allCoursesData, isLoading: isLoadingAllCourses } = useCourses();

  // =====================================================
  // LOAD FAVORITES
  // =====================================================

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("FAVORITE_COURSES");

    if (!stored) {
      setFavoriteIds([]);
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setFavoriteIds(parsed);
      } else {
        setFavoriteIds([]);
      }
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  // =====================================================
  // CHECK LOGIN
  // =====================================================

  const isLoggedIn = () => {
    if (typeof window === "undefined") {
      return false;
    }

    const token = localStorage.getItem("ACCESS_TOKEN");
    const userInfo = localStorage.getItem("USER_INFO");

    return !!token && !!userInfo;
  };

  // =====================================================
  // XỬ LÝ PAGINATION DATA
  // =====================================================

  useEffect(() => {
    if (!paginationData) return;

    const newCourses =
      paginationData?.items ||
      paginationData?.content?.items ||
      paginationData?.content ||
      [];

    if (!Array.isArray(newCourses)) {
      return;
    }

    // ===================================================
    // PAGE 1
    // ===================================================

    if (page === 1) {
      setAllCourses(newCourses);
    }

    // ===================================================
    // PAGE > 1
    // ===================================================
    else {
      setAllCourses((prev) => {
        const existingIds = new Set(prev.map((course) => course.maKhoaHoc));

        const uniqueCourses = newCourses.filter(
          (course: any) => !existingIds.has(course.maKhoaHoc),
        );

        return [...prev, ...uniqueCourses];
      });
    }

    // ===================================================
    // CHECK TOTAL PAGES
    // ===================================================

    const totalPages =
      paginationData?.totalPages || paginationData?.content?.totalPages;

    const totalCount =
      paginationData?.totalCount || paginationData?.content?.totalCount;

    if (totalPages) {
      setHasMore(page < totalPages);
      return;
    }

    if (totalCount) {
      const currentTotal = page * PAGE_SIZE;

      setHasMore(currentTotal < totalCount);
      return;
    }

    setHasMore(newCourses.length === PAGE_SIZE);
  }, [paginationData, page]);

  // =====================================================
  // LOAD MORE
  // =====================================================

  const handleLoadMore = () => {
    if (isFetching || !hasMore) return;

    setPage((prev) => prev + 1);
  };

  // =====================================================
  // SEARCH TOÀN BỘ KHÓA HỌC
  // =====================================================

  const searchCourses = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    // Không search
    // => hiển thị danh sách pagination bình thường
    if (!search) {
      return allCourses;
    }

    // ===================================================
    // LẤY TOÀN BỘ KHÓA HỌC TỪ API
    // ===================================================

    const courses = Array.isArray(allCoursesData) ? allCoursesData : [];

    return courses.filter((course: any) => {
      // Tên khóa học
      const name = String(course?.tenKhoaHoc || "").toLowerCase();

      // Mô tả
      const description = String(course?.moTa || "").toLowerCase();

      // Mã khóa học
      const courseId = String(course?.maKhoaHoc || "").toLowerCase();

      // Danh mục
      const category = String(
        course?.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "",
      ).toLowerCase();

      return (
        name.includes(search) ||
        description.includes(search) ||
        courseId.includes(search) ||
        category.includes(search)
      );
    });
  }, [keyword, allCourses, allCoursesData]);

  // =====================================================
  // COURSE LIST HIỂN THỊ
  // =====================================================

  const displayedCourses = keyword.trim() !== "" ? searchCourses : allCourses;

  // =====================================================
  // FAVORITE
  // =====================================================

  const handleFavorite = (
    e: React.MouseEvent<HTMLButtonElement>,
    courseId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!courseId) return;

    // ===================================================
    // CHƯA LOGIN
    // ===================================================

    if (!isLoggedIn()) {
      toast.error("Vui lòng đăng nhập để thêm khóa học vào yêu thích!");

      return;
    }

    // ===================================================
    // REMOVE
    // ===================================================

    if (isFavoriteCourse(courseId)) {
      removeFavoriteCourse(courseId);

      setFavoriteIds((prev) => prev.filter((id) => id !== courseId));

      toast.success("Đã xóa khỏi danh sách yêu thích!");

      return;
    }

    // ===================================================
    // ADD
    // ===================================================

    addFavoriteCourse(courseId);

    setFavoriteIds((prev) => {
      if (prev.includes(courseId)) {
        return prev;
      }

      return [...prev, courseId];
    });

    toast.success("Đã thêm vào danh sách yêu thích!");
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const getImageUrl = (image?: string) => {
    if (!image) {
      return "/placeholder.jpg";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `https://elearningnew.cybersoft.edu.vn/hinhanh/${image}`;
  };

  // =====================================================
  // INITIAL LOADING
  // =====================================================

  if (isLoading && page === 1) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Header Skeleton */}

          <div>
            <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />

            <div className="mt-3 h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />
          </div>

          {/* Search Skeleton */}

          <div className="mt-8 h-14 animate-pulse rounded-2xl bg-slate-200" />

          {/* Courses Skeleton */}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-[16/10] animate-pulse bg-slate-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                  <div className="h-12 animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

                  <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && page === 1) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <Search className="h-6 w-6 text-red-500" />
          </div>

          <h1 className="mt-4 text-xl font-bold text-red-500">
            Không thể tải khóa học
          </h1>

          <p className="mt-2 text-sm text-slate-500">Vui lòng thử lại sau.</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                <BookOpen className="h-4 w-4" />
                Khóa học
              </div>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Tất cả khóa học
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Khám phá và lựa chọn khóa học phù hợp với bạn.
              </p>
            </div>

            {/* COUNT */}

            <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
              {keyword.trim() ? searchCourses.length : allCourses.length} khóa
              học
            </div>
          </div>
        </section>

        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="mt-7">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm tên khóa học, mã khóa học, danh mục..."
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

            {/* CLEAR */}

            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                aria-label="Xóa tìm kiếm"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* SEARCH STATUS */}

          {keyword.trim() && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {isLoadingAllCourses ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tìm kiếm...
                  </span>
                ) : (
                  <>
                    Tìm thấy{" "}
                    <span className="font-bold text-slate-800">
                      {searchCourses.length}
                    </span>{" "}
                    khóa học với từ khóa{" "}
                    <span className="font-semibold text-blue-600">
                      "{keyword}"
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
        </section>

        {/* =================================================
            COURSE LIST
        ================================================= */}

        <section className="mt-8">
          {/* SEARCH LOADING */}

          {keyword.trim() && isLoadingAllCourses ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="aspect-[16/10] animate-pulse bg-slate-200" />

                  <div className="space-y-3 p-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                    <div className="h-12 animate-pulse rounded bg-slate-200" />

                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

                    <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedCourses.length === 0 ? (
            /* =================================================
               NO RESULT
            ================================================= */

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-8 w-8 text-slate-300" />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Không tìm thấy khóa học
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {keyword
                  ? `Không có khóa học phù hợp với từ khóa "${keyword}".`
                  : "Hiện chưa có khóa học nào."}
              </p>

              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Xem tất cả khóa học
                </button>
              )}
            </div>
          ) : (
            <>
              {/* =================================================
                  GRID
              ================================================= */}

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {displayedCourses.map((course: any) => {
                  const favorite = favoriteIds.includes(course.maKhoaHoc);

                  return (
                    <article
                      key={course.maKhoaHoc}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                    >
                      {/* =================================================
                            IMAGE
                        ================================================= */}

                      <Link
                        href={`/courses/${course.maKhoaHoc}`}
                        className="block"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                          <Image
                            src={getImageUrl(course.hinhAnh)}
                            alt={course.tenKhoaHoc || "Khóa học"}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />

                          {/* OVERLAY */}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                          {/* =================================================
                                FAVORITE
                            ================================================= */}

                          <button
                            type="button"
                            onClick={(e) => handleFavorite(e, course.maKhoaHoc)}
                            aria-label={
                              favorite
                                ? "Xóa khỏi yêu thích"
                                : "Thêm vào yêu thích"
                            }
                            className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur transition hover:scale-110 ${
                              favorite
                                ? "bg-red-50 text-red-500"
                                : "bg-white/90 text-slate-600 hover:bg-red-50 hover:text-red-500"
                            }`}
                          >
                            <Heart
                              className="h-4 w-4"
                              fill={favorite ? "currentColor" : "none"}
                            />
                          </button>

                          {/* CATEGORY */}

                          <span className="absolute bottom-3 left-3 max-w-[75%] truncate rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white">
                            {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc ||
                              "Khóa học"}
                          </span>
                        </div>
                      </Link>

                      {/* =================================================
                            CONTENT
                        ================================================= */}

                      <div className="p-4">
                        <h2 className="line-clamp-2 min-h-[48px] text-base font-bold leading-6 text-slate-900 transition group-hover:text-blue-600">
                          {course.tenKhoaHoc}
                        </h2>

                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                          {course.moTa || "Khóa học trực tuyến chất lượng cao."}
                        </p>

                        {/* META */}

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                            <span className="text-sm font-bold text-slate-800">
                              {course.danhGia || "4.9"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Users className="h-3.5 w-3.5" />

                            {course.luotXem || 0}
                          </div>
                        </div>

                        {/* DETAIL */}

                        <Link
                          href={`/courses/${course.maKhoaHoc}`}
                          className="mt-4 flex w-full items-center justify-center rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                        >
                          Xem khóa học
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* =================================================
                  LOAD MORE
                  CHỈ HIỆN KHI KHÔNG SEARCH
              ================================================= */}

              {!keyword.trim() && hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={isFetching}
                    className="group inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isFetching ? (
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
                  LOADING MORE
              ================================================= */}

              {isFetching && page > 1 && !keyword.trim() && (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <div className="aspect-[16/10] animate-pulse bg-slate-200" />

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

              {!keyword.trim() && !hasMore && allCourses.length > 0 && (
                <div className="mt-10 text-center">
                  <div className="mx-auto h-px max-w-xs bg-slate-200" />

                  <p className="mt-4 text-sm font-medium text-slate-400">
                    🎉 Bạn đã xem hết tất cả khóa học
                  </p>
                </div>
              )}

              {/* =================================================
                  SEARCH FOOTER
              ================================================= */}

              {keyword.trim() && (
                <div className="mt-8 text-center">
                  <p className="text-xs text-slate-400">
                    Đang tìm kiếm trên toàn bộ danh sách khóa học.
                  </p>

                  <button
                    type="button"
                    onClick={() => setKeyword("")}
                    className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Xem lại tất cả khóa học
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Heart, Search, Star, Users } from "lucide-react";

import { useCourses } from "@/hooks/useCourse";
import {
  addFavoriteCourse,
  removeFavoriteCourse,
  isFavoriteCourse,
} from "@/lib/favorite";

export default function CoursesPage() {
  const { data: courses, isLoading, error } = useCourses();

  const [keyword, setKeyword] = useState("");

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem("FAVORITE_COURSES");

    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });

  // =========================
  // TÌM KIẾM
  // =========================
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    const search = keyword.trim().toLowerCase();

    if (!search) {
      return courses;
    }

    return courses.filter((course: any) =>
      course.tenKhoaHoc?.toLowerCase().includes(search),
    );
  }, [courses, keyword]);

  // =========================
  // YÊU THÍCH
  // =========================
  const handleFavorite = (
    e: React.MouseEvent<HTMLButtonElement>,
    courseId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavoriteCourse(courseId)) {
      removeFavoriteCourse(courseId);

      setFavoriteIds((prev) => prev.filter((id) => id !== courseId));
    } else {
      addFavoriteCourse(courseId);

      setFavoriteIds((prev) => {
        if (prev.includes(courseId)) {
          return prev;
        }

        return [...prev, courseId];
      });
    }
  };

  // =========================
  // IMAGE
  // =========================
  const getImageUrl = (image?: string) => {
    if (!image) {
      return "/placeholder.jpg";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `https://elearningnew.cybersoft.edu.vn/hinhanh/${image}`;
  };

  // =========================
  // LOADING
  // =========================
  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />

          <div className="mt-8 h-12 animate-pulse rounded-xl bg-slate-200" />

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl bg-white">
                <div className="aspect-[16/10] animate-pulse bg-slate-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />

                  <div className="h-10 animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-500">
            Không thể tải khóa học
          </h1>

          <p className="mt-2 text-sm text-slate-500">Vui lòng thử lại sau.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                <BookOpen className="h-4 w-4" />
                Khóa học
              </div>

              <h1 className="mt-2 text-3xl font-black font-bold tracking-tight text-slate-900 sm:text-4xl">
                Tất cả khóa học
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Khám phá và lựa chọn khóa học phù hợp với bạn.
              </p>
            </div>

            <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
              {filteredCourses.length} khóa học
            </div>
          </div>
        </section>

        {/* ================= SEARCH ================= */}
        <section className="mt-7">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm khóa học..."
              className="h-13 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </section>

        {/* ================= COURSE LIST ================= */}
        <section className="mt-8">
          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Search className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Không tìm thấy khóa học
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Không có khóa học phù hợp với từ khóa "{keyword}".
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredCourses.map((course: any) => {
                const favorite = favoriteIds.includes(course.maKhoaHoc);

                return (
                  <article
                    key={course.maKhoaHoc}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >
                    {/* IMAGE */}
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

                        {/* FAVORITE */}
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
                        <span className="absolute bottom-3 left-3 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white">
                          {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc ||
                            "Khóa học"}
                        </span>
                      </div>
                    </Link>

                    {/* CONTENT */}
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
                            4.9
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
          )}
        </section>
      </div>
    </main>
  );
}

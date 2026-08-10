"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, BookOpen, ArrowRight, Trash2, Search } from "lucide-react";

import { useCourses } from "@/hooks/useCourse";
import { getFavoriteCourses, removeFavoriteCourse } from "@/lib/favorite";

export default function FavoriteCourses() {
  const { data: courses, isLoading } = useCourses();

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");

  // =========================
  // LẤY DANH SÁCH YÊU THÍCH
  // =========================
  useEffect(() => {
    setFavoriteIds(getFavoriteCourses());
  }, []);

  // =========================
  // LỌC KHÓA HỌC YÊU THÍCH
  // =========================
  const favoriteCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course: any) =>
      favoriteIds.includes(course.maKhoaHoc),
    );
  }, [courses, favoriteIds]);

  // =========================
  // TÌM KIẾM
  // =========================
  const filteredCourses = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    if (!search) return favoriteCourses;

    return favoriteCourses.filter((course: any) =>
      course.tenKhoaHoc?.toLowerCase().includes(search),
    );
  }, [favoriteCourses, keyword]);

  // =========================
  // XÓA YÊU THÍCH
  // =========================
  const handleRemoveFavorite = (maKhoaHoc: string) => {
    removeFavoriteCourse(maKhoaHoc);

    setFavoriteIds((prev) => prev.filter((id) => id !== maKhoaHoc));
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8">
        <p className="text-sm text-slate-500">Đang tải khóa học yêu thích...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" fill="currentColor" />

              <h2 className="text-2xl font-bold text-slate-900">
                Khóa học yêu thích
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Những khóa học bạn đã lưu để xem lại sau.
            </p>
          </div>

          <div className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-500">
            {favoriteCourses.length} khóa học
          </div>
        </div>

        {/* SEARCH */}
        {favoriteCourses.length > 0 && (
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm khóa học yêu thích..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        )}
      </div>

      {/* EMPTY */}
      {favoriteCourses.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-400">
            <Heart className="h-8 w-8" fill="currentColor" />
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-900">
            Chưa có khóa học yêu thích
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Bạn có thể nhấn biểu tượng ❤️ ở trang chi tiết khóa học để lưu khóa
            học tại đây.
          </p>

          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Khám phá khóa học
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* KHÔNG TÌM THẤY */}
      {favoriteCourses.length > 0 && filteredCourses.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <Search className="mx-auto h-10 w-10 text-slate-300" />

          <h3 className="mt-4 font-bold text-slate-900">
            Không tìm thấy khóa học
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Không có khóa học nào phù hợp với "{keyword}".
          </p>
        </div>
      )}

      {/* LIST */}
      {filteredCourses.length > 0 && (
        <div className="space-y-3">
          {filteredCourses.map((course: any) => (
            <div
              key={course.maKhoaHoc}
              className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:flex-row sm:items-center"
            >
              {/* IMAGE */}
              <img
                src={
                  course.hinhAnh?.startsWith("http")
                    ? course.hinhAnh
                    : `https://elearningnew.cybersoft.edu.vn/hinhanh/${course.hinhAnh}`
                }
                alt={course.tenKhoaHoc || "Khóa học"}
                className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-40"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/400x250?text=No+Image";
                }}
              />

              {/* INFO */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                  <BookOpen className="h-4 w-4" />
                  {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Khóa học"}
                </div>

                <h3 className="mt-1 line-clamp-2 text-base font-bold text-slate-900">
                  {course.tenKhoaHoc}
                </h3>

                <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                  {course.moTa || "Chưa có mô tả."}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex shrink-0 gap-2 sm:flex-col">
                <Link
                  href={`/courses/${course.maKhoaHoc}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Xem khóa học
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleRemoveFavorite(course.maKhoaHoc)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

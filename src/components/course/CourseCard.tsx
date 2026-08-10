"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BookOpen, Eye, User } from "lucide-react";
import { Heart } from "lucide-react";
import {
  addFavoriteCourse,
  removeFavoriteCourse,
  isFavoriteCourse,
} from "@/lib/favorite";

interface CourseCardProps {
  course: any;
}

export default function CourseCard({ course }: CourseCardProps) {
  const getImageUrl = (image: string) => {
    if (!image) {
      return "https://placehold.co/600x400?text=No+Image";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `https://elearningnew.cybersoft.edu.vn/hinhanh/${image}`;
  };

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem("FAVORITE_COURSES");

    if (stored) {
      try {
        setFavoriteIds(JSON.parse(stored));
      } catch {
        setFavoriteIds([]);
      }
    }
  }, []);
  const handleFavorite = (courseId: string) => {
    if (!courseId) return;

    if (isFavoriteCourse(courseId)) {
      removeFavoriteCourse(courseId);

      setFavoriteIds((prev) => prev.filter((id) => id !== courseId));
    } else {
      addFavoriteCourse(courseId);

      setFavoriteIds((prev) => [...prev, courseId]);
    }
  };

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10">
      {/* Image Section - Giữ nguyên h-60 và overlay */}
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(course.hinhAnh)}
          alt={course.tenKhoaHoc}
          className="h-60 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
          }}
        />

        {/* Overlay - Làm nhẹ hơn một chút để ảnh rõ hơn */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Category - Badge nhỏ gọn, bo tròn hơn */}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700 backdrop-blur-sm shadow-sm">
          {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Khóa học"}
        </span>

        {/* Favourite - Button glassmorphism tinh tế */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavorite(course.maKhoaHoc);
          }}
          title={
            favoriteIds.includes(course.maKhoaHoc)
              ? "Xóa khỏi yêu thích"
              : "Thêm vào yêu thích"
          }
          className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all hover:scale-110 ${
            favoriteIds.includes(course.maKhoaHoc)
              ? "bg-red-50 text-red-500"
              : "bg-white/60 text-slate-700 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <Heart
            size={18}
            fill={
              favoriteIds.includes(course.maKhoaHoc) ? "currentColor" : "none"
            }
          />
        </button>

        {/* Rating - Badge tối giản góc dưới */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm">
          {/* Nên thay bằng <Star size={14} className="text-yellow-500" /> */}⭐{" "}
          <span className="text-sm">4.9</span>
        </div>
      </div>

      {/* Body Section - Giảm nhẹ padding để tổng thể gọn hơn */}
      <div className="space-y-4 p-5">
        {/* Title - Tăng font weight, màu Slate đậm hơn */}
        <h2 className="line-clamp-2 min-h-[56px] text-xl font-extrabold leading-tight text-slate-950 transition group-hover:text-blue-600">
          {course.tenKhoaHoc}
        </h2>

        {/* Description - Giảm line-height một chút */}
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
          {course.moTa}
        </p>

        {/* Divider - Mờ hơn */}
        <div className="border-t border-slate-100"></div>

        {/* Info Section */}
        <div className="space-y-3.5 text-sm">
          {/* Instructor */}
          <div className="flex items-center gap-3">
            {/* Avatarbg mờ hơn, icon nhỏ hơn */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
              <User size={18} className="text-blue-500" />
            </div>

            <div>
              {/* Label phụ */}
              <p className="text-xs text-slate-400">Giảng viên</p>
              <p className="font-semibold text-slate-900">
                {course.nguoiTao?.hoTen || "Admin"}
              </p>
            </div>
          </div>

          {/* Stats - Màu icon mờ hơn màu chữ */}
          <div className="flex items-center justify-between font-medium text-slate-600 bg-slate-50/50 p-2 rounded-xl">
            <div className="flex items-center gap-1.5">
              <Eye size={16} className="text-slate-400" />
              <span>{course.luotXem || 0} lượt xem</span>
            </div>

            <div className="flex items-center gap-1.5">
              <BookOpen size={16} className="text-slate-400" />
              <span>Mã nhóm: {course.maNhom}</span>
            </div>
          </div>
        </div>

        {/* Footer Section - Border mờ hơn, padding top ít hơn */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Học phí
            </p>
            {/* Đổi sang màu xanh lá cho tích cực */}
            <p className="text-2xl font-bold text-emerald-600">Miễn phí</p>
          </div>

          <Link
            href={`/courses/${course.maKhoaHoc}`}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
          >
            Chi tiết →
          </Link>
        </div>
      </div>
    </div>
  );
}

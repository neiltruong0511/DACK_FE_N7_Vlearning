"use client";

import Link from "next/link";
import { BookOpen, Eye, User } from "lucide-react";

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

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(course.hinhAnh)}
          alt={course.tenKhoaHoc}
          className="h-60 w-full object-cover transition duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category */}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-600 backdrop-blur">
          {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc}
        </span>

        {/* Favourite */}
        <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur transition hover:bg-red-500 hover:text-white">
          ❤
        </button>

        {/* Rating */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-sm font-semibold text-white shadow">
          ⭐ 4.9
        </div>
      </div>

      {/* Body */}
      <div className="space-y-5 p-6">
        <h2 className="line-clamp-2 min-h-[60px] text-xl font-bold leading-8 text-slate-900 transition group-hover:text-blue-600">
          {course.tenKhoaHoc}
        </h2>

        <p className="line-clamp-2 text-sm leading-7 text-slate-500">
          {course.moTa}
        </p>

        {/* Divider */}
        <div className="border-t border-slate-100"></div>

        {/* Info */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <User size={18} className="text-blue-600" />
            </div>

            <div>
              <p className="font-medium text-slate-800">
                {course.nguoiTao?.hoTen}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center gap-2">
              <Eye size={16} />

              <span>{course.luotXem || 0}</span>
            </div>

            <div className="flex items-center gap-2">
              <BookOpen size={16} />

              <span>{course.maNhom}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Học phí
            </p>

            <p className="text-2xl font-bold text-blue-600">Miễn phí</p>
          </div>

          <Link
            href={`/courses/${course.maKhoaHoc}`}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Chi tiết →
          </Link>
        </div>
      </div>
    </div>
  );
}

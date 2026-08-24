"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock3, Users, Star, BookOpen } from "lucide-react";

type Props = {
  course: any;
};

export default function SearchCard({ course }: Props) {
  const description = String(course.moTa || "").replace(/<[^>]*>?/gm, "");

  const category = course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Khóa học";

  const teacher = course.nguoiTao?.hoTen || "Giảng viên";

  return (
    <article className="group w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_30px_rgba(37,99,235,0.10)]">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
        {/* =====================================================
            IMAGE
        ===================================================== */}

        <Link
          href={`/courses/${course.maKhoaHoc}`}
          className="relative block h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-[160px] sm:w-[220px]"
        >
          <Image
            src={course.hinhAnh}
            alt={course.tenKhoaHoc || "Khóa học"}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70" />

          {/* Category badge */}

          <div className="absolute left-3 top-3 max-w-[calc(100%-24px)]">
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-blue-600 shadow-sm backdrop-blur">
              <BookOpen className="h-3 w-3 shrink-0" />

              <span className="truncate">{category}</span>
            </span>
          </div>

          {/* Bottom badge */}

          <div className="absolute bottom-3 left-3">
            <span className="rounded-md bg-slate-900/65 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              Online
            </span>
          </div>
        </Link>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="flex min-w-0 flex-1 flex-col px-1 py-0.5">
          {/* Category */}

          <div className="flex min-w-0 items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />

            <span className="min-w-0 truncate text-[11px] font-bold uppercase tracking-wide text-blue-600">
              {category}
            </span>
          </div>

          {/* Title */}

          <Link
            href={`/courses/${course.maKhoaHoc}`}
            title={course.tenKhoaHoc}
            className="mt-1.5 min-w-0 max-w-full"
          >
            <h2 className="line-clamp-2 break-words text-[20px] font-bold leading-6 text-slate-900 transition-colors group-hover:text-blue-600">
              {course.tenKhoaHoc}
            </h2>
          </Link>

          {/* Description */}

          <p
            title={description}
            className="mt-2 line-clamp-2 max-w-full overflow-hidden break-all text-[13px] leading-5 text-slate-500"
          >
            {description || "Khóa học cung cấp kiến thức hữu ích và thực tế."}
          </p>

          {/* Rating */}

          <div className="mt-3 flex items-center gap-1.5">
            <div className="flex shrink-0 items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-3.5 w-3.5 text-amber-400"
                  fill="currentColor"
                />
              ))}
            </div>

            <span className="text-xs font-bold text-slate-700">5.0</span>

            <span className="text-xs text-slate-400">• Đánh giá</span>
          </div>

          {/* Info */}

          <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
            {/* Views */}

            <div className="flex shrink-0 items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400" />

              <span>
                {Number(course.luotXem || 0).toLocaleString("vi-VN")} lượt xem
              </span>
            </div>

            {/* Duration */}

            <div className="flex shrink-0 items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-slate-400" />

              <span>8 giờ học</span>
            </div>

            {/* Teacher */}

            <div title={teacher} className="min-w-0 max-w-[150px] truncate">
              {teacher}
            </div>
          </div>

          {/* Bottom */}

          <div className="mt-3 flex items-center justify-end border-t border-slate-100 pt-3">
            <Link
              href={`/courses/${course.maKhoaHoc}`}
              className="group/button inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            >
              <span>Xem chi tiết</span>

              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/button:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

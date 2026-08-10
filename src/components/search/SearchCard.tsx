"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock3, Users, Star } from "lucide-react";

type Props = {
  course: any;
};

export default function SearchCard({ course }: Props) {
  return (
    <div className="flex gap-6 rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-xl">
      {/* Image */}

      <div className="relative h-44 w-72 overflow-hidden rounded-2xl">
        <Image
          src={course.hinhAnh}
          alt={course.tenKhoaHoc}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}

      <div className="flex flex-1 flex-col">
        <span className="text-sm font-semibold text-blue-600">
          {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc}
        </span>

        <h2 className="mt-2 text-2xl font-bold">{course.tenKhoaHoc}</h2>

        <p className="mt-3 line-clamp-2 text-gray-500">
          {course.moTa.replace(/<[^>]*>?/gm, "")}
        </p>

        {/* Rating */}

        <div className="mt-4 flex items-center gap-1 text-yellow-500">
          <Star fill="currentColor" size={18} />
          <Star fill="currentColor" size={18} />
          <Star fill="currentColor" size={18} />
          <Star fill="currentColor" size={18} />
          <Star fill="currentColor" size={18} />

          <span className="ml-2 text-gray-500">(5.0)</span>
        </div>

        {/* Info */}

        <div className="mt-4 flex gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock3 size={18} />8 giờ
          </div>

          <div className="flex items-center gap-2">
            <Users size={18} />
            {course.luotXem}
          </div>

          <div>{course.nguoiTao?.hoTen}</div>
        </div>
      </div>

      {/* Button */}

      <div className="flex items-center">
        <Link
          href={`/courses/${course.maKhoaHoc}`}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}

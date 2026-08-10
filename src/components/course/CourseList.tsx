"use client";

import { useState } from "react";
import { useCoursePagination } from "@/hooks/useCourse";
import CourseCard from "./CourseCard";
import CourseLoading from "@/components/common/CourseLoading";

export default function CourseList() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useCoursePagination(page, 8);

  if (isLoading) {
    return <CourseLoading />;
  }

  if (error) {
    return (
      <p className="py-20 text-center text-red-500">Không thể tải khóa học.</p>
    );
  }

  return (
    <section className="relative py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-white to-slate-100" />

      {/* Header */}
      <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            🚀 Học tập không giới hạn
          </span>

          <h2 className="mt-6 text-5xl font-bold leading-tight text-slate-900">
            Khám phá những
            <span className="block text-blue-600">khóa học nổi bật</span>
          </h2>

          <div className="mt-8 flex flex-wrap gap-6">
            <div>
              <h3 className="text-3xl font-bold text-blue-600">200+</h3>
              <p className="text-slate-500">Khóa học</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-blue-600">30K+</h3>
              <p className="text-slate-500">Học viên</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-blue-600">100+</h3>
              <p className="text-slate-500">Giảng viên</p>
            </div>
          </div>
        </div>

        <button className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-1 hover:bg-blue-700">
          Khám phá tất cả →
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {data?.items?.map((course: any) => (
          <CourseCard key={course.maKhoaHoc} course={course} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-20 flex items-center justify-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="rounded-full border px-5 py-3 transition hover:border-blue-600 hover:text-blue-600 disabled:opacity-40"
        >
          ←
        </button>

        {Array.from({ length: data?.totalPages || 0 }).map((_, index) => {
          const current = index + 1;

          if (
            current === 1 ||
            current === data?.totalPages ||
            (current >= page - 1 && current <= page + 1)
          ) {
            return (
              <button
                key={current}
                onClick={() => setPage(current)}
                className={`h-12 w-12 rounded-full font-semibold transition-all ${
                  page === current
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30"
                    : "bg-white border hover:border-blue-500 hover:text-blue-600"
                }`}
              >
                {current}
              </button>
            );
          }

          if (current === page - 2 || current === page + 2) {
            return (
              <span key={current} className="text-gray-400">
                ...
              </span>
            );
          }

          return null;
        })}

        <button
          disabled={page === data?.totalPages}
          onClick={() => setPage(page + 1)}
          className="rounded-full border px-5 py-3 transition hover:border-blue-600 hover:text-blue-600 disabled:opacity-40"
        >
          →
        </button>
      </div>
    </section>
  );
}

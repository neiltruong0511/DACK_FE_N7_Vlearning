"use client";

import { useSearchParams } from "next/navigation";
import { useSearchCourse } from "@/hooks/useCourse";
import SearchHero from "@/components/search/SearchHero";
import SearchSidebar from "@/components/search/SearchSidebar";
import SearchCard from "@/components/search/SearchCard";
import { Suspense, useState } from "react";

function SearchContent() {
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") || "";

  const { data, isLoading } = useSearchCourse(keyword);

  const [category, setCategory] = useState("Tất cả");

  if (isLoading) {
    return <section className="py-20 text-center">Đang tìm kiếm...</section>;
  }
  const categories: string[] = [
    "Tất cả",
    ...Array.from(
      new Set(
        (data ?? []).map((item: any) => item.danhMucKhoaHoc?.tenDanhMucKhoaHoc),
      ),
    ).filter((item): item is string => Boolean(item)),
  ];
  const filteredCourses =
    category === "Tất cả"
      ? (data ?? [])
      : (data ?? []).filter(
          (course: any) =>
            course.danhMucKhoaHoc?.tenDanhMucKhoaHoc === category,
        );

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <SearchHero keyword={keyword} total={data?.length || 0} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">
        <SearchSidebar
          categories={categories}
          category={category}
          setCategory={setCategory}
        />

        <div>
          {filteredCourses.length === 0 ? (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-3xl border bg-white shadow-sm">
              <img src="/empty-search.svg" alt="No Result" className="w-64" />

              <h2 className="mt-6 text-3xl font-bold">
                Không tìm thấy khóa học
              </h2>

              <p className="mt-2 text-gray-500">Hãy thử từ khóa khác.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCourses.map((course: any) => (
                <SearchCard key={course.maKhoaHoc} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<section className="py-20 text-center">Đang tải tìm kiếm...</section>}>
      <SearchContent />
    </Suspense>
  );
}

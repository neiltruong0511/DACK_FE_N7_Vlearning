"use client";

import { useParams } from "next/navigation";
import { useCourseByCategory } from "@/hooks/useCourse";

import CategoryCourseList from "@/components/course/CategoryCourseList";
import CourseLoading from "@/components/common/CourseLoading";

export default function CategoryPage() {
  const { category } = useParams();

  const { data: courses = [], isLoading } = useCourseByCategory(
    category as string,
  );

  if (isLoading) {
    return <CourseLoading />;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="mb-10 text-5xl font-black font-normal">
        {courses[0]?.danhMucKhoaHoc?.tenDanhMucKhoaHoc}
      </h1>

      <CategoryCourseList courses={courses} />
    </main>
  );
}

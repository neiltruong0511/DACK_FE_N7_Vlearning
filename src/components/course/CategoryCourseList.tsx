"use client";

import CourseCard from "./CourseCard";

interface Props {
  courses: any[];
}

export default function CategoryCourseList({ courses }: Props) {
  return (
    <section className="py-10">
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.maKhoaHoc} course={course} />
        ))}
      </div>
    </section>
  );
}

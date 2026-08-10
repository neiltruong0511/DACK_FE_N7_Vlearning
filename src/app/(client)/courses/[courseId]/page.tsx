import CourseDetail from "@/components/course/CourseDetail";

interface Props {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { courseId } = await params;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <CourseDetail courseId={courseId} />
    </main>
  );
}

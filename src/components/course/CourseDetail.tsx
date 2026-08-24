"use client";

import Image from "next/image";
import Link from "next/link";
import { useRegisterCourse } from "@/hooks/useCourse";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Users,
  BookOpen,
  Clock,
  Globe,
  CheckCircle2,
  PlayCircle,
  Award,
  Code2,
  HelpCircle,
  RefreshCw,
  Video,
  FileCode2,
  Sparkles,
} from "lucide-react";

import { Heart } from "lucide-react";

import {
  addFavoriteCourse,
  removeFavoriteCourse,
  isFavoriteCourse,
} from "@/lib/favorite";

import { useCourseDetail } from "@/hooks/useCourse";
import CourseLoading from "@/components/common/CourseLoading";
import { useToast } from "@/components/common/ToastProvider";

interface Props {
  courseId: string;
}

export default function CourseDetail({ courseId }: Props) {
  const router = useRouter();
  const toast = useToast();

  const { data: course, isLoading, error } = useCourseDetail(courseId);

  const registerCourse = useRegisterCourse();

  const [registerMessage, setRegisterMessage] = useState("");

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!course?.maKhoaHoc) return;

    const userInfo = localStorage.getItem("USER_INFO");
    if (!userInfo) {
      setIsFavorite(false);
      return;
    }

    setIsFavorite(isFavoriteCourse(course.maKhoaHoc));
  }, [course?.maKhoaHoc]);

  const getImageUrl = (image?: string) => {
    if (!image) {
      return "https://placehold.co/900x500?text=No+Image";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `https://elearningnew.cybersoft.edu.vn/hinhanh/${image}`;
  };

  if (isLoading) {
    return <CourseLoading />;
  }
  if (error || !course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-medium text-red-500">
          Không tìm thấy khóa học.
        </p>
      </div>
    );
  }

  const handleRegisterCourse = () => {
    const userInfo = localStorage.getItem("USER_INFO");

    if (!userInfo) {
      toast.error("Vui lòng đăng nhập để đăng ký khóa học!");
      router.push("/login");
      return;
    }

    const user = JSON.parse(userInfo);

    console.log("COURSE:", course);
    console.log("maKhoaHoc:", course.maKhoaHoc);
    console.log("taiKhoan:", user.taiKhoan);

    if (!user.taiKhoan) {
      toast.error("Không tìm thấy thông tin tài khoản!");
      return;
    }

    if (!course?.maKhoaHoc) {
      toast.error("Không tìm thấy mã khóa học!");
      return;
    }

    registerCourse.mutate(
      {
        maKhoaHoc: course.maKhoaHoc,
        taiKhoan: user.taiKhoan,
      },
      {
        onSuccess: () => {
          const stored = localStorage.getItem("MY_COURSES");

          const myCourses: string[] = stored ? JSON.parse(stored) : [];

          if (!myCourses.includes(course.maKhoaHoc)) {
            myCourses.push(course.maKhoaHoc);
          }

          localStorage.setItem("MY_COURSES", JSON.stringify(myCourses));

          toast.success("Đăng ký khóa học thành công!");

          router.push("/my-courses");
        },
        onError: (error) => {
          console.error(error);
          toast.error("Đăng ký khóa học thất bại!");
        },
      },
    );
  };

  const handleFavorite = () => {
    if (!course?.maKhoaHoc) return;

    // Kiểm tra đăng nhập
    const userInfo = localStorage.getItem("USER_INFO");

    if (!userInfo) {
      toast.error("Vui lòng đăng nhập để thêm khóa học vào yêu thích!");
      router.push("/login");
      return;
    }

    if (isFavorite) {
      removeFavoriteCourse(course.maKhoaHoc);
      setIsFavorite(false);

      toast.success("Đã xóa khỏi danh sách yêu thích!");
    } else {
      addFavoriteCourse(course.maKhoaHoc);
      setIsFavorite(true);

      toast.success("Đã thêm vào danh sách yêu thích!");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Quay lại danh sách khóa học
      </Link>

      {/* ================= HERO SECTION ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white shadow-2xl">
        {/* Background decorative blur elements */}
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 grid items-center gap-8 p-8 lg:grid-cols-12 lg:p-12">
          {/* LEFT */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-300 ring-1 ring-inset ring-cyan-500/30 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Lập trình Web"}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">
              {course.tenKhoaHoc}
            </h1>

            <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
              {course.moTa}
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
                  <Star className="h-5 w-5 fill-amber-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">4.9</p>
                  <p className="text-xs text-slate-400">1.200 đánh giá</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/20">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">
                    {course.luotXem || 0}
                  </p>
                  <p className="text-xs text-slate-400">Học viên</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 ring-1 ring-cyan-400/20">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">28</p>
                  <p className="text-xs text-slate-400">Bài học</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative lg:col-span-5">
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 p-2 shadow-2xl backdrop-blur-sm">
              <Image
                src={getImageUrl?.(course.hinhAnh) || "/placeholder.jpg"}
                alt={course.tenKhoaHoc}
                width={900}
                height={600}
                priority
                className="aspect-video w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Progress Card */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-slate-900/80 p-4 shadow-xl backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Tiến độ học tập</span>
                  <span className="text-cyan-400">0%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full w-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* LEFT MAIN CONTENT */}
        <div className="space-y-8 lg:col-span-8">
          {/* Bạn sẽ học được gì */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Bạn sẽ học được gì
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "HTML5 & CSS3 Standard",
                "JavaScript ES6+ Modern",
                "ReactJS Core Concepts",
                "Next.js App Router",
                "Tích hợp RESTful API",
                "Responsive Web Design",
                "Deploy Website lên Vercel",
                "Clean Code & Best Practices",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-colors hover:bg-slate-50"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nội dung khóa học */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Nội dung khóa học
              </h2>
              <span className="text-xs font-semibold text-slate-500 sm:text-sm">
                28 bài học • 12 giờ thời lượng
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {[
                {
                  title: "Chương 1: Giới thiệu khóa học",
                  lessons: [
                    "Tổng quan khóa học và Lộ trình",
                    "Cài đặt môi trường làm việc VS Code",
                  ],
                },
                {
                  title: "Chương 2: HTML & CSS Nâng cao",
                  lessons: [
                    "HTML5 Semantic & SEO",
                    "CSS Flexbox & Grid Master",
                    "Responsive với Tailwind CSS",
                  ],
                },
                {
                  title: "Chương 3: JavaScript ES6+",
                  lessons: [
                    "ES6 Syntax, Arrow Function, Destructuring",
                    "Xử lý bất đồng bộ: Promise & Async/Await",
                  ],
                },
                {
                  title: "Chương 4: ReactJS & NextJS",
                  lessons: [
                    "Component Architecture",
                    "Hooks cơ bản đến nâng cao",
                    "Routing và Data Fetching",
                  ],
                },
              ].map((chapter, index) => (
                <details
                  key={index}
                  className="group rounded-xl border border-slate-200 bg-white transition-all [&[open]]:shadow-sm"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-4 font-semibold text-slate-800 transition-colors hover:bg-slate-50/80">
                    <div className="flex items-center gap-3 text-sm sm:text-base">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span>{chapter.title}</span>
                    </div>
                    <span className="text-xs font-normal text-slate-500">
                      {chapter.lessons.length} bài
                    </span>
                  </summary>

                  <div className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/30">
                    {chapter.lessons.map((lesson) => (
                      <div
                        key={lesson}
                        className="flex items-center justify-between px-5 py-3.5 text-xs transition-colors hover:bg-white sm:text-sm"
                      >
                        <div className="flex items-center gap-3 text-slate-700">
                          <PlayCircle className="h-4 w-4 text-slate-400" />
                          <span>{lesson}</span>
                        </div>
                        <span className="cursor-pointer rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100">
                          Học thử
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Mô tả khóa học */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">
              Mô tả khóa học
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              {course.moTa}
            </p>
          </div>

          {/* Giảng viên */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">
              Giảng viên
            </h2>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  course.nguoiTao?.hoTen || "Admin",
                )}&background=2563eb&color=fff&size=200`}
                alt={course.nguoiTao?.hoTen}
                className="h-20 w-20 rounded-2xl object-cover ring-4 ring-blue-50"
              />
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">
                  {course.nguoiTao?.hoTen || "Chưa cập nhật"}
                </h3>
                <p className="text-xs font-medium text-blue-600 sm:text-sm">
                  Senior FullStack Developer
                </p>
                <p className="pt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Hơn 8 năm kinh nghiệm phát triển Web với React, NodeJS, NextJS
                  và đã đào tạo hơn 20.000 học viên trên toàn quốc.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:col-span-4">
          <div className="sticky top-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-100">
            {/* CTA Button */}
            <div className="flex gap-3">
              <button
                onClick={handleRegisterCourse}
                disabled={registerCourse.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {registerCourse.isPending
                  ? "⏳ Đang đăng ký..."
                  : "🚀 Đăng ký học ngay"}
              </button>

              <button
                type="button"
                onClick={handleFavorite}
                title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition ${
                  isFavorite
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Heart
                  className="h-6 w-6"
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </button>
            </div>

            <div className="my-6 border-t border-slate-100" />

            {/* Course Features Metadata */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" /> Giảng viên
                </span>
                <span className="font-semibold text-slate-900">
                  {course.nguoiTao?.hoTen || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-slate-400" /> Số bài học
                </span>
                <span className="font-semibold text-slate-900">28 bài</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" /> Thời lượng
                </span>
                <span className="font-semibold text-slate-900">12 giờ</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-400" /> Ngôn ngữ
                </span>
                <span className="font-semibold text-slate-900">Tiếng Việt</span>
              </div>
            </div>

            {/* Inclusions */}
            <div className="mt-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Khóa học bao gồm:
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs text-slate-600 sm:text-sm">
                <li className="flex items-center gap-2.5">
                  <Video className="h-4 w-4 text-blue-600" /> 28 Video chất
                  lượng HD
                </li>
                <li className="flex items-center gap-2.5">
                  <FileCode2 className="h-4 w-4 text-blue-600" /> Full Source
                  Code thực hành
                </li>
                <li className="flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-blue-600" /> Hỗ trợ giải
                  đáp 24/7
                </li>
                <li className="flex items-center gap-2.5">
                  <RefreshCw className="h-4 w-4 text-blue-600" /> Cập nhật nội
                  dung trọn đời
                </li>
                <li className="flex items-center gap-2.5">
                  <Award className="h-4 w-4 text-blue-600" /> Chứng chỉ hoàn
                  thành
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

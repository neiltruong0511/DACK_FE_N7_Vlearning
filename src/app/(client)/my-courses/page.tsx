"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  PlayCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

import { useCourses, useCancelEnrollment } from "@/hooks/useCourse";
import { useToast } from "@/components/common/ToastProvider";
import { getImageUrl } from "@/lib/image";
const PLACEHOLDER_IMAGE = "/course-placeholder.jpg";

export default function MyCoursesPage() {
  const { data: courses, isLoading } = useCourses();
  const cancelEnrollment = useCancelEnrollment();
  const toast = useToast();

  const [myCourseIds, setMyCourseIds] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [courseToCancel, setCourseToCancel] = useState<any>(null);

  // =====================================================
  // LẤY KHÓA HỌC ĐÃ ĐĂNG KÝ
  // =====================================================

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("MY_COURSES");

    if (!stored) {
      setMyCourseIds([]);
      return;
    }

    try {
      const data = JSON.parse(stored);

      if (Array.isArray(data)) {
        setMyCourseIds(data);
      } else {
        setMyCourseIds([]);
      }
    } catch (error) {
      console.error("MY_COURSES PARSE ERROR:", error);
      setMyCourseIds([]);
    }
  }, []);

  // =====================================================
  // LỌC KHÓA HỌC CỦA TÔI
  // =====================================================

  const myCourses = useMemo(() => {
    if (!Array.isArray(courses)) {
      return [];
    }

    return courses.filter((course: any) =>
      myCourseIds.includes(course.maKhoaHoc),
    );
  }, [courses, myCourseIds]);

  // =====================================================
  // TÌM KIẾM
  // =====================================================

  const filteredCourses = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    if (!search) {
      return myCourses;
    }

    return myCourses.filter((course: any) => {
      const name = String(course.tenKhoaHoc || "").toLowerCase();

      const description = String(course.moTa || "").toLowerCase();

      return name.includes(search) || description.includes(search);
    });
  }, [myCourses, keyword]);

  // =====================================================
  // URL ẢNH
  // =====================================================

  const getImageUrl = (image?: string) => {
    if (!image || !image.trim()) {
      return PLACEHOLDER_IMAGE;
    }

    const imageName = image.trim();

    if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
      return imageName;
    }

    return `https://elearningnew.cybersoft.edu.vn/hinhanh/${imageName}`;
  };

  // =====================================================
  // XÓA KHÓA HỌC KHỎI LOCALSTORAGE
  // =====================================================

  const removeCourseFromMyCourses = (courseId: string) => {
    if (typeof window === "undefined") return;

    setMyCourseIds((prev) => {
      const updatedCourses = prev.filter((id) => id !== courseId);

      localStorage.setItem("MY_COURSES", JSON.stringify(updatedCourses));

      return updatedCourses;
    });

    setCourseToCancel(null);

    toast.success("Hủy khóa học thành công!");
  };

  // =====================================================
  // MỞ MODAL HỦY KHÓA HỌC
  // =====================================================

  const handleCancelCourse = (course: any) => {
    if (typeof window === "undefined") return;

    const userInfo = localStorage.getItem("USER_INFO");

    if (!userInfo) {
      toast.error("Vui lòng đăng nhập lại!");
      return;
    }

    let user;

    try {
      user = JSON.parse(userInfo);
    } catch {
      toast.error("Thông tin tài khoản không hợp lệ!");
      return;
    }

    if (!user?.taiKhoan) {
      toast.error("Không tìm thấy tài khoản!");
      return;
    }

    setCourseToCancel(course);
  };

  // =====================================================
  // XÁC NHẬN HỦY KHÓA HỌC
  // =====================================================

  const confirmCancelCourse = () => {
    const course = courseToCancel;

    if (!course) return;

    if (typeof window === "undefined") return;

    const userInfo = localStorage.getItem("USER_INFO");

    if (!userInfo) {
      setCourseToCancel(null);
      toast.error("Vui lòng đăng nhập lại!");
      return;
    }

    let user;

    try {
      user = JSON.parse(userInfo);
    } catch {
      setCourseToCancel(null);
      toast.error("Thông tin tài khoản không hợp lệ!");
      return;
    }

    if (!user?.taiKhoan) {
      setCourseToCancel(null);
      toast.error("Không tìm thấy tài khoản!");
      return;
    }

    cancelEnrollment.mutate(
      {
        maKhoaHoc: course.maKhoaHoc,
        taiKhoan: user.taiKhoan,
      },
      {
        // =================================================
        // API THỰC SỰ TRẢ SUCCESS
        // =================================================

        onSuccess: () => {
          removeCourseFromMyCourses(course.maKhoaHoc);
        },

        // =================================================
        // CYBERSOFT CÓ TRƯỜNG HỢP:
        // HTTP 500 NHƯNG CONTENT = "Khóa học đã được hủy!"
        // =================================================

        onError: (error: any) => {
          console.error("CANCEL COURSE ERROR:", error);

          console.error("API:", error?.response?.data);

          const apiData = error?.response?.data;

          let message = "";

          if (typeof apiData === "string") {
            message = apiData;
          } else {
            message = apiData?.content || apiData?.message || "";
          }

          console.log("CANCEL COURSE MESSAGE:", message);

          // =================================================
          // TRƯỜNG HỢP ĐẶC BIỆT:
          // API TRẢ 500 NHƯNG KHÓA HỌC ĐÃ HỦY
          // =================================================

          const normalizedMessage = String(message).trim().toLowerCase();

          if (normalizedMessage.includes("khóa học đã được hủy")) {
            removeCourseFromMyCourses(course.maKhoaHoc);

            return;
          }

          // =================================================
          // CÁC LỖI THẬT SỰ
          // =================================================

          toast.error(message || "Không thể hủy khóa học!");
        },
      },
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Header */}
            <div className="h-5 w-32 rounded bg-slate-200" />

            <div className="mt-3 h-9 w-56 rounded-lg bg-slate-200" />

            <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-200" />

            {/* Search */}
            <div className="mt-8 h-12 rounded-xl bg-slate-200" />

            {/* Courses */}
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-28 rounded-2xl bg-slate-200" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
              <GraduationCap className="h-5 w-5" />
              Khu vực học tập
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Khóa học của tôi
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Tiếp tục học những khóa học bạn đã đăng ký.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700">
            <BookOpen className="h-4 w-4" />
            {myCourses.length} khóa học
          </div>
        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="relative mt-7">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm khóa học..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="mt-6">
          {/* =================================================
              CHƯA CÓ KHÓA HỌC
          ================================================= */}

          {myCourses.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <BookOpen className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                Bạn chưa đăng ký khóa học nào
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Khám phá các khóa học và bắt đầu hành trình học tập của bạn.
              </p>

              <Link
                href="/courses"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Khám phá khóa học
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : filteredCourses.length === 0 ? (
            /* =================================================
               KHÔNG TÌM THẤY
            ================================================= */

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <Search className="mx-auto h-8 w-8 text-slate-300" />

              <h2 className="mt-4 font-bold text-slate-900">
                Không tìm thấy khóa học
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Không có khóa học phù hợp với "{keyword}".
              </p>

              <button
                type="button"
                onClick={() => setKeyword("")}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Xóa tìm kiếm
              </button>
            </div>
          ) : (
            /* =================================================
               COURSE LIST
            ================================================= */

            <div className="space-y-3">
              {filteredCourses.map((course: any) => (
                <article
                  key={course.maKhoaHoc}
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:flex-row sm:items-center"
                >
                  {/* =================================================
                        IMAGE
                    ================================================= */}

                  <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-40">
                    <img
                      src={getImageUrl(course.hinhAnh)}
                      alt={course.tenKhoaHoc || "Khóa học"}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const img = e.currentTarget;

                        // Tránh vòng lặp nếu placeholder
                        if (!img.src.endsWith(PLACEHOLDER_IMAGE)) {
                          img.src = PLACEHOLDER_IMAGE;
                        }
                      }}
                    />

                    <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white shadow">
                      Đang học
                    </span>
                  </div>

                  {/* =================================================
                        INFO
                    ================================================= */}

                  <div className="min-w-0 flex-1 px-1">
                    <h2 className="line-clamp-1 text-base font-bold text-slate-900 transition group-hover:text-blue-600">
                      {course.tenKhoaHoc}
                    </h2>

                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                      {course.moTa || "Chưa có mô tả khóa học."}
                    </p>

                    {/* PROGRESS */}

                    <div className="mt-4 max-w-md">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">
                          Tiến độ
                        </span>

                        <span className="text-[11px] font-bold text-blue-600">
                          0%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-0 rounded-full bg-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                        ACTIONS
                    ================================================= */}

                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    <Link
                      href={`/courses/${course.maKhoaHoc}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 sm:min-w-[130px]"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Tiếp tục học
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleCancelCourse(course)}
                      disabled={cancelEnrollment.isPending}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />

                      <span className="sm:hidden">Hủy khóa học</span>

                      <span className="hidden sm:inline">Hủy</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* =================================================
            FOOTER COUNT
        ================================================= */}

        {filteredCourses.length > 0 && (
          <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
            <span>
              Hiển thị {filteredCourses.length} / {myCourses.length} khóa học
            </span>

            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          CONFIRM CANCEL MODAL
      ===================================================== */}

      {courseToCancel && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[2px]">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-course-title"
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div>
                <h2
                  id="cancel-course-title"
                  className="text-lg font-black text-slate-900"
                >
                  Hủy khóa học?
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Xác nhận trước khi thay đổi danh sách học tập
                </p>
              </div>
            </div>

            {/* =================================================
                MODAL CONTENT
            ================================================= */}

            <div className="px-6 py-5">
              <p className="text-sm leading-6 text-slate-600">
                Bạn sắp hủy đăng ký khóa học{" "}
                <strong className="text-slate-900">
                  {courseToCancel.tenKhoaHoc}
                </strong>
                .
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Bạn có thể đăng ký lại khóa học này sau.
              </p>
            </div>

            {/* =================================================
                MODAL ACTIONS
            ================================================= */}

            <div className="flex gap-3 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setCourseToCancel(null)}
                disabled={cancelEnrollment.isPending}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Giữ lại
              </button>

              <button
                type="button"
                onClick={confirmCancelCourse}
                disabled={cancelEnrollment.isPending}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelEnrollment.isPending ? "Đang xử lý..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

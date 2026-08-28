"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Eye,
  User,
  Heart,
  X,
  LogIn,
  Sparkles,
  Bookmark,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import {
  addFavoriteCourse,
  removeFavoriteCourse,
  isFavoriteCourse,
} from "@/lib/favorite";
import { getImageUrl } from "@/lib/image";
import { useToast } from "@/components/common/ToastProvider";

interface CourseCardProps {
  course: any;
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();
  const toast = useToast();

  const [isFavorite, setIsFavorite] = useState(false);

  // Popup đăng nhập
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // =========================================================
  // KIỂM TRA FAVORITE
  // =========================================================

  const checkFavorite = () => {
    if (!course?.maKhoaHoc) {
      setIsFavorite(false);
      return;
    }

    // Lấy user hiện tại
    const userInfo = localStorage.getItem("USER_INFO");

    // Chưa đăng nhập
    if (!userInfo) {
      setIsFavorite(false);
      return;
    }

    // Đã đăng nhập
    try {
      const favorite = isFavoriteCourse(course.maKhoaHoc);

      setIsFavorite(favorite);
    } catch (error) {
      console.error("Lỗi kiểm tra khóa học yêu thích:", error);

      setIsFavorite(false);
    }
  };

  // =========================================================
  // LOAD FAVORITE
  // =========================================================

  useEffect(() => {
    checkFavorite();
  }, [course?.maKhoaHoc]);

  // =========================================================
  // LẮNG NGHE LOGIN / LOGOUT
  // =========================================================

  useEffect(() => {
    const handleUserUpdated = () => {
      checkFavorite();
    };

    const handleFavoriteUpdated = () => {
      checkFavorite();
    };

    window.addEventListener("userUpdated", handleUserUpdated);

    window.addEventListener("favoriteUpdated", handleFavoriteUpdated);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdated);

      window.removeEventListener("favoriteUpdated", handleFavoriteUpdated);
    };
  }, [course?.maKhoaHoc]);

  // =========================================================
  // XỬ LÝ YÊU THÍCH
  // =========================================================

  const handleFavorite = () => {
    if (!course?.maKhoaHoc) {
      return;
    }

    // =======================================================
    // KIỂM TRA USER
    // =======================================================

    const userInfo = localStorage.getItem("USER_INFO");

    // =======================================================
    // CHƯA ĐĂNG NHẬP
    // =======================================================

    if (!userInfo) {
      setIsFavorite(false);

      // Hiện popup thay vì chuyển thẳng sang login
      setShowLoginPopup(true);

      return;
    }

    // =======================================================
    // ĐÃ ĐĂNG NHẬP
    // =======================================================

    try {
      // =====================================================
      // ĐANG YÊU THÍCH → XÓA
      // =====================================================

      if (isFavorite) {
        removeFavoriteCourse(course.maKhoaHoc);

        setIsFavorite(false);

        toast.success("Đã xóa khỏi danh sách yêu thích!");

        // Đồng bộ các component khác
        window.dispatchEvent(new Event("favoriteUpdated"));

        return;
      }

      // =====================================================
      // CHƯA YÊU THÍCH → THÊM
      // =====================================================

      addFavoriteCourse(course.maKhoaHoc);

      setIsFavorite(true);

      toast.success("Đã thêm vào danh sách yêu thích!");

      // Đồng bộ các component khác
      window.dispatchEvent(new Event("favoriteUpdated"));
    } catch (error) {
      console.error("Lỗi xử lý yêu thích:", error);

      toast.error("Không thể cập nhật danh sách yêu thích!");
    }
  };

  // =========================================================
  // IMAGE
  // =========================================================

  const getImageUrl = (image: string) => {
    if (!image) {
      return "https://placehold.co/600x400?text=No+Image";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `https://elearningnew.cybersoft.edu.vn/hinhanh/${image}`;
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      {/* =====================================================
          COURSE CARD
      ===================================================== */}

      <div className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10">
        {/* ===================================================
            IMAGE
        =================================================== */}

        <div className="relative overflow-hidden">
          <img
            src={getImageUrl(course.hinhAnh)}
            alt={course.tenKhoaHoc || "Khóa học"}
            className="h-60 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x400?text=No+Image";
            }}
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* =================================================
              CATEGORY
          ================================================= */}

          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
            {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Khóa học"}
          </span>

          {/* =================================================
              FAVORITE
          ================================================= */}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              handleFavorite();
            }}
            title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            aria-label={
              isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"
            }
            className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-90 ${
              isFavorite
                ? "bg-red-50 text-red-500"
                : "bg-white/80 text-slate-700 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Heart size={19} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          {/* =================================================
              RATING
          ================================================= */}

          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm">
            <span>⭐</span>

            <span className="text-sm">4.9</span>
          </div>
        </div>

        {/* ===================================================
            BODY
        =================================================== */}

        <div className="space-y-4 p-5">
          {/* TITLE */}

          <h2 className="line-clamp-2 min-h-[56px] text-xl font-extrabold leading-tight text-slate-950 transition group-hover:text-blue-600">
            {course.tenKhoaHoc}
          </h2>

          {/* DESCRIPTION */}

          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
            {course.moTa || "Khóa học trực tuyến chất lượng cao."}
          </p>

          <div className="border-t border-slate-100" />

          {/* =================================================
              INFO
          ================================================= */}

          <div className="space-y-3.5 text-sm">
            {/* Instructor */}

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                <User size={18} className="text-blue-500" />
              </div>

              <div>
                <p className="text-xs text-slate-400">Giảng viên</p>

                <p className="font-semibold text-slate-900">
                  {course.nguoiTao?.hoTen || "Admin"}
                </p>
              </div>
            </div>

            {/* Stats */}

            <div className="flex items-center justify-between rounded-xl bg-slate-50/50 p-2 font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <Eye size={16} className="text-slate-400" />

                <span>{course.luotXem || 0} lượt xem</span>
              </div>

              <div className="flex items-center gap-1.5">
                <BookOpen size={16} className="text-slate-400" />

                <span>Mã nhóm: {course.maNhom}</span>
              </div>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Học phí
              </p>

              <p className="text-2xl font-bold text-emerald-600">Miễn phí</p>
            </div>

            <Link
              href={`/courses/${course.maKhoaHoc}`}
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
            >
              Chi tiết →
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          POPUP ĐĂNG NHẬP
      ===================================================== */}

      {showLoginPopup && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-md"
          onClick={() => setShowLoginPopup(false)}
        >
          <div
            className="relative w-full max-w-md animate-[popup_.25s_ease-out] overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TOP */}

            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-400">
              <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10" />

              <div className="absolute -left-10 -bottom-20 h-44 w-44 rounded-full bg-cyan-300/20" />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_35%)]" />

              {/* Close */}

              <button
                type="button"
                onClick={() => setShowLoginPopup(false)}
                className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-md transition-all hover:bg-white/25 hover:rotate-90 active:scale-90"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* CONTENT */}

            <div className="relative px-6 pb-7 sm:px-8">
              {/* ICON */}

              <div className="-mt-10 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[26px] border-4 border-white bg-white shadow-xl">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-rose-100 text-red-500">
                    <Heart className="h-7 w-7" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* TEXT */}

              <div className="mt-5 text-center">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  Tính năng yêu thích
                </div>

                <h3 className="text-2xl font-black tracking-tight text-slate-950">
                  Đăng nhập để yêu thích
                </h3>

                <p className="mx-auto mt-2.5 max-w-sm text-sm leading-6 text-slate-500">
                  Lưu lại những khóa học bạn quan tâm để dễ dàng quay lại học
                  bất cứ lúc nào.
                </p>
              </div>

              {/* BENEFITS */}

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <Heart className="h-4 w-4" fill="currentColor" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800">
                      Lưu khóa học yêu thích
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Truy cập nhanh những khóa học bạn quan tâm.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                    <Bookmark className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800">
                      Quản lý danh sách cá nhân
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Thêm hoặc xóa khóa học bất cứ lúc nào.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECURITY */}

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Thông tin tài khoản của bạn luôn được bảo mật
              </div>

              {/* BUTTON */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setShowLoginPopup(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                >
                  Để sau
                </button>

                <Link
                  href="/login"
                  onClick={() => setShowLoginPopup(false)}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
                >
                  <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  Đăng nhập ngay
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup animation */}

      <style jsx global>{`
        @keyframes popup {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}

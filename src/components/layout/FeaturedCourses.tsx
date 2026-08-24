"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Star,
  Users,
  X,
  LogIn,
  ShieldCheck,
  Bookmark,
} from "lucide-react";

import { useCourses } from "@/hooks/useCourse";

import {
  addFavoriteCourse,
  removeFavoriteCourse,
  isFavoriteCourse,
} from "@/lib/favorite";

import { getUser } from "@/lib/auth";
import { useToast } from "@/components/common/ToastProvider";

export default function FeaturedCourses() {
  const { data: courses, isLoading } = useCourses();

  const toast = useToast();

  const sliderRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // STATE
  // =========================================================

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  // Popup login
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // =========================================================
  // ĐỒNG BỘ USER + FAVORITE
  // =========================================================

  const syncUserAndFavorites = () => {
    if (typeof window === "undefined") return;

    const currentUser = getUser();

    setUser(currentUser);

    // -------------------------------------------------------
    // CHƯA LOGIN
    // -------------------------------------------------------

    if (!currentUser) {
      setFavoriteIds([]);
      setShowLoginPopup(false);
      return;
    }

    // -------------------------------------------------------
    // ĐÃ LOGIN
    // -------------------------------------------------------

    const stored = localStorage.getItem("FAVORITE_COURSES");

    if (!stored) {
      setFavoriteIds([]);
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setFavoriteIds(parsed);
      } else {
        setFavoriteIds([]);
      }
    } catch (error) {
      console.error("Không thể đọc FAVORITE_COURSES:", error);
      setFavoriteIds([]);
    }
  };

  // =========================================================
  // LOAD + EVENT
  // =========================================================

  useEffect(() => {
    syncUserAndFavorites();

    const handleUserUpdated = () => {
      syncUserAndFavorites();
    };

    const handleFavoriteUpdated = () => {
      syncUserAndFavorites();
    };

    window.addEventListener("userUpdated", handleUserUpdated);
    window.addEventListener("favoriteUpdated", handleFavoriteUpdated);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdated);
      window.removeEventListener("favoriteUpdated", handleFavoriteUpdated);
    };
  }, []);

  // =========================================================
  // ĐÓNG POPUP BẰNG ESC
  // =========================================================

  useEffect(() => {
    if (!showLoginPopup) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowLoginPopup(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLoginPopup]);

  // =========================================================
  // KHÓA SCROLL KHI POPUP MỞ
  // =========================================================

  useEffect(() => {
    if (showLoginPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoginPopup]);

  // =========================================================
  // XỬ LÝ FAVORITE
  // =========================================================

  const handleFavorite = (
    e: React.MouseEvent<HTMLButtonElement>,
    courseId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!courseId) return;

    // -------------------------------------------------------
    // KIỂM TRA USER
    // -------------------------------------------------------

    const userInfo = localStorage.getItem("USER_INFO");

    // -------------------------------------------------------
    // CHƯA LOGIN
    // -------------------------------------------------------

    if (!userInfo) {
      setUser(null);
      setFavoriteIds([]);

      setShowLoginPopup(true);

      return;
    }

    // -------------------------------------------------------
    // ĐÃ LOGIN
    // -------------------------------------------------------

    try {
      const favorite = isFavoriteCourse(courseId);

      // -----------------------------------------------------
      // XÓA
      // -----------------------------------------------------

      if (favorite) {
        removeFavoriteCourse(courseId);

        setFavoriteIds((prev) => prev.filter((id) => id !== courseId));

        toast.success("Đã xóa khỏi danh sách yêu thích!");

        window.dispatchEvent(new Event("favoriteUpdated"));

        return;
      }

      // -----------------------------------------------------
      // THÊM
      // -----------------------------------------------------

      addFavoriteCourse(courseId);

      setFavoriteIds((prev) => {
        if (prev.includes(courseId)) {
          return prev;
        }

        return [...prev, courseId];
      });

      toast.success("Đã thêm vào danh sách yêu thích!");

      window.dispatchEvent(new Event("favoriteUpdated"));
    } catch (error) {
      console.error("Lỗi xử lý khóa học yêu thích:", error);

      toast.error("Không thể cập nhật danh sách yêu thích!");
    }
  };

  // =========================================================
  // SLIDER
  // =========================================================

  const handleScroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const { scrollLeft, clientWidth } = sliderRef.current;

    const scrollAmount = clientWidth * 0.82;

    sliderRef.current.scrollTo({
      left:
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  // =========================================================
  // IMAGE
  // =========================================================

  const getImageUrl = (image?: string) => {
    if (!image) {
      return "/placeholder.jpg";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `https://elearningnew.cybersoft.edu.vn/hinhanh/${image}`;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* =====================================================
        HEADER SKELETON
    ===================================================== */}

          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-4">
              {/* Badge */}

              <div className="h-7 w-44 animate-pulse rounded-full bg-slate-100" />

              {/* Title */}

              <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-100" />

              {/* Description */}

              <div className="h-5 w-80 animate-pulse rounded-lg bg-slate-100 sm:w-96" />
            </div>

            {/* Controls */}

            <div className="hidden items-center gap-2 sm:flex">
              <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />

              <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />

              <div className="h-11 w-32 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>

          {/* =====================================================
        CARD SKELETON
    ===================================================== */}

          <div className="flex gap-6 overflow-hidden pb-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="w-[290px] flex-shrink-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm sm:w-[330px] lg:w-[calc(25%-18px)]"
              >
                {/* =================================================
              IMAGE
          ================================================= */}

                <div className="relative aspect-[16/11] w-full animate-pulse bg-slate-100">
                  {/* Fake top badges */}

                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />

                    <div className="h-7 w-24 animate-pulse rounded-full bg-slate-200" />
                  </div>

                  {/* Fake favorite */}

                  <div className="absolute right-4 top-4 h-10 w-10 animate-pulse rounded-full bg-slate-200" />

                  {/* Fake bottom stats */}

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <div className="h-7 w-14 animate-pulse rounded-lg bg-slate-200" />

                    <div className="h-7 w-14 animate-pulse rounded-lg bg-slate-200" />
                  </div>
                </div>

                {/* =================================================
              CONTENT
          ================================================= */}

                <div className="flex min-h-[235px] flex-col p-5">
                  {/* Category */}

                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-7 w-7 animate-pulse rounded-lg bg-slate-100" />

                    <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                  </div>

                  {/* Title */}

                  <div className="space-y-2">
                    <div className="h-5 w-full animate-pulse rounded bg-slate-100" />

                    <div className="h-5 w-4/5 animate-pulse rounded bg-slate-100" />
                  </div>

                  {/* Divider */}

                  <div className="my-5 h-px bg-slate-100" />

                  {/* Footer */}

                  <div className="mt-auto flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-3 w-14 animate-pulse rounded bg-slate-100" />

                      <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
                    </div>

                    <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // FEATURED COURSES
  // =========================================================

  const featuredCourses = [...(courses || [])]
    .sort((a: any, b: any) => (b.luotXem || 0) - (a.luotXem || 0))
    .slice(0, 8);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-20">
        {/* =====================================================
      BACKGROUND
  ===================================================== */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />

          <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px]" />

          <div className="absolute left-1/2 top-1/2 h-[300px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]" />
        </div>

        {/* =====================================================
      CONTAINER
  ===================================================== */}

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ===================================================
        HEADER
    =================================================== */}

          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {/* Badge */}

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold text-blue-300 backdrop-blur-md">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30">
                  <Sparkles className="h-3 w-3" />
                </span>

                <span className="uppercase tracking-[0.15em]">
                  Tuyển chọn dành cho bạn
                </span>
              </div>

              {/* Title */}

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Khóa học{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300 bg-clip-text text-transparent">
                  nổi bật
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Những khóa học được học viên quan tâm nhiều nhất, được lựa chọn
                dựa trên lượt xem và mức độ phổ biến.
              </p>
            </div>

            {/* =================================================
          CONTROLS
      ================================================= */}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                aria-label="Slide trước"
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => handleScroll("right")}
                aria-label="Slide tiếp"
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300 active:scale-95"
              >
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </button>

              <Link
                href="/courses"
                className="group ml-1 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-blue-500/10 active:scale-95"
              >
                Xem tất cả
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* ===================================================
        SLIDER
    =================================================== */}

          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-5 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {featuredCourses.map((course: any, index: number) => {
              const favorite = favoriteIds.includes(course.maKhoaHoc);

              return (
                <div
                  key={course.maKhoaHoc}
                  className="w-[290px] flex-shrink-0 snap-start sm:w-[330px] lg:w-[calc(25%-18px)]"
                >
                  {/* =================================================
                PREMIUM FEATURED CARD
            ================================================= */}

                  <Link
                    href={`/courses/${course.maKhoaHoc}`}
                    className="group relative flex min-h-[430px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-400/30 hover:bg-white/[0.09] hover:shadow-blue-500/10"
                  >
                    {/* =================================================
                  IMAGE
              ================================================= */}

                    <div className="relative aspect-[16/11] overflow-hidden">
                      <Image
                        src={getImageUrl(course.hinhAnh)}
                        alt={course.tenKhoaHoc || "Khóa học"}
                        fill
                        sizes="(max-width: 640px) 290px, (max-width: 1024px) 330px, 300px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />

                      {/* Dark overlay */}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

                      {/* Hover blue glow */}

                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-cyan-400/0 transition-all duration-500 group-hover:from-blue-500/10 group-hover:to-cyan-400/10" />

                      {/* =================================================
                    NUMBER
                ================================================= */}

                      <div className="absolute left-4 top-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/30 text-xs font-black text-white backdrop-blur-md">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                            Top course
                          </span>
                        </div>
                      </div>

                      {/* =================================================
                    FAVORITE
                ================================================= */}

                      <button
                        type="button"
                        onClick={(e) => handleFavorite(e, course.maKhoaHoc)}
                        aria-label={
                          favorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"
                        }
                        title={
                          favorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"
                        }
                        className={`absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-90 ${
                          favorite
                            ? "border-red-400/20 bg-red-500 text-white shadow-lg shadow-red-500/20"
                            : "border-white/20 bg-black/25 text-white hover:border-red-400/30 hover:bg-red-500 hover:text-white"
                        }`}
                      >
                        <Heart
                          className="h-[18px] w-[18px]"
                          fill={favorite ? "currentColor" : "none"}
                        />
                      </button>

                      {/* =================================================
                    BOTTOM IMAGE INFO
                ================================================= */}

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          {/* Rating */}

                          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 backdrop-blur-md">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />

                            <span className="text-xs font-black text-white">
                              4.9
                            </span>
                          </div>

                          {/* Views */}

                          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                            <Users className="h-3.5 w-3.5 text-blue-300" />

                            {course.luotXem || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                  CONTENT
              ================================================= */}

                    <div className="flex flex-1 flex-col p-5">
                      {/* Category */}

                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                          <BookOpen className="h-3.5 w-3.5" />
                        </div>

                        <span className="line-clamp-1 text-xs font-bold text-blue-300">
                          {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc ||
                            "Khóa học online"}
                        </span>
                      </div>

                      {/* Title */}

                      <h3 className="line-clamp-2 min-h-[52px] text-[17px] font-extrabold leading-6 text-white transition-colors duration-300 group-hover:text-blue-300">
                        {course.tenKhoaHoc}
                      </h3>

                      {/* Divider */}

                      <div className="my-5 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

                      {/* Footer */}

                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            Khóa học
                          </p>

                          <p className="mt-0.5 text-sm font-bold text-white">
                            Học online
                          </p>
                        </div>

                        {/* Explore */}

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                  BOTTOM LINE
              ================================================= */}

                    <div className="absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 transition-transform duration-500 group-hover:scale-x-100" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* ===================================================
        BOTTOM HINT
    =================================================== */}

          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <span className="h-px w-8 bg-white/10" />

            <span>Kéo để khám phá thêm khóa học</span>

            <span className="h-px w-8 bg-white/10" />
          </div>
        </div>
      </section>

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

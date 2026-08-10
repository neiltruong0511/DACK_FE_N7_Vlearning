"use client";

import { useRef } from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useCourses } from "@/hooks/useCourse";
import {
  addFavoriteCourse,
  removeFavoriteCourse,
  isFavoriteCourse,
} from "@/lib/favorite";

export default function FeaturedCourses() {
  const { data: courses, isLoading } = useCourses();

  const sliderRef = useRef<HTMLDivElement>(null);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // =========================
  // LẤY DANH SÁCH YÊU THÍCH
  // =========================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("FAVORITE_COURSES");

    if (stored) {
      try {
        setFavoriteIds(JSON.parse(stored));
      } catch {
        setFavoriteIds([]);
      }
    }
  }, []);

  // =========================
  // XỬ LÝ YÊU THÍCH
  // =========================
  const handleFavorite = (e: React.MouseEvent, courseId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!courseId) return;

    const favorite = isFavoriteCourse(courseId);

    if (favorite) {
      removeFavoriteCourse(courseId);

      setFavoriteIds((prev) => prev.filter((id) => id !== courseId));
    } else {
      addFavoriteCourse(courseId);

      setFavoriteIds((prev) => {
        if (prev.includes(courseId)) {
          return prev;
        }

        return [...prev, courseId];
      });
    }
  };

  // =========================
  // CUỘN SLIDER
  // =========================
  const handleScroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const { scrollLeft, clientWidth } = sliderRef.current;

    const scrollAmount = clientWidth * 0.75;

    sliderRef.current.scrollTo({
      left:
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <section className="bg-slate-50/50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div className="space-y-3">
              <div className="h-6 w-36 animate-pulse rounded-full bg-slate-200" />
              <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-4 w-80 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="hidden h-10 w-28 animate-pulse rounded-xl bg-slate-200 sm:block" />
          </div>

          {/* Skeleton slider */}
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="w-[280px] sm:w-[320px] lg:w-[calc(25%-15px)] flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-[16/10] w-full animate-pulse bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Tăng số lượng lên 8 khóa học để cuộn slider mượt hơn
  const featuredCourses = [...(courses || [])]
    .sort((a: any, b: any) => {
      return (b.luotXem || 0) - (a.luotXem || 0);
    })
    .slice(0, 8);

  const getImageUrl = (image?: string) => {
    if (!image) {
      return "/placeholder.jpg";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `https://elearningnew.cybersoft.edu.vn/hinhanh/${image}`;
  };

  return (
    <section className="bg-slate-50/50 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 border border-blue-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="uppercase tracking-wider">
                Được quan tâm nhiều
              </span>
            </div>

            <h2 className="text-2xl font-black font-bold tracking-tight text-slate-900 sm:text-3xl">
              Khóa học nổi bật
            </h2>

            <p className="mt-1.5 text-sm text-slate-500 sm:text-base">
              Những khóa học đang được học viên quan tâm nhiều nhất.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Nút điều hướng Slider */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll("left")}
                aria-label="Slide trước"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                aria-label="Slide tiếp"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Courses Slider Container */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-4 pt-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuredCourses.map((course: any) => (
            <div
              key={course.maKhoaHoc}
              className="w-[280px] sm:w-[320px] lg:w-[calc(25%-15px)] flex-shrink-0 snap-start"
            >
              <Link
                href={`/courses/${course.maKhoaHoc}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={getImageUrl(course.hinhAnh)}
                    alt={course.tenKhoaHoc}
                    fill
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 300px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Favorite */}
                  <button
                    type="button"
                    onClick={(e) => handleFavorite(e, course.maKhoaHoc)}
                    aria-label={
                      favoriteIds.includes(course.maKhoaHoc)
                        ? "Xóa khỏi yêu thích"
                        : "Thêm vào yêu thích"
                    }
                    className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur transition-all active:scale-90 ${
                      favoriteIds.includes(course.maKhoaHoc)
                        ? "bg-red-50 text-red-500"
                        : "bg-white/80 text-slate-600 hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className="h-4 w-4"
                      fill={
                        favoriteIds.includes(course.maKhoaHoc)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  {/* Badge */}
                  <span className="absolute bottom-3 left-3 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                    Nổi bật
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div className="space-y-2">
                    {/* Category */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                      <BookOpen className="h-3.5 w-3.5" />

                      <span className="line-clamp-1">
                        {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc ||
                          "Khóa học online"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="line-clamp-2 min-h-[48px] text-base font-bold leading-6 text-slate-900 transition group-hover:text-blue-600">
                      {course.tenKhoaHoc}
                    </h3>
                  </div>

                  {/* Rating & Views */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                      <span className="text-sm font-bold text-slate-800">
                        4.9
                      </span>

                      <span className="text-xs text-slate-400">(120)</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Users className="h-3.5 w-3.5 text-slate-400" />

                      {course.luotXem || 0}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

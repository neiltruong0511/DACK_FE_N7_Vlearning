"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import TeacherCard, { Teacher } from "./TeacherCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";

import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const teachers: Teacher[] = [
  {
    id: 1,
    name: "Big DadMoon",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    position: "ReactJS Expert",
    rating: 4.9,
    students: 100,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    position: "UI UX Designer",
    rating: 4.9,
    students: 100,
  },
  {
    id: 3,
    name: "David Lee",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    position: "NodeJS Expert",
    rating: 4.9,
    students: 100,
  },
  {
    id: 4,
    name: "Chris Andersen",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    position: "FullStack Developer",
    rating: 4.9,
    students: 100,
  },
  {
    id: 5,
    name: "Hoàng Nam",
    avatar: "https://randomuser.me/api/portraits/men/71.jpg",
    position: "PHP Expert",
    rating: 4.9,
    students: 100,
  },
  {
    id: 6,
    name: "Anna White",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
    position: "Frontend Developer",
    rating: 4.9,
    students: 100,
  },

  {
    id: 7,
    name: "Michael Brown",
    avatar: "https://randomuser.me/api/portraits/men/63.jpg",
    position: "Java Spring Boot",
    rating: 4.8,
    students: 180,
  },
  {
    id: 8,
    name: "Emily Davis",
    avatar: "https://randomuser.me/api/portraits/women/58.jpg",
    position: "Flutter Developer",
    rating: 4.9,
    students: 210,
  },
  {
    id: 9,
    name: "Nguyễn Minh Khoa",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    position: "DevOps Engineer",
    rating: 5.0,
    students: 156,
  },
  {
    id: 10,
    name: "Jessica Wilson",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    position: "Data Science Expert",
    rating: 4.9,
    students: 195,
  },
];

export default function TopInstructors() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold uppercase tracking-[4px] text-blue-600">
              EXPERT MENTORS
            </p>

            <h2 className="mt-2 text-5xl font-black">Giảng viên hàng đầu</h2>
          </div>

          {/* Arrow */}
          <div className="flex gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow transition-all hover:bg-blue-600 hover:text-white"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow transition-all hover:bg-blue-600 hover:text-white"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Swiper */}

        <Swiper
          modules={[Pagination, Autoplay]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          loop
          grabCursor
          spaceBetween={28}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="mt-14 pb-14"
        >
          {teachers.map((teacher) => (
            <SwiperSlide key={teacher.id}>
              <TeacherCard teacher={teacher} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

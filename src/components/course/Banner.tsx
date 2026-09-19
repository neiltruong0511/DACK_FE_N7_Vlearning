"use client";

import { BookOpen, Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Banner() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) return;

    router.push(`/search?keyword=${keyword}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-20 top-20 h-48 w-48 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-20 h-60 w-60 rounded-full bg-cyan-300 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-12 sm:px-6 sm:py-20">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* LEFT */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur">
              <BookOpen size={18} />
              Nền tảng học lập trình hiện đại
            </span>

            <h1 className="mt-6 text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Học lập trình
              <br />
              <span className="text-yellow-300">Từ cơ bản đến chuyên sâu</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
              Hơn 200+ khóa học chất lượng về Front-end, Back-end, Mobile, AI,
              DevOps và nhiều lĩnh vực khác giúp bạn nâng cao kỹ năng và phát
              triển sự nghiệp.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="mt-8 flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:mt-10 sm:flex-row"
            >
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                type="text"
                placeholder="Tìm kiếm khóa học..."
                className="min-w-0 flex-1 px-4 py-4 text-black outline-none sm:px-6 sm:py-5"
              />

              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-blue-700 px-6 py-4 font-semibold text-white transition hover:bg-blue-800 sm:px-8"
              >
                <Search size={18} />
                Tìm kiếm
              </button>
            </form>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-6 sm:mt-10 sm:gap-10">
              <div>
                <h3 className="text-3xl font-bold text-white sm:text-4xl">200+</h3>
                <p className="text-blue-100">Khóa học</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white sm:text-4xl">50K+</h3>
                <p className="text-blue-100">Học viên</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white sm:text-4xl">100+</h3>
                <p className="text-blue-100">Giảng viên</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden justify-center lg:flex">
            <div className="relative">
              <div className="absolute -left-6 -top-6 h-80 w-80 rounded-full bg-cyan-400 opacity-30 blur-3xl" />

              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900"
                alt="Learning"
                className="relative w-full max-w-lg rounded-3xl shadow-2xl"
              />

              {/* Floating Card */}
              <div className="absolute -bottom-8 -left-8 rounded-2xl bg-white p-5 shadow-2xl">
                <p className="text-sm text-gray-500">Khóa học nổi bật</p>

                <h4 className="mt-2 font-bold text-black">ReactJS & NextJS</h4>

                <button className="mt-3 flex items-center gap-2 font-semibold text-blue-600">
                  Xem ngay
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

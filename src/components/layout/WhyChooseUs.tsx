"use client";

import {
  Award,
  BookOpenCheck,
  MonitorSmartphone,
  UsersRound,
} from "lucide-react";

const features = [
  {
    icon: MonitorSmartphone,
    title: "Học mọi lúc, mọi nơi",
    description:
      "Truy cập khóa học trên máy tính, tablet và điện thoại bất cứ khi nào bạn muốn.",
  },
  {
    icon: BookOpenCheck,
    title: "Nội dung thực tế",
    description:
      "Học thông qua các bài học trực quan, ví dụ thực tế và kiến thức có thể áp dụng ngay.",
  },
  {
    icon: UsersRound,
    title: "Giảng viên chất lượng",
    description:
      "Được học hỏi từ những giảng viên có kinh nghiệm và kiến thức chuyên môn.",
  },
  {
    icon: Award,
    title: "Chứng chỉ hoàn thành",
    description:
      "Nhận chứng chỉ sau khi hoàn thành khóa học và ghi nhận quá trình học tập.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Vì sao chọn chúng tôi?
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Học tập hiệu quả hơn mỗi ngày
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
            Chúng tôi mang đến trải nghiệm học tập đơn giản, linh hoạt và tập
            trung vào những kiến thức thực tế.
          </p>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

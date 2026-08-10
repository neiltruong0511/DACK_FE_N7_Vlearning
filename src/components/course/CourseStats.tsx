"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Users, BookOpen, Clock3, GraduationCap } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: 9000,
    suffix: "+",
    title: "Học viên",
  },
  {
    icon: BookOpen,
    number: 1000,
    suffix: "+",
    title: "Khóa học",
  },
  {
    icon: Clock3,
    number: 33200,
    suffix: "+",
    title: "Giờ học",
  },
  {
    icon: GraduationCap,
    number: 400,
    suffix: "+",
    title: "Giảng viên",
  },
];

export default function CourseStats() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="rounded-3xl bg-white p-10 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <Icon className="text-blue-600" size={34} />
              </div>

              <h2 className="mt-8 text-center text-5xl font-black text-blue-600">
                {inView ? (
                  <CountUp
                    end={item.number}
                    duration={2.5}
                    separator=","
                    suffix={item.suffix}
                  />
                ) : (
                  "0"
                )}
              </h2>

              <p className="mt-3 text-center text-gray-500">{item.title}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

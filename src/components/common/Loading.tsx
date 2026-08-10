"use client";

import { GraduationCap } from "lucide-react";

interface LoadingProps {
  title?: string;
  description?: string;
}

export default function Loading({
  title = "Đang tải dữ liệu...",
  description = "Vui lòng chờ trong giây lát",
}: LoadingProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-white">
      <div className="text-center">
        {/* Logo */}
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          {/* vòng ngoài */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />

          {/* vòng xoay */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-500" />

          {/* icon */}
          <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-xl">
            <GraduationCap className="text-white" size={34} />
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-bold text-slate-800">{title}</h2>

        <p className="mt-2 text-slate-500">{description}</p>

        {/* Progress */}
        <div className="mx-auto mt-8 h-2 w-72 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-blue-600" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}

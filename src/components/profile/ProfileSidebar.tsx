"use client";

import { User, BookOpen, Heart, Settings } from "lucide-react";

export default function ProfileSidebar() {
  return (
    <aside className="rounded-3xl bg-white p-6 shadow-lg">
      <nav className="space-y-2">
        <button className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 font-semibold text-blue-600">
          <User size={20} />
          Hồ sơ
        </button>

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-50">
          <Heart size={20} />
          Yêu thích
        </button>

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-50">
          <Settings size={20} />
          Cài đặt
        </button>
      </nav>
    </aside>
  );
}

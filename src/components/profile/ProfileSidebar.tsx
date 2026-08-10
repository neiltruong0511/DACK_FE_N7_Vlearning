"use client";

import { User, Heart, Settings } from "lucide-react";

interface Props {
  activeTab: "profile" | "favorite";
  onChange: (tab: "profile" | "favorite") => void;
}

export default function ProfileSidebar({ activeTab, onChange }: Props) {
  return (
    <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <nav className="space-y-2">
        {/* HỒ SƠ */}
        <button
          type="button"
          onClick={() => onChange("profile")}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            activeTab === "profile"
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <User size={20} />
          Hồ sơ
        </button>

        {/* YÊU THÍCH */}
        <button
          type="button"
          onClick={() => onChange("favorite")}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            activeTab === "favorite"
              ? "bg-red-50 text-red-500"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Heart
            size={20}
            fill={activeTab === "favorite" ? "currentColor" : "none"}
          />
          Yêu thích
        </button>

        {/* CÀI ĐẶT */}
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <Settings size={20} />
          Cài đặt
        </button>
      </nav>
    </aside>
  );
}

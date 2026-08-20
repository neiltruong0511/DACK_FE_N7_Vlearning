"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, BookOpen, FolderKanban, GraduationCap, LogOut, Menu, Users, X } from "lucide-react";
import { useState } from "react";
import { logout } from "@/lib/auth";

const items = [
  { href: "/admin", label: "Tổng quan", icon: BarChart3 },
  { href: "/admin/courses", label: "Khóa học", icon: BookOpen },
  { href: "/admin/categories", label: "Danh mục", icon: FolderKanban },
  { href: "/admin/users", label: "Người dùng", icon: Users },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-[#f5f8f8] text-slate-900">
      <button
        type="button"
        aria-label="Mở menu"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-xl bg-[#123b3a] p-2.5 text-white shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#123b3a] px-5 py-6 text-white shadow-2xl transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-3">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e4c77b] text-xl font-black text-[#123b3a]">V</span>
            <span>
              <strong className="block text-lg tracking-tight">VLearning</strong>
              <small className="text-xs text-teal-100/70">Quản trị học tập</small>
            </span>
          </Link>
          <button type="button" aria-label="Đóng menu" onClick={() => setOpen(false)} className="rounded-lg p-2 text-teal-100 hover:bg-white/10 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-12 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-100/50">Không gian quản trị</div>
        <nav className="mt-3 space-y-1.5">
          {items.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${active ? "bg-[#e4c77b] text-[#123b3a]" : "text-teal-50/75 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          <Link href="/" className="mb-2 flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-teal-50/75 hover:bg-white/10 hover:text-white">
            <GraduationCap className="h-[18px] w-[18px]" />
            Về trang học viên
          </Link>
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-teal-50/75 hover:bg-red-400/15 hover:text-red-100">
            <LogOut className="h-[18px] w-[18px]" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, FolderKanban, Users } from "lucide-react";
import Link from "next/link";
import { courseApi } from "@/services/courseApi";
import { categoryApi } from "@/services/categoryApi";
import { userApi } from "@/services/userApi";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ courses: 0, categories: 0, users: 0 });

  useEffect(() => {
    Promise.allSettled([courseApi.getCourses(), categoryApi.getCategories(), userApi.getUsers()]).then(([courses, categories, users]) => {
      const read = (result: PromiseSettledResult<{ data: unknown }>) => {
        if (result.status !== "fulfilled") return [];
        const value = result.value.data;
        return Array.isArray(value) ? value : (value as { items?: unknown[] })?.items || [];
      };
      setStats({ courses: read(courses).length, categories: read(categories).length, users: read(users).length });
    });
  }, []);

  const cards = [
    { label: "Tổng khóa học", value: stats.courses, href: "/admin/courses", icon: BookOpen, tone: "bg-[#e6f4f1] text-[#237c73]" },
    { label: "Danh mục", value: stats.categories, href: "/admin/categories", icon: FolderKanban, tone: "bg-[#fff4d9] text-[#98771d]" },
    { label: "Người dùng", value: stats.users, href: "/admin/users", icon: Users, tone: "bg-[#e9eefb] text-[#4b5f9d]" },
  ];

  return (
    <div>
      <header className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#237c73]">Bảng điều khiển</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#123b3a] sm:text-4xl">Chào mừng trở lại</h1>
          <p className="mt-2 text-sm text-slate-500">Theo dõi và vận hành nội dung học tập của VLearning.</p>
        </div>
        <span className="rounded-full border border-[#d7e4e2] bg-white px-4 py-2 text-xs font-semibold text-slate-500">Quản trị viên</span>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {cards.map(({ label, value, href, icon: Icon, tone }) => (
          <Link key={href} href={href} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(30,65,64,0.05)] transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span><ArrowUpRight className="h-5 w-5 text-slate-300 transition group-hover:text-[#237c73]" /></div>
            <p className="mt-7 text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-black text-[#123b3a]">{value}</p>
          </Link>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(30,65,64,0.05)]">
          <p className="text-sm font-bold text-[#123b3a]">Các tác vụ thường dùng</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link href="/admin/courses" className="rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-700 transition hover:border-[#8bc9c0] hover:bg-[#f3fbf9]">Quản lý khóa học <span className="float-right text-[#237c73]">→</span></Link>
            <Link href="/admin/categories" className="rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-700 transition hover:border-[#8bc9c0] hover:bg-[#f3fbf9]">Tạo danh mục mới <span className="float-right text-[#237c73]">→</span></Link>
            <Link href="/admin/users" className="rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-700 transition hover:border-[#8bc9c0] hover:bg-[#f3fbf9]">Cập nhật người dùng <span className="float-right text-[#237c73]">→</span></Link>
          </div>
        </div>
        <div className="rounded-2xl bg-[#123b3a] p-6 text-white shadow-[0_8px_30px_rgba(18,59,58,0.18)]">
          <p className="text-sm font-bold text-[#e4c77b]">VLearning admin</p>
          <h2 className="mt-4 text-2xl font-black leading-tight">Nội dung tốt tạo nên hành trình học tốt.</h2>
          <p className="mt-3 text-sm leading-6 text-teal-50/70">Quản lý khóa học, danh mục và tài khoản trong một không gian gọn gàng.</p>
        </div>
      </section>
    </div>
  );
}
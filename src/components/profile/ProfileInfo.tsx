"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";

interface User {
  hoTen?: string;
  taiKhoan?: string;
  email?: string;
  soDT?: string;
  maLoaiNguoiDung?: string;
}

export default function ProfileInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getUser());
  }, []);

  if (!mounted) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Thông tin cá nhân</h2>

        <p className="mt-1 text-sm text-slate-500">
          Quản lý thông tin tài khoản của bạn.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Info label="Họ tên" value={user?.hoTen} />

        <Info label="Tài khoản" value={user?.taiKhoan} />

        <Info label="Email" value={user?.email} />

        <Info label="Số điện thoại" value={user?.soDT} />

        <Info
          label="Loại người dùng"
          value={user?.maLoaiNguoiDung === "GV" ? "Giáo vụ" : "Học viên"}
        />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>

      <h3 className="mt-2 text-lg font-bold text-slate-900">
        {value || "Chưa cập nhật"}
      </h3>
    </div>
  );
}

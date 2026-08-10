"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";

export default function ProfileInfo() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getUser());
  }, []);

  if (!mounted) return null;

  return (
    <div className="rounded-3xl bg-white p-10 shadow-lg">
      <h2 className="mb-8 text-3xl font-bold">Thông tin cá nhân</h2>

      <div className="grid gap-8 md:grid-cols-2">
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
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      <h3 className="mt-2 text-xl font-semibold">{value || "Chưa cập nhật"}</h3>
    </div>
  );
}

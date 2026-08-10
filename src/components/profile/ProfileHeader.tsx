"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";

interface User {
  taiKhoan: string;
  hoTen: string;
  email: string;
  maLoaiNguoiDung: string;
  soDT?: string;
  avatar?: string;
}

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

export default function ProfileHeader() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [avatar, setAvatar] = useState("");

  // =========================
  // LOAD USER + AVATAR
  // =========================
  useEffect(() => {
    const loadUser = () => {
      const userInfo = localStorage.getItem("USER_INFO");

      if (!userInfo) {
        setUser(null);
        setAvatar("");
        return;
      }

      const currentUser: User = JSON.parse(userInfo);

      setUser(currentUser);

      // Avatar riêng theo tài khoản
      const avatarKey = `AVATAR_${currentUser.taiKhoan}`;
      const savedAvatar = localStorage.getItem(avatarKey);

      setAvatar(savedAvatar || "");
    };

    loadUser();

    window.addEventListener("userUpdated", loadUser);

    return () => {
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  // =========================
  // CHỌN AVATAR
  // =========================
  const handleChooseAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !user?.taiKhoan) return;

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh!");
      return;
    }

    // Kiểm tra dung lượng
    if (file.size > MAX_SIZE) {
      alert("Ảnh phải nhỏ hơn hoặc bằng 100MB!");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const avatarUrl = reader.result as string;

      // =========================
      // LƯU AVATAR RIÊNG USER
      // =========================
      const avatarKey = `AVATAR_${user.taiKhoan}`;

      localStorage.setItem(avatarKey, avatarUrl);

      // Cập nhật state
      setAvatar(avatarUrl);

      // Cập nhật USER_INFO
      const updatedUser = {
        ...user,
        avatar: avatarUrl,
      };

      setUser(updatedUser);

      localStorage.setItem("USER_INFO", JSON.stringify(updatedUser));

      // Báo Header cập nhật
      window.dispatchEvent(new Event("userUpdated"));
    };

    reader.readAsDataURL(file);

    // Cho phép chọn lại cùng một file
    e.target.value = "";
  };

  // =========================
  // XÓA AVATAR
  // =========================
  const removeAvatar = () => {
    if (!user?.taiKhoan) return;

    const avatarKey = `AVATAR_${user.taiKhoan}`;

    // Xóa avatar của đúng tài khoản
    localStorage.removeItem(avatarKey);

    // Xóa state
    setAvatar("");

    // Xóa avatar trong USER_INFO
    const updatedUser = {
      ...user,
      avatar: "",
    };

    setUser(updatedUser);

    localStorage.setItem("USER_INFO", JSON.stringify(updatedUser));

    window.dispatchEvent(new Event("userUpdated"));
  };

  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-10 text-white shadow-xl">
      <div className="flex flex-col gap-8 md:flex-row md:items-center">
        {/* ================= AVATAR ================= */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative cursor-pointer"
          >
            {/* Avatar */}
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-2xl transition duration-300 group-hover:scale-105">
              {avatar ? (
                <img
                  src={avatar}
                  alt={user?.hoTen || "Avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white text-5xl font-bold text-blue-600">
                  {user?.hoTen?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
              <Camera size={34} className="text-white" />
            </div>

            {/* Camera */}
            <div className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-600 shadow-lg">
              <Camera size={18} className="text-white" />
            </div>

            {/* Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChooseAvatar}
            />
          </div>

          <p className="mt-4 text-sm text-blue-100">Nhấn vào ảnh để thay đổi</p>

          {/* Xóa */}
          {avatar && (
            <button
              onClick={removeAvatar}
              className="mt-4 flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              <Trash2 size={16} />
              Xóa ảnh
            </button>
          )}
        </div>

        {/* ================= USER INFO ================= */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{user?.hoTen}</h1>

          <p className="mt-2 text-lg text-blue-100">
            {user?.maLoaiNguoiDung === "GV" ? "👨‍🏫 Giáo vụ" : "🎓 Học viên"}
          </p>

          <div className="mt-6 space-y-2 text-white/90">
            <p>
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

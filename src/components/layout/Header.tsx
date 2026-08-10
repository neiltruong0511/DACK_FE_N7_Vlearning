"use client";

import Link from "next/link";
import { Search, Menu, User, LogOut, Shield, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryDropdown from "./CategoryDropdown";

interface UserInfo {
  taiKhoan?: string;
  hoTen?: string;
  email?: string;
  maLoaiNguoiDung?: string;
  avatar?: string;
}

export default function Header() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState<UserInfo | null>(null);
  const [avatar, setAvatar] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  // =====================================================
  // LOAD USER + AVATAR RIÊNG THEO TÀI KHOẢN
  // =====================================================
  useEffect(() => {
    const loadUser = () => {
      try {
        const userInfo = localStorage.getItem("USER_INFO");

        // Không có user
        if (!userInfo) {
          setUser(null);
          setAvatar("");
          setOpenMenu(false);
          return;
        }

        const parsedUser: UserInfo = JSON.parse(userInfo);

        setUser(parsedUser);

        // -----------------------------------------------
        // Lấy avatar riêng của từng tài khoản
        // Ví dụ:
        // AVATAR_student01
        // AVATAR_admin01
        // -----------------------------------------------
        if (parsedUser.taiKhoan) {
          const avatarKey = `AVATAR_${parsedUser.taiKhoan}`;

          const savedAvatar = localStorage.getItem(avatarKey);

          setAvatar(savedAvatar || "");
        } else {
          setAvatar("");
        }
      } catch (error) {
        console.error("Không thể đọc USER_INFO:", error);

        setUser(null);
        setAvatar("");
      }
    };

    // Load lần đầu
    loadUser();

    // Khi ProfileHeader upload/xóa avatar
    window.addEventListener("userUpdated", loadUser);

    return () => {
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const value = keyword.trim();

    if (!value) return;

    router.push(`/search?keyword=${encodeURIComponent(value)}`);
  };

  // =====================================================
  // LOGOUT
  // =====================================================
  const handleLogout = () => {
    /*
      QUAN TRỌNG:

      Không xóa:
      AVATAR_taiKhoan

      Vì avatar phải được giữ lại cho lần đăng nhập sau.

      Chỉ xóa thông tin phiên hiện tại.
    */

    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USER_INFO");

    setUser(null);
    setAvatar("");
    setOpenMenu(false);

    // Thông báo cho các component khác
    window.dispatchEvent(new Event("userUpdated"));

    router.push("/");
    router.refresh();
  };

  // =====================================================
  // AVATAR FALLBACK
  // =====================================================
  const avatarLetter = user?.hoTen?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center gap-8 px-8">
        {/* =====================================================
            LOGO
        ===================================================== */}
        <Link
          href="/"
          className="flex min-w-[230px] items-center gap-3 transition hover:opacity-90"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-2xl font-bold text-white shadow-lg">
            V
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              VLearning
            </h1>

            <p className="-mt-1 text-sm text-gray-500">
              Learn. Practice. Success.
            </p>
          </div>
        </Link>

        {/* =====================================================
            SEARCH
        ===================================================== */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 justify-center lg:flex"
        >
          <div className="relative w-full max-w-2xl">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm khóa học..."
              className="h-14 w-full rounded-full border border-gray-200 bg-gray-50 pl-14 pr-6 text-[16px] text-black shadow-sm outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </form>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}
        <nav className="hidden items-center gap-10 lg:flex">
          {/* Danh mục */}
          <div className="group relative">
            <button
              type="button"
              className="font-semibold text-gray-700 transition hover:text-blue-600"
            >
              Danh mục
            </button>

            <CategoryDropdown />
          </div>

          {/* Khóa học */}
          <Link
            href="/courses"
            className="font-semibold text-gray-700 transition hover:text-blue-600"
          >
            Khóa học
          </Link>

          {/* Blog */}
          <Link
            href="/blog"
            className="font-semibold text-gray-700 transition hover:text-blue-600"
          >
            Blog
          </Link>
        </nav>

        {/* =====================================================
            USER
        ===================================================== */}
        <div className="hidden items-center md:flex">
          {!user ? (
            // =================================================
            // CHƯA ĐĂNG NHẬP
            // =================================================
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
              >
                Đăng nhập
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            // =================================================
            // ĐÃ ĐĂNG NHẬP
            // =================================================
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-md transition hover:shadow-xl"
              >
                {/* =================================================
                    AVATAR
                ================================================= */}
                <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={user.hoTen || "Avatar"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Nếu URL ảnh lỗi
                        e.currentTarget.style.display = "none";

                        const fallback = e.currentTarget
                          .nextElementSibling as HTMLDivElement | null;

                        if (fallback) {
                          fallback.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}

                  {/* FALLBACK */}
                  <div
                    className={`${
                      avatar ? "hidden" : "flex"
                    } h-full w-full items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 text-lg font-bold text-white`}
                  >
                    {avatarLetter}
                  </div>
                </div>

                {/* =================================================
                    USER NAME
                ================================================= */}
                <div className="text-left">
                  <p className="text-xs font-bold text-blue-600">Xin chào,</p>

                  <p className="max-w-[130px] truncate text-base font-semibold text-gray-900">
                    {user.hoTen}
                  </p>
                </div>
              </button>

              {/* =================================================
                  DROPDOWN
              ================================================= */}
              {openMenu && (
                <div className="absolute right-0 mt-4 w-72 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
                  {/* DROPDOWN HEADER */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-5">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Đăng nhập với
                    </p>

                    <h3 className="truncate text-xl font-bold text-gray-900">
                      {user.hoTen}
                    </h3>

                    <p className="mt-1 text-sm text-blue-600">
                      {user.maLoaiNguoiDung === "GV" ? "Giáo vụ" : "Học viên"}
                    </p>
                  </div>

                  {/* MENU */}
                  <div className="p-2">
                    {/* PROFILE */}
                    <Link
                      href="/profile"
                      onClick={() => setOpenMenu(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 transition hover:bg-slate-100"
                    >
                      <User size={20} />
                      Hồ sơ cá nhân
                    </Link>

                    {/* MY COURSES */}
                    {user.maLoaiNguoiDung === "HV" && (
                      <Link
                        href="/my-courses"
                        onClick={() => setOpenMenu(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 transition hover:bg-slate-100"
                      >
                        <BookOpen size={20} />
                        Khóa học của tôi
                      </Link>
                    )}

                    {/* ADMIN */}
                    {user.maLoaiNguoiDung === "GV" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setOpenMenu(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-blue-600 transition hover:bg-blue-50"
                      >
                        <Shield size={20} />
                        Trang quản trị
                      </Link>
                    )}

                    <div className="my-2 border-t border-slate-200" />

                    {/* LOGOUT */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={20} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =====================================================
            MOBILE
        ===================================================== */}
        <button
          type="button"
          className="rounded-xl p-2 transition hover:bg-gray-100 lg:hidden"
        >
          <Menu size={28} />
        </button>
      </div>
    </header>
  );
}

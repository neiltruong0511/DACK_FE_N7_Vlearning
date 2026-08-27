"use client";

import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  User,
  X,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { loginSchema, LoginSchema } from "@/schemas/login.schema";
import { useLogin } from "@/hooks/useAuth";
import { saveAuth } from "@/lib/auth";

/* =========================================================
   HELPER
========================================================= */

/**
 * Một số trường hợp backend trả tiếng Việt bị lỗi encoding:
 *
 * Tài khoản hoặc mật khẩu không đúng!
 *
 * thành:
 *
 * TÃ i khoáº£n hoáº·c máº­t kháº©u khÃ´ng Ä‘Ãºng!
 *
 * Hàm này thử decode lại UTF-8.
 */
const fixVietnameseEncoding = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }

  const text = value.trim();

  if (!text) {
    return "";
  }

  /*
   * Nếu text đã đúng tiếng Việt thì giữ nguyên.
   */
  if (!/[ÃÂÄÅÆÐÑ]/.test(text)) {
    return text;
  }

  try {
    const bytes = new Uint8Array(
      Array.from(text).map((char) => char.charCodeAt(0) & 0xff),
    );

    const decoded = new TextDecoder("utf-8").decode(bytes);

    if (decoded && !decoded.includes("�")) {
      return decoded;
    }
  } catch {
    // Bỏ qua nếu không decode được
  }

  return text;
};

/**
 * Lấy message lỗi từ nhiều dạng response API.
 */
const getLoginErrorMessage = (error: any): string => {
  const rawMessage =
    error?.response?.data?.content ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "";

  const fixedMessage = fixVietnameseEncoding(rawMessage);

  /*
   * Nếu backend trả đúng message tài khoản/mật khẩu
   */
  if (
    fixedMessage.toLowerCase().includes("tài khoản") ||
    fixedMessage.toLowerCase().includes("mật khẩu")
  ) {
    return fixedMessage;
  }

  /*
   * Nếu backend trả lỗi HTTP 401
   */
  if (error?.response?.status === 401) {
    return "Tài khoản hoặc mật khẩu không đúng!";
  }

  /*
   * Nếu backend trả lỗi 400
   */
  if (error?.response?.status === 400) {
    return fixedMessage || "Thông tin đăng nhập không hợp lệ!";
  }

  return fixedMessage || "Đăng nhập thất bại. Vui lòng thử lại!";
};

/* =========================================================
   COMPONENT
========================================================= */

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  /*
   * Lỗi đăng nhập hiển thị ngay trong form
   */
  const [loginError, setLoginError] = useState("");

  /*
   * Thông báo thành công
   */
  const [loginSuccess, setLoginSuccess] = useState(false);

  /* =========================================================
     SUBMIT
  ========================================================= */

  const onSubmit = async (data: LoginSchema) => {
    /*
     * Xóa lỗi cũ trước khi đăng nhập lại
     */
    setLoginError("");

    setLoginSuccess(false);

    try {
      const res = await loginMutation.mutateAsync(data);

      const user = res.data?.content || res.data;

      /*
       * Lấy user cũ để giữ avatar
       */
      const oldUserJSON = localStorage.getItem("USER_INFO");

      let oldUser = null;

      if (oldUserJSON) {
        try {
          oldUser = JSON.parse(oldUserJSON);
        } catch {
          oldUser = null;
        }
      }

      /*
       * Giữ avatar cũ nếu API login không trả avatar
       */
      const userWithAvatar = {
        ...user,
        avatar: user?.avatar || oldUser?.avatar || "",
      };

      /*
       * Kiểm tra accessToken
       */
      if (!userWithAvatar?.accessToken) {
        throw new Error(
          "Đăng nhập thành công nhưng không nhận được accessToken.",
        );
      }

      /*
       * Lưu authentication
       */
      saveAuth(userWithAvatar);

      /*
       * Hiển thị thành công trong thời gian ngắn
       */
      setLoginSuccess(true);

      /*
       * Chuyển trang
       */
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 500);
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      const message = getLoginErrorMessage(err);

      /*
       * Hiển thị lỗi ngay bên trong form
       */
      setLoginError(message);

      /*
       * Cuộn nhẹ lên vị trí popup nếu cần
       */
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <div className="rounded-3xl bg-white p-8 shadow-xl">
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800">Đăng nhập</h1>

          <p className="mt-2 text-sm text-slate-500">
            Chào mừng bạn quay lại với VLearning
          </p>
        </div>

        {/* ===================================================
            ERROR POPUP
        =================================================== */}

        {loginError && (
          <div
            role="alert"
            className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-red-50 shadow-sm"
          >
            <div className="flex items-start gap-3 p-4">
              {/* ICON */}

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>

              {/* CONTENT */}

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-red-800">
                  Đăng nhập thất bại
                </p>

                <p className="mt-1 text-sm leading-5 text-red-700">
                  {loginError}
                </p>
              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={() => setLoginError("")}
                className="shrink-0 rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600"
                aria-label="Đóng thông báo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* HINT */}

            <div className="border-t border-red-100 bg-red-100/50 px-4 py-2.5">
              <p className="text-xs text-red-600">
                💡 Hãy kiểm tra lại tài khoản và mật khẩu rồi thử lại.
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            SUCCESS
        =================================================== */}

        {loginSuccess && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-sm font-bold text-emerald-800">
                Đăng nhập thành công
              </p>

              <p className="mt-0.5 text-xs text-emerald-600">
                Đang chuyển đến trang chủ...
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            FORM
        =================================================== */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* =================================================
              TÀI KHOẢN
          ================================================= */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email hoặc Tên đăng nhập
            </label>

            <div
              className={`flex items-center rounded-xl border px-4 py-3 transition ${
                errors.taiKhoan || loginError
                  ? "border-red-300 bg-red-50/30 focus-within:border-red-500"
                  : "border-gray-300 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/10"
              }`}
            >
              <User
                className={`mr-3 shrink-0 ${
                  errors.taiKhoan ? "text-red-400" : "text-slate-400"
                }`}
                size={20}
              />

              <input
                {...register("taiKhoan")}
                placeholder="Nhập tài khoản"
                autoComplete="username"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                onChange={(e) => {
                  register("taiKhoan").onChange(e);

                  /*
                   * Khi user bắt đầu nhập lại,
                   * xóa lỗi đăng nhập.
                   */
                  if (loginError) {
                    setLoginError("");
                  }
                }}
              />
            </div>

            {errors.taiKhoan && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.taiKhoan.message}
              </p>
            )}
          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">
                Mật khẩu
              </label>

              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            <div
              className={`flex items-center rounded-xl border px-4 py-3 transition ${
                errors.matKhau || loginError
                  ? "border-red-300 bg-red-50/30"
                  : "border-gray-300 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/10"
              }`}
            >
              <Lock
                className={`mr-3 shrink-0 ${
                  errors.matKhau ? "text-red-400" : "text-gray-400"
                }`}
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                {...register("matKhau")}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                onChange={(e) => {
                  register("matKhau").onChange(e);

                  if (loginError) {
                    setLoginError("");
                  }
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 shrink-0 text-gray-400 transition hover:text-blue-600"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.matKhau && (
              <p className="mt-1.5 text-sm text-red-500">
                {errors.matKhau.message}
              </p>
            )}
          </div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            disabled={loginMutation.isPending || loginSuccess}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang đăng nhập...
              </>
            ) : loginSuccess ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Đăng nhập thành công
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* ===================================================
            DIVIDER
        =================================================== */}

        <div className="my-8 flex items-center">
          <div className="h-px flex-1 bg-gray-300" />

          <span className="mx-4 text-sm text-gray-500">Hoặc đăng nhập với</span>

          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* ===================================================
            REGISTER
        =================================================== */}

        <p className="text-center text-gray-500">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

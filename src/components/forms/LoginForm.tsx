"use client";

import Link from "next/link";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { loginSchema, LoginSchema } from "@/schemas/login.schema";
import { useLogin } from "@/hooks/useAuth";
import { saveAuth } from "@/lib/auth";

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

  const onSubmit = async (data: LoginSchema) => {
    try {
      const res = await loginMutation.mutateAsync(data);

      const user = res.data;

      // Lấy thông tin user cũ để giữ avatar
      const oldUserJSON = localStorage.getItem("USER_INFO");

      let oldUser = null;

      if (oldUserJSON) {
        try {
          oldUser = JSON.parse(oldUserJSON);
        } catch {
          oldUser = null;
        }
      }

      // Giữ avatar cũ nếu API đăng nhập không trả avatar
      const userWithAvatar = {
        ...user,
        avatar: user.avatar || oldUser?.avatar || "",
      };

      saveAuth(userWithAvatar);

      // Sau khi đăng nhập GV cũng về trang chủ
      router.push("/");
      router.refresh();
    } catch (err: any) {
      alert(err.response?.data?.content || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800">Đăng nhập</h1>

        <p className="mt-2 text-black">Chào mừng bạn quay lại với VLearning</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Tài khoản */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Email hoặc Tên đăng nhập
          </label>

          <div className="flex items-center rounded-xl border border-gray-300 px-4 py-3 focus-within:border-blue-600">
            <User className="mr-3 text-black" size={20} />

            <input
              {...register("taiKhoan")}
              placeholder="Nhập tài khoản"
              className="w-full outline-none text-black"
            />
          </div>

          {errors.taiKhoan && (
            <p className="mt-1 text-sm text-red-500">
              {errors.taiKhoan.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-black">Mật khẩu</label>

            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <div className="flex items-center rounded-xl border border-gray-300 px-4 py-3 focus-within:border-blue-600">
            <Lock className="mr-3 text-gray-400" size={20} />

            <input
              type={showPassword ? "text" : "password"}
              {...register("matKhau")}
              placeholder="••••••••"
              className="w-full outline-none text-black"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-400 hover:text-blue-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errors.matKhau && (
            <p className="mt-1 text-sm text-red-500">
              {errors.matKhau.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-8 flex items-center">
        <div className="h-px flex-1 bg-gray-300" />
        <span className="mx-4 text-sm text-gray-500">Hoặc đăng nhập với</span>
        <div className="h-px flex-1 bg-gray-300" />
      </div>

      {/* Register */}
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
  );
}

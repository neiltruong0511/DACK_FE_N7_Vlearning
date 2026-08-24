"use client";

import Link from "next/link";
import { User, Mail, Lock, ShieldCheck, GraduationCap } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/common/ToastProvider";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema, RegisterSchema } from "@/schemas/register.schema";

import { useRegister } from "@/hooks/useAuth";

export default function RegisterForm() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegister();

  const router = useRouter();

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const payload = {
        ...data,
        maNhom: "GP01",
        maLoaiNguoiDung: "HV",
      };

      const res = await registerMutation.mutateAsync(payload);

      toast.success("Đăng ký tài khoản thành công!");

      console.log(res);

      router.push("/login");
    } catch (err: any) {
      console.log(err);

      toast.error(err.response?.data?.content || "Đăng ký thất bại");
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-2xl w-full max-w-6xl grid md:grid-cols-2">
      {/* ================= LEFT ================= */}

      <div className="hidden md:flex flex-col items-center justify-center bg-blue-50 p-12 relative">
        <GraduationCap size={60} className="text-blue-600 mb-8" />

        <h2 className="text-4xl font-bold text-center text-slate-800">
          Bắt đầu hành trình của bạn
        </h2>

        <p className="mt-6 text-center text-gray-500 leading-8">
          Tham gia cộng đồng Vlearning để tiếp cận hàng nghìn khóa học chất
          lượng từ những chuyên gia hàng đầu.
        </p>

        {/* Background Shapes */}

        <div className="absolute bottom-10 left-10 w-24 h-24 rounded-xl bg-blue-200 opacity-30 rotate-12"></div>

        <div className="absolute bottom-12 right-16 w-28 h-28 rounded-xl bg-indigo-200 opacity-30 rotate-45"></div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-blue-600"></div>
      </div>

      {/* ================= RIGHT ================= */}

      <div className="p-10">
        <h1 className="text-4xl font-bold text-slate-800">
          Đăng ký - VLearning
        </h1>

        <p className="mt-2 text-gray-500">
          Tạo tài khoản để bắt đầu học ngay hôm nay.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* Họ tên */}

          <div>
            <label className="font-semibold text-black">Họ và tên</label>

            <div className="mt-2 flex items-center rounded-xl border px-4 py-3">
              <User className="mr-3 text-gray-400" size={20} />

              <input
                {...register("hoTen")}
                placeholder="Nhập họ tên"
                className="w-full outline-none text-black"
              />
            </div>

            <p className="mt-1 text-sm text-red-500">{errors.hoTen?.message}</p>
          </div>

          {/* Tài khoản */}
          <div>
            <label className="font-semibold text-black">Tài khoản</label>

            <div className="mt-2 flex items-center rounded-xl border px-4 py-3">
              <User className="mr-3 text-gray-400" size={20} />

              <input
                {...register("taiKhoan")}
                placeholder="Nhập tài khoản"
                className="w-full outline-none text-black"
              />
            </div>

            <p className="mt-1 text-sm text-red-500">
              {errors.taiKhoan?.message}
            </p>
          </div>

          {/* Email */}

          <div>
            <label className="font-semibold text-black">Email</label>

            <div className="mt-2 flex items-center rounded-xl border px-4 py-3">
              <Mail className="mr-3 text-gray-400" size={20} />

              <input
                {...register("email")}
                placeholder="example@vlearning.com"
                className="w-full outline-none text-black"
              />
            </div>

            <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
          </div>

          {/* Số điện thoại */}

          <div>
            <label className="font-semibold text-black">Số điện thoại</label>

            <div className="mt-2 flex items-center rounded-xl border px-4 py-3">
              <User className="mr-3 text-gray-400" size={20} />

              <input
                {...register("soDT")}
                placeholder="Nhập số điện thoại"
                className="w-full outline-none text-black"
              />
            </div>

            <p className="mt-1 text-sm text-red-500">{errors.soDT?.message}</p>
          </div>

          {/* Password */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-black">Mật khẩu</label>

              <div className="mt-2 flex items-center rounded-xl border px-4 py-3">
                <Lock className="mr-3 text-gray-400" size={20} />

                <input
                  type="password"
                  {...register("matKhau")}
                  placeholder="********"
                  className="w-full outline-none text-black"
                />
              </div>

              <p className="mt-1 text-sm text-red-500">
                {errors.matKhau?.message}
              </p>
            </div>

            <div>
              <label className="font-semibold text-black">Xác nhận</label>

              <div className="mt-2 flex items-center rounded-xl border px-4 py-3">
                <ShieldCheck className="mr-3 text-gray-400" size={20} />

                <input
                  type="password"
                  placeholder="********"
                  className="w-full outline-none text-black"
                />
              </div>
            </div>
          </div>

          {/* Điều khoản */}

          <label className="flex items-start gap-3 text-sm text-gray-600">
            <input type="checkbox" className="mt-1" />

            <span>
              Tôi đồng ý với các{" "}
              <span className="font-semibold text-blue-600">
                Điều khoản & Điều kiện
              </span>{" "}
              và Chính sách bảo mật của VLearning.
            </span>
          </label>

          {/* Button */}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký →"}
          </button>
        </form>

        <div className="my-8 h-px bg-gray-300"></div>

        <p className="text-center text-gray-500">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-blue-600">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

import { z } from "zod";

export const registerSchema = z.object({
  taiKhoan: z.string().min(1, "Tài khoản không được để trống"),

  matKhau: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),

  email: z.string().email("Email không hợp lệ"),

  hoTen: z.string().min(1, "Họ tên không được để trống"),

  soDT: z.string().min(10, "Số điện thoại không hợp lệ"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
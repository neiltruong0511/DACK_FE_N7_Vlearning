import { axiosClient } from "@/lib/axios";
import { LoginFormData, RegisterFormData } from "@/types/auth";

export const authApi = {
  // Đăng nhập
  login(data: LoginFormData) {
    return axiosClient.post("/QuanLyNguoiDung/DangNhap", data);
  },

  // Đăng ký
  register(data: RegisterFormData) {
    return axiosClient.post("/QuanLyNguoiDung/DangKy", data);
  },

  // Lấy thông tin người dùng
  getProfile() {
    return axiosClient.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
  },
};
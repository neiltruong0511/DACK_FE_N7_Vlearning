import { axiosClient } from "@/lib/axios";

export const userApi = {
  getProfile() {
    return axiosClient.post("/QuanLyNguoiDung/ThongTinNguoiDung");
  },
};
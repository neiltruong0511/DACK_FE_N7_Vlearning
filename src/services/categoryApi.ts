import { axiosClient } from "@/lib/axios";

export const categoryApi = {
  getCategories() {
    return axiosClient.get("/QuanLyKhoaHoc/LayDanhMucKhoaHoc");
  },
};
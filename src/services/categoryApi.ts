import { axiosClient } from "@/lib/axios";

export const categoryApi = {
  getCategories() {
    return axiosClient.get("/QuanLyKhoaHoc/LayDanhMucKhoaHoc");
  },

  addCategory(data: Record<string, unknown>) {
    return axiosClient.post("/QuanLyKhoaHoc/ThemDanhMucKhoaHoc", data);
  },

  updateCategory(data: Record<string, unknown>) {
    return axiosClient.put("/QuanLyKhoaHoc/CapNhatDanhMucKhoaHoc", data);
  },

  deleteCategory(maDanhMuc: string) {
    return axiosClient.delete("/QuanLyKhoaHoc/XoaDanhMucKhoaHoc", {
      params: { MaDanhMuc: maDanhMuc },
    });
  },
};
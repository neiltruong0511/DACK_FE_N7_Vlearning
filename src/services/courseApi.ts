import { axiosClient } from "@/lib/axios";

export const courseApi = {
  // =========================
  // LẤY TẤT CẢ KHÓA HỌC
  // =========================
  getCourses() {
    return axiosClient.get("/QuanLyKhoaHoc/LayDanhSachKhoaHoc");
  },

  // =========================
  // CHI TIẾT KHÓA HỌC
  // =========================
  getCourseDetail(maKhoaHoc: string) {
    return axiosClient.get("/QuanLyKhoaHoc/LayThongTinKhoaHoc", {
      params: {
        maKhoaHoc,
      },
    });
  },

  // =========================
  // KHÓA HỌC THEO DANH MỤC
  // =========================
  getCourseByCategory(maDanhMuc: string) {
    return axiosClient.get("/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc", {
      params: {
        maDanhMuc,
        maNhom: "GP01",
      },
    });
  },

  // =========================
  // PHÂN TRANG
  // =========================
  getCoursePagination(page: number, pageSize: number) {
    return axiosClient.get(
      "/QuanLyKhoaHoc/LayDanhSachKhoaHoc_PhanTrang",
      {
        params: {
          page,
          pageSize,
          MaNhom: "GP01",
        },
      },
    );
  },

  // =========================
  // TÌM KIẾM
  // =========================
  searchCourses(keyword: string) {
    return axiosClient.get("/QuanLyKhoaHoc/LayDanhSachKhoaHoc", {
      params: {
        tenKhoaHoc: keyword,
      },
    });
  },

  // =========================
  // ĐĂNG KÝ KHÓA HỌC
  // =========================
  registerCourse(maKhoaHoc: string, taiKhoan: string) {
    return axiosClient.post("/QuanLyKhoaHoc/DangKyKhoaHoc", {
      maKhoaHoc,
      taiKhoan,
    });
  },

  // =========================
  // GHI DANH KHÓA HỌC
  // =========================
  enrollCourse(maKhoaHoc: string, taiKhoan: string) {
    return axiosClient.post("/QuanLyKhoaHoc/GhiDanhKhoaHoc", {
      maKhoaHoc,
      taiKhoan,
    });
  },

  // =========================
  // HỦY GHI DANH
  // =========================
  cancelEnrollment(maKhoaHoc: string, taiKhoan: string) {
    return axiosClient.post("/QuanLyKhoaHoc/HuyGhiDanh", {
      maKhoaHoc,
      taiKhoan,
    });
  },

  
};

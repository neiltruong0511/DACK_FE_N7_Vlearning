import { axiosClient } from "@/lib/axios";

export const userApi = {
  // =========================
  // PROFILE
  // =========================

  getProfile() {
    return axiosClient.post("/QuanLyNguoiDung/ThongTinNguoiDung");
  },

  getAccountInfo() {
    return axiosClient.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
  },

  // =========================
  // USER TYPES
  // =========================

  getUserTypes() {
    return axiosClient.get(
      "/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung"
    );
  },

  // =========================
  // GET USERS
  // =========================

  getUsers() {
    return axiosClient.get(
      "/QuanLyNguoiDung/LayDanhSachNguoiDung"
    );
  },

  getUsersPagination(page: number, pageSize: number) {
    return axiosClient.get(
      "/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang",
      {
        params: {
          page,
          pageSize,
        },
      }
    );
  },

  searchUsers(keyword: string) {
    return axiosClient.get(
      "/QuanLyNguoiDung/TimKiemNguoiDung",
      {
        params: {
          tuKhoa: keyword,
        },
      }
    );
  },

  // =========================
  // CRUD USER
  // =========================

  addUser(data: Record<string, unknown>) {
    return axiosClient.post(
      "/QuanLyNguoiDung/ThemNguoiDung",
      data
    );
  },

  updateUser(data: Record<string, unknown>) {
    return axiosClient.put(
      "/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
      data
    );
  },

  deleteUser(taiKhoan: string) {
    return axiosClient.delete(
      "/QuanLyNguoiDung/XoaNguoiDung",
      {
        params: {
          TaiKhoan: taiKhoan,
        },
      }
    );
  },

  // =========================
  // COURSE USER
  // =========================

  getUnenrolledCourses(taiKhoan: string) {
    return axiosClient.post(
      "/QuanLyNguoiDung/LayDanhSachKhoaHocChuaGhiDanh",
      {
        taiKhoan,
      }
    );
  },

  getPendingCourses(taiKhoan: string) {
    return axiosClient.post(
      "/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet",
      {
        taiKhoan,
      }
    );
  },

  getApprovedCourses(taiKhoan: string) {
    return axiosClient.post(
      "/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet",
      {
        taiKhoan,
      }
    );
  },

  getUnenrolledUsers(maKhoaHoc: string) {
    return axiosClient.post(
      "/QuanLyNguoiDung/LayDanhSachNguoiDungChuaGhiDanh",
      {
        maKhoaHoc,
      }
    );
  },

  getPendingInstructors() {
    return axiosClient.post(
      "/QuanLyNguoiDung/LayDanhSachHocVienChoXetDuyet"
    );
  },

  getCourseStudents(maKhoaHoc: string) {
    return axiosClient.post(
      "/QuanLyNguoiDung/LayDanhSachHocVienKhoaHoc",
      {
        maKhoaHoc,
      }
    );
  },
};
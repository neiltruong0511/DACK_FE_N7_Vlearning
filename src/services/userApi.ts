import { axiosClient } from "@/lib/axios";

export const userApi = {
  getProfile() {
    return axiosClient.post("/QuanLyNguoiDung/ThongTinNguoiDung");
  },

  getUserTypes() {
    return axiosClient.get("/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung");
  },

  getUsers() {
    return axiosClient.get("/QuanLyNguoiDung/LayDanhSachNguoiDung");
  },

  getUsersPagination(page: number, pageSize: number) {
    return axiosClient.get("/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang", {
      params: { page, pageSize },
    });
  },

  searchUsers(keyword: string) {
    return axiosClient.get("/QuanLyNguoiDung/TimKiemNguoiDung", {
      params: { tuKhoa: keyword },
    });
  },

  getAccountInfo() {
    return axiosClient.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
  },

  addUser(data: Record<string, unknown>) {
    return axiosClient.post("/QuanLyNguoiDung/ThemNguoiDung", data);
  },

  updateUser(data: Record<string, unknown>) {
    return axiosClient.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", data);
  },

  deleteUser(taiKhoan: string) {
    return axiosClient.delete("/QuanLyNguoiDung/XoaNguoiDung", {
      params: { TaiKhoan: taiKhoan },
    });
  },

  // ==========================================
  // NHÓM GHI DANH - QUẢN LÝ THEO NGƯỜI DÙNG (USER)
  // ==========================================

  getUnenrolledCourses(taiKhoan: string) {
    // SỬA LỖI: API này dùng Query Parameter (?TaiKhoan=...) theo Swagger
    return axiosClient.post(`/QuanLyNguoiDung/LayDanhSachKhoaHocChuaGhiDanh?TaiKhoan=${taiKhoan}`);
  },

  getPendingCourses(taiKhoan: string) {
    // API này dùng Body
    return axiosClient.post("/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet", {
      taiKhoan,
    });
  },

  getApprovedCourses(taiKhoan: string) {
    // API này dùng Body
    return axiosClient.post("/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet", {
      taiKhoan,
    });
  },

  // ==========================================
  // NHÓM GHI DANH - QUẢN LÝ THEO KHÓA HỌC (COURSE)
  // ==========================================

  getUnenrolledUsers(maKhoaHoc: string) {
    // API này dùng Body
    return axiosClient.post("/QuanLyNguoiDung/LayDanhSachNguoiDungChuaGhiDanh", {
      maKhoaHoc,
    });
  },

  getPendingStudents(maKhoaHoc: string) {
    // SỬA LỖI: Đổi tên thành getPendingStudents và thêm Body maKhoaHoc
    return axiosClient.post("/QuanLyNguoiDung/LayDanhSachHocVienChoXetDuyet", {
      maKhoaHoc,
    });
  },

  getCourseStudents(maKhoaHoc: string) {
    // API này dùng Body
    return axiosClient.post("/QuanLyNguoiDung/LayDanhSachHocVienKhoaHoc", {
      maKhoaHoc,
    });
  },
};
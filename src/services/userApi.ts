import { axiosClient } from "@/lib/axios";

export const userApi = {
  // =========================================================
  // PROFILE
  // =========================================================

  getProfile() {
    return axiosClient.post("/QuanLyNguoiDung/ThongTinNguoiDung");
  },

  getAccountInfo() {
    return axiosClient.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
  },

  // =========================================================
  // USER TYPES
  // =========================================================

  getUserTypes() {
    return axiosClient.get(
      "/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung",
    );
  },

  // =========================================================
  // GET USERS
  // =========================================================

  getUsers() {
    return axiosClient.get(
      "/QuanLyNguoiDung/LayDanhSachNguoiDung",
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
      },
    );
  },

  searchUsers(keyword: string) {
    return axiosClient.get(
      "/QuanLyNguoiDung/TimKiemNguoiDung",
      {
        params: {
          tuKhoa: keyword,
        },
      },
    );
  },

  // =========================================================
  // CRUD USER
  // =========================================================

  addUser(data: Record<string, unknown>) {
    return axiosClient.post(
      "/QuanLyNguoiDung/ThemNguoiDung",
      data,
    );
  },

  updateUser(data: Record<string, unknown>) {
    return axiosClient.put(
      "/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
      data,
    );
  },

  deleteUser(taiKhoan: string) {
    return axiosClient.delete(
      "/QuanLyNguoiDung/XoaNguoiDung",
      {
        params: {
          TaiKhoan: taiKhoan,
        },
      },
    );
  },

  // =========================================================
  // GHI DANH - QUẢN LÝ THEO NGƯỜI DÙNG
  // =========================================================

  /**
   * Lấy danh sách khóa học chưa ghi danh của user
   *
   * API CyberSoft dùng Query Parameter:
   * ?TaiKhoan=...
   */
  getUnenrolledCourses(taiKhoan: string) {
    return axiosClient.post(
      "/QuanLyNguoiDung/LayDanhSachKhoaHocChuaGhiDanh",
      null,
      {
        params: {
          TaiKhoan: taiKhoan,
        },
      },
    );
  },

  /**
   * Lấy danh sách khóa học đang chờ xét duyệt
   *
   * API dùng Body:
   * {
   *   taiKhoan: "..."
   * }
   */
  getPendingCourses(taiKhoan: string) {
    return axiosClient.post(
      "/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet",
      {
        taiKhoan,
      },
    );
  },

  /**
   * Lấy danh sách khóa học đã xét duyệt
   *
   * API dùng Body:
   * {
   *   taiKhoan: "..."
   * }
   */
  getApprovedCourses(taiKhoan: string) {
    return axiosClient.post(
      "/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet",
      {
        taiKhoan,
      },
    );
  },

  // =========================================================
  // GHI DANH - QUẢN LÝ THEO KHÓA HỌC
  // =========================================================

  /**
   * Lấy danh sách người dùng chưa ghi danh khóa học
   *
   * Body:
   * {
   *   maKhoaHoc: "..."
   * }
   */
  getUnenrolledUsers(maKhoaHoc: string) {
    return axiosClient.post(
      "/QuanLyNguoiDung/LayDanhSachNguoiDungChuaGhiDanh",
      {
        maKhoaHoc,
      },
    );
  },

  /**
   * Lấy danh sách học viên đang chờ xét duyệt
   *
   * API:
   * LayDanhSachHocVienChoXetDuyet
   *
   * Body:
   * {
   *   maKhoaHoc: "..."
   * }
   */
  getPendingStudents(maKhoaHoc: string) {
    return axiosClient.post(
      "/QuanLyNguoiDung/LayDanhSachHocVienChoXetDuyet",
      {
        maKhoaHoc,
      },
    );
  },

  /**
   * Lấy danh sách học viên của khóa học
   *
   * Body:
   * {
   *   maKhoaHoc: "..."
   * }
   */
  getCourseStudents(maKhoaHoc: string) {
    return axiosClient.post(
      "/QuanLyNguoiDung/LayDanhSachHocVienKhoaHoc",
      {
        maKhoaHoc,
      },
    );
  },
};
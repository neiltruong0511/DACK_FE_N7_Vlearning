export interface LoginFormData {
  taiKhoan: string;
  matKhau: string;
}

export interface RegisterFormData {
  taiKhoan: string;
  matKhau: string;
  email: string;
  soDT: string;
  maNhom: string;
  maLoaiNguoiDung: string;
  hoTen: string;
}

export interface LoginResponse {
  accessToken: string;
  taiKhoan: string;
  hoTen: string;
  email: string;
  maLoaiNguoiDung: string;
}
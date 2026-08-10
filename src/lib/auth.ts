export interface UserInfo {
  taiKhoan: string;
  hoTen: string;
  email: string;
  accessToken: string;
  maLoaiNguoiDung: "HV" | "GV";
}

export const saveAuth = (user: UserInfo) => {
  localStorage.setItem("ACCESS_TOKEN", user.accessToken);
  localStorage.setItem("USER_INFO", JSON.stringify(user));
};

export const getUser = (): UserInfo | null => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("USER_INFO");

  if (!user) return null;

  return JSON.parse(user);
};

export const getToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("ACCESS_TOKEN");
};

export const logout = () => {
  localStorage.removeItem("ACCESS_TOKEN");
};
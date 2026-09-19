export interface UserInfo {
  taiKhoan: string;
  hoTen: string;
  email: string;
  accessToken: string;
  maLoaiNguoiDung: "HV" | "GV";
}

export const saveAuth = (user: UserInfo) => {
  sessionStorage.setItem("ACCESS_TOKEN", user.accessToken);
  sessionStorage.setItem("USER_INFO", JSON.stringify(user));
};

export const getUser = (): UserInfo | null => {
  if (typeof window === "undefined") return null;

  const user = sessionStorage.getItem("USER_INFO");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    sessionStorage.removeItem("USER_INFO");
    return null;
  }
};

export const getToken = () => {
  if (typeof window === "undefined") return null;

  return sessionStorage.getItem("ACCESS_TOKEN");
};

export const logout = () => {
  sessionStorage.removeItem("ACCESS_TOKEN");
  sessionStorage.removeItem("USER_INFO");
};
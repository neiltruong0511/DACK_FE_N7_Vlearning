import { create } from "zustand";

interface User {
  taiKhoan: string;
  hoTen: string;
  email: string;
  maLoaiNguoiDung: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;

  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setUser: (user) => set({ user }),

  setAccessToken: (token) => set({ accessToken: token }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));
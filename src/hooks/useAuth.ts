import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/services/authApi";
import { LoginFormData, RegisterFormData } from "@/types/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) => authApi.register(data),
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await authApi.getProfile();
      return res.data;
    },
    enabled: false, // Chỉ gọi khi đã có token
  });
};
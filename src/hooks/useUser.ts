import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/userApi";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await userApi.getProfile();

      return res.data.content;
    },
  });
};
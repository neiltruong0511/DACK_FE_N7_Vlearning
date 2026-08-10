import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/services/categoryApi";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoryApi.getCategories();

      return res.data;
    },
  });
};
import { courseApi } from "@/services/courseApi";
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";


// =========================
// LẤY TẤT CẢ KHÓA HỌC
// =========================
export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await courseApi.getCourses();

      return res.data;
    },
  });
};

// =========================
// PHÂN TRANG
// =========================
export const useCoursePagination = (
  page: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: ["courses", page, pageSize],

    queryFn: async () => {
      const res = await courseApi.getCoursePagination(
        page,
        pageSize
      );

      console.log("Pagination:", res);

      return res.data;
    },
  });
};

// =========================
// CHI TIẾT KHÓA HỌC
// =========================
export const useCourseDetail = (id: string) => {
  return useQuery({
    queryKey: ["course-detail", id],

    queryFn: async () => {
      const res = await courseApi.getCourseDetail(id);

      return res.data;
    },

    enabled: !!id,
  });
};

// =========================
// KHÓA HỌC THEO DANH MỤC
// =========================
export const useCourseByCategory = (
  maDanhMuc: string
) => {
  return useQuery({
    queryKey: ["course-category", maDanhMuc],

    queryFn: async () => {
      const res = await courseApi.getCourseByCategory(
        maDanhMuc
      );

      return res.data;
    },

    enabled: !!maDanhMuc,
  });
};

// =========================
// TÌM KIẾM KHÓA HỌC
// =========================
export const useSearchCourse = (keyword: string) => {
  return useQuery({
    queryKey: ["search-course", keyword],

    queryFn: async () => {
      const res = await courseApi.searchCourses(keyword);

      return res.data;
    },

    enabled: !!keyword,
  });
};

// =========================
// ĐĂNG KÝ KHÓA HỌC
// =========================
export const useRegisterCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      maKhoaHoc,
      taiKhoan,
    }: {
      maKhoaHoc: string;
      taiKhoan: string;
    }) => {
      return courseApi.registerCourse(
        maKhoaHoc,
        taiKhoan
      );
    },

    onSuccess: () => {
      // Đăng ký thành công thì cập nhật lại
      // danh sách khóa học của tôi
      queryClient.invalidateQueries({
        queryKey: ["my-courses"],
      });
    },
  });

};

export const useCancelEnrollment = () => {
  return useMutation({
    mutationFn: ({
      maKhoaHoc,
      taiKhoan,
    }: {
      maKhoaHoc: string;
      taiKhoan: string;
    }) => {
      return courseApi.cancelEnrollment(
        maKhoaHoc,
        taiKhoan,
      );
    },
  });
};


// Load more
export const useCourseLoadMore = () => {
  return useInfiniteQuery({
    queryKey: ["courses", "load-more"],

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const res = await courseApi.getCoursePagination(
        pageParam,
        8
      );

      console.log("Load more page:", pageParam, res.data);

      return res.data;
    },

    getNextPageParam: (lastPage, allPages) => {
      const totalPages =
        lastPage?.totalPages ||
        lastPage?.totalPagesCount ||
        lastPage?.totalPage;

      if (totalPages && allPages.length >= totalPages) {
        return undefined;
      }

      return allPages.length + 1;
    },
  });
};

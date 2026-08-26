// src/hooks/useEnroll.ts
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/services/userApi';

// Hooks cho luồng User -> Khóa học
export const useCoursesByUser = (taiKhoan: string) => {
  const unregistered = useQuery({
    queryKey: ['unregisteredCourses', taiKhoan],
    // Đổi getUnregisteredCourses thành getUnenrolledCourses
    queryFn: () => userApi.getUnenrolledCourses(taiKhoan),
    enabled: !!taiKhoan, // Chỉ chạy khi có tài khoản
  });

  const pending = useQuery({
    queryKey: ['pendingCourses', taiKhoan],
    queryFn: () => userApi.getPendingCourses(taiKhoan),
    enabled: !!taiKhoan,
  });

  const approved = useQuery({
    queryKey: ['approvedCourses', taiKhoan],
    queryFn: () => userApi.getApprovedCourses(taiKhoan),
    enabled: !!taiKhoan,
  });

  return { unregistered, pending, approved };
};

// Hooks cho luồng Khóa học -> User
export const useUsersByCourse = (maKhoaHoc: string) => {
  const unregistered = useQuery({
    queryKey: ['unregisteredUsers', maKhoaHoc],
    // Đổi getUnregisteredUsers thành getUnenrolledUsers
    queryFn: () => userApi.getUnenrolledUsers(maKhoaHoc),
    enabled: !!maKhoaHoc,
  });

  const pending = useQuery({
    queryKey: ['pendingUsers', maKhoaHoc],
    // Đổi getPendingUsers thành getPendingStudents
    queryFn: () => userApi.getPendingStudents(maKhoaHoc),
    enabled: !!maKhoaHoc,
  });

  const approved = useQuery({
    queryKey: ['approvedUsers', maKhoaHoc],
    // Đổi getApprovedUsers thành getCourseStudents
    queryFn: () => userApi.getCourseStudents(maKhoaHoc),
    enabled: !!maKhoaHoc,
  });

  return { unregistered, pending, approved };
};
"use client";

import { useState } from "react";
import { Edit, Trash2, Users, Search, Plus } from "lucide-react";
import CourseEnrollmentModal from "./CourseEnrollmentModal";

interface Course {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  luotXem: number;
  nguoiTao: string;
}

export default function CourseTable() {
  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string>("");

  // Dữ liệu mẫu (Thay bằng API sau)
  const mockCourses: Course[] = [
    { maKhoaHoc: "KH01", tenKhoaHoc: "Lập trình ReactJS căn bản", luotXem: 150, nguoiTao: "admin1" },
    { maKhoaHoc: "KH02", tenKhoaHoc: "Thiết kế Web với Tailwind", luotXem: 230, nguoiTao: "admin1" },
  ];

  const handleOpenEnrollment = (maKhoaHoc: string, tenKhoaHoc: string) => {
    setSelectedCourseId(maKhoaHoc);
    setSelectedCourseName(tenKhoaHoc);
    setIsModalOpen(true);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="w-full rounded-xl border border-slate-200 bg-[#f5f8f8] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#123b3a] focus:bg-white"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-[#123b3a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a5150]">
          <Plus className="h-5 w-5" />
          Thêm khóa học
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#f5f8f8] font-semibold text-[#123b3a]">
            <tr>
              <th className="px-4 py-3">Mã KH</th>
              <th className="px-4 py-3">Tên khóa học</th>
              <th className="px-4 py-3">Người tạo</th>
              <th className="px-4 py-3 text-right">Lượt xem</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockCourses.map((course) => (
              <tr key={course.maKhoaHoc} className="transition hover:bg-slate-50">
                <td className="px-4 py-4 font-medium text-slate-900">{course.maKhoaHoc}</td>
                <td className="px-4 py-4">{course.tenKhoaHoc}</td>
                <td className="px-4 py-4">{course.nguoiTao}</td>
                <td className="px-4 py-4 text-right font-medium text-teal-600">{course.luotXem}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Nút gọi Modal Quản lý Học viên */}
                    <button 
                      onClick={() => handleOpenEnrollment(course.maKhoaHoc, course.tenKhoaHoc)}
                      className="rounded-lg bg-[#e4c77b]/20 p-2 text-[#b59950] transition hover:bg-[#e4c77b] hover:text-[#123b3a]"
                      title="Quản lý học viên"
                    >
                      <Users className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100" title="Sửa">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100" title="Xóa">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tích hợp Modal */}
      <CourseEnrollmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        maKhoaHoc={selectedCourseId}
        tenKhoaHoc={selectedCourseName}
      />
    </div>
  );
}
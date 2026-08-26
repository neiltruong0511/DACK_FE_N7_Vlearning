"use client";

import { useState } from "react";
import { Edit, Trash2, BookOpen, Search, Plus } from "lucide-react";
import UserEnrollmentModal from "./UserEnrollmentModal";
// Bạn có thể import useQuery và userApi ở đây để gọi data thật sau

interface User {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  maLoaiNguoiDung: string;
}

export default function UserTable() {
  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Dữ liệu mẫu (Tạm thời để bạn xem UI, bạn thay bằng data từ API sau)
  const mockUsers: User[] = [
    { taiKhoan: "admin1", hoTen: "Nguyễn Văn A", email: "a@gmail.com", soDT: "0123456789", maLoaiNguoiDung: "GV" },
    { taiKhoan: "hocvien2", hoTen: "Trần Thị B", email: "b@gmail.com", soDT: "0987654321", maLoaiNguoiDung: "HV" },
  ];

  const handleOpenEnrollment = (taiKhoan: string) => {
    setSelectedUser(taiKhoan);
    setIsModalOpen(true);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* Thanh công cụ */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="w-full rounded-xl border border-slate-200 bg-[#f5f8f8] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#123b3a] focus:bg-white"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-[#123b3a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a5150]">
          <Plus className="h-5 w-5" />
          Thêm người dùng
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#f5f8f8] font-semibold text-[#123b3a]">
            <tr>
              <th className="px-4 py-3">Tài khoản</th>
              <th className="px-4 py-3">Họ tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Loại ND</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mockUsers.map((user) => (
              <tr key={user.taiKhoan} className="transition hover:bg-slate-50">
                <td className="px-4 py-4 font-medium text-slate-900">{user.taiKhoan}</td>
                <td className="px-4 py-4">{user.hoTen}</td>
                <td className="px-4 py-4">{user.email}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    user.maLoaiNguoiDung === "GV" ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700"
                  }`}>
                    {user.maLoaiNguoiDung === "GV" ? "Giảng viên" : "Học viên"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Nút gọi Modal Ghi danh */}
                    <button 
                      onClick={() => handleOpenEnrollment(user.taiKhoan)}
                      className="rounded-lg bg-[#e4c77b]/20 p-2 text-[#b59950] transition hover:bg-[#e4c77b] hover:text-[#123b3a]"
                      title="Quản lý khóa học"
                    >
                      <BookOpen className="h-4 w-4" />
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
      <UserEnrollmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        taiKhoan={selectedUser} 
      />
    </div>
  );
}
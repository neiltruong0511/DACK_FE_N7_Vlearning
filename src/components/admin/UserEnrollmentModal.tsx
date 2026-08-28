"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useCoursesByUser } from "@/hooks/useEnroll";
import { BookOpen, Check, Clock, Plus, Trash2, X } from "lucide-react";
import { courseApi } from "@/services/courseApi";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/common/ToastProvider";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface UserEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  taiKhoan: string | null;
}

interface CourseData {
  maKhoaHoc: string;
  tenKhoaHoc: string;
}

export default function UserEnrollmentModal({
  isOpen,
  onClose,
  taiKhoan,
}: UserEnrollmentModalProps) {
  const [activeTab, setActiveTab] = useState<
    "unregistered" | "pending" | "approved"
  >("unregistered");

  // State quản lý Confirm Modal
  const [courseToDelete, setCourseToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();
  const toast = useToast();

  const { unregistered, pending, approved } = useCoursesByUser(taiKhoan || "");

  const isLoading =
    unregistered.isLoading || pending.isLoading || approved.isLoading;

  const tabs = [
    { id: "unregistered", label: "Chưa ghi danh", count: unregistered.data?.data?.length || 0, icon: Plus },
    { id: "pending", label: "Chờ xét duyệt", count: pending.data?.data?.length || 0, icon: Clock },
    { id: "approved", label: "Đã ghi danh", count: approved.data?.data?.length || 0, icon: Check },
  ] as const;

  const currentData =
    activeTab === "unregistered"
      ? unregistered.data?.data
      : activeTab === "pending"
        ? pending.data?.data
        : approved.data?.data;

  // HÀM XỬ LÝ GHI DANH VÀ DUYỆT
  const handleEnroll = async (maKhoaHoc: string) => {
    if (!taiKhoan) return;
    try {
      await courseApi.enrollCourse(maKhoaHoc, taiKhoan);
      queryClient.invalidateQueries({
        queryKey: ["unregisteredCourses", taiKhoan],
      });
      queryClient.invalidateQueries({ queryKey: ["pendingCourses", taiKhoan] });
      queryClient.invalidateQueries({
        queryKey: ["approvedCourses", taiKhoan],
      });

      toast.success("Thao tác ghi danh/duyệt thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thao tác!");
    }
  };

  // HÀM XỬ LÝ HỦY VÀ XÓA (KHI ĐÃ BẤM XÁC NHẬN TRÊN CONFIRM MODAL)
  const handleCancel = async () => {
    if (!taiKhoan || !courseToDelete) return;
    setIsDeleting(true);
    try {
      await courseApi.cancelEnrollment(courseToDelete.id, taiKhoan);
      queryClient.invalidateQueries({
        queryKey: ["unregisteredCourses", taiKhoan],
      });
      queryClient.invalidateQueries({ queryKey: ["pendingCourses", taiKhoan] });
      queryClient.invalidateQueries({
        queryKey: ["approvedCourses", taiKhoan],
      });

      toast.success("Đã hủy ghi danh thành công!");
      setCourseToDelete(null); // Đóng modal xác nhận
    } catch (error) {
      toast.error("Có lỗi xảy ra khi hủy ghi danh!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Quản lý khóa học - Học viên: ${taiKhoan}`}
      maxWidth="max-w-5xl"
    >
      <div className="mb-6 flex gap-2 border-b border-slate-200 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-[#123b3a] text-white"
                  : "bg-[#f5f8f8] text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span
                className={`ml-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${activeTab === tab.id ? "bg-[#e4c77b] text-[#123b3a]" : "bg-slate-300 text-slate-700"}`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center text-slate-500">
            Đang tải dữ liệu...
          </div>
        ) : currentData && currentData.length > 0 ? (
          <ul className="space-y-3">
            {currentData.map((course: CourseData, idx: number) => (
              <li
                key={idx}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#f5f8f8] p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-[#123b3a]">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#123b3a]">
                      {course.tenKhoaHoc}
                    </h4>
                    <span className="text-sm text-slate-500">
                      Mã KH: {course.maKhoaHoc}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {activeTab === "unregistered" && (
                    <button
                      onClick={() => handleEnroll(course.maKhoaHoc)}
                      className="flex items-center gap-1 rounded-lg bg-[#e4c77b] px-4 py-2 text-sm font-bold text-[#123b3a] transition hover:brightness-110"
                    >
                      Ghi danh
                    </button>
                  )}
                  {activeTab === "pending" && (
                    <>
                      <button
                        onClick={() => handleEnroll(course.maKhoaHoc)}
                        className="flex items-center gap-1 rounded-lg bg-[#123b3a] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1a5150]"
                      >
                        <Check className="h-4 w-4" /> Duyệt
                      </button>
                      <button
                        onClick={() =>
                          setCourseToDelete({
                            id: course.maKhoaHoc,
                            name: course.tenKhoaHoc,
                          })
                        }
                        className="flex items-center gap-1 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-200"
                      >
                        <X className="h-4 w-4" /> Hủy
                      </button>
                    </>
                  )}
                  {activeTab === "approved" && (
                    <button
                      onClick={() =>
                        setCourseToDelete({
                          id: course.maKhoaHoc,
                          name: course.tenKhoaHoc,
                        })
                      }
                      className="flex items-center gap-1 rounded-lg bg-red-100 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-200"
                    >
                      <Trash2 className="h-4 w-4" /> Xóa
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-[300px] flex-col items-center justify-center text-slate-500">
            <BookOpen className="mb-2 h-10 w-10 opacity-20" />
            <p>Không có khóa học nào trong mục này.</p>
          </div>
        )}
      </div>

      {/* TÍCH HỢP CONFIRM MODAL TẠI ĐÂY */}
      <ConfirmModal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleCancel}
        title="Hủy khóa học?"
        description={`Bạn sắp hủy ghi danh khóa học <strong>${courseToDelete?.name}</strong>.`}
        isLoading={isDeleting}
      />
    </Modal>
  );
}
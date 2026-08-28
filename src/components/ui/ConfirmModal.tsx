"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận hủy",
  cancelText = "Giữ lại",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop mờ */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Nội dung Modal */}
      <div className="relative w-full max-w-[480px] rounded-3xl bg-white p-6 shadow-2xl md:p-8 animate-in zoom-in-95 duration-200">
        {/* Header với Icon cảnh báo */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">
              Xác nhận trước khi thay đổi danh sách
            </p>
          </div>
        </div>

        {/* Thông điệp chính */}
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100">
          <p
            className="text-[15px] leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: description }}
          ></p>
          <p className="mt-2 text-sm text-slate-400">
            Bạn có thể thao tác lại sau nếu đổi ý.
          </p>
        </div>

        {/* Cụm nút bấm */}
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[#ff3344] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#e62e3d] shadow-[0_4px_14px_0_rgba(255,51,68,0.39)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

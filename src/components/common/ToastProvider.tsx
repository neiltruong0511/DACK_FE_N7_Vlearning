"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

type ToastType = "success" | "error";
type Toast = { id: number; type: ToastType; message: string };
type ToastContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast phải được dùng bên trong ToastProvider");
  return context;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const value = useMemo(
    () => ({
      success: (message: string) => push("success", message),
      error: (message: string) => push("error", message),
    }),
    [],
  );

  useEffect(() => {
    if (toasts.length > 3) setToasts((current) => current.slice(-3));
  }, [toasts.length]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-[5.5rem] z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => {
          const success = toast.type === "success";
          return (
            <div
              key={toast.id}
              role="status"
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold shadow-xl ${success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}
            >
              {success ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />}
              <p className="flex-1 leading-5">{toast.message}</p>
              <button type="button" aria-label="Đóng thông báo" onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} className="rounded-md p-0.5 opacity-60 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Edit3,
  Info,
  Loader2,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { userApi } from "@/services/userApi";
import UserEnrollmentModal from "@/components/admin/UserEnrollmentModal";

/* =========================================================
   TYPES
========================================================= */

type User = {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDt?: string;
  soDT?: string;
  maLoaiNguoiDung?: string;
  maNhom?: string;
};

type UserType = {
  maLoaiNguoiDung: string;
  tenLoaiNguoiDung: string;
};

type FormData = {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  email: string;
  soDt: string;
  maLoaiNguoiDung: string;
  maNhom: string;
};

type NotificationType =
  | "success"
  | "error"
  | "warning"
  | "info";

type Notification = {
  type: NotificationType;
  title: string;
  message: string;
};

type ConfirmModal = {
  title: string;
  message: string;
  confirmText?: string;
};

/* =========================================================
   CONSTANT
========================================================= */

const PAGE_SIZE = 8;

const DEFAULT_USER_TYPES: UserType[] = [
  {
    maLoaiNguoiDung: "HV",
    tenLoaiNguoiDung: "Học viên",
  },
  {
    maLoaiNguoiDung: "GV",
    tenLoaiNguoiDung: "Giáo vụ",
  },
];

/* =========================================================
   HELPER
========================================================= */

const getList = <T,>(data: any): T[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.content?.items)) {
    return data.content.items;
  }

  return [];
};

const getErrorMessage = (
  error: any,
  defaultMessage: string,
): string => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.content ||
    error?.response?.data?.error ||
    error?.message;

  if (
    typeof message === "string" &&
    message.trim()
  ) {
    return message;
  }

  return defaultMessage;
};

const normalizeText = (value: unknown) => {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

/* =========================================================
   COMPONENT
========================================================= */

export default function AdminUsersPage() {
  /* =======================================================
     USERS
  ======================================================= */

  const [users, setUsers] = useState<User[]>([]);

  const [types, setTypes] = useState<UserType[]>(
    DEFAULT_USER_TYPES,
  );

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [keyword, setKeyword] = useState("");

  const [searching, setSearching] = useState(false);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] =
    useState<string | null>(null);

  /* =======================================================
     USER FORM
  ======================================================= */

  const [open, setOpen] = useState(false);

  const [editing, setEditing] =
    useState<User | null>(null);

  /* =======================================================
     ENROLLMENT MODAL
  ======================================================= */

  const [enrollModalOpen, setEnrollModalOpen] =
    useState(false);

  const [
    selectedUserForEnroll,
    setSelectedUserForEnroll,
  ] = useState<string | null>(null);

  /* =======================================================
     NOTIFICATION
  ======================================================= */

  const [notification, setNotification] =
    useState<Notification | null>(null);

  const notificationTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  /* =======================================================
     CONFIRM DELETE MODAL
  ======================================================= */

  const [confirmModal, setConfirmModal] =
    useState<ConfirmModal | null>(null);

  const confirmActionRef =
    useRef<(() => void) | null>(null);

  /* =======================================================
     FORM
  ======================================================= */

  const [form, setForm] = useState<FormData>({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    email: "",
    soDt: "",
    maLoaiNguoiDung: "HV",
    maNhom: "GP01",
  });

  /* =======================================================
     SEARCH REFS
  ======================================================= */

  const searchTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const searchRequestIdRef = useRef(0);

  /* =========================================================
     NOTIFICATION
  ========================================================= */

  const showNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      duration = 4000,
    ) => {
      if (notificationTimerRef.current) {
        clearTimeout(
          notificationTimerRef.current,
        );
      }

      setNotification({
        type,
        title,
        message,
      });

      notificationTimerRef.current =
        setTimeout(() => {
          setNotification(null);
        }, duration);
    },
    [],
  );

  const closeNotification = () => {
    if (notificationTimerRef.current) {
      clearTimeout(
        notificationTimerRef.current,
      );
    }

    setNotification(null);
  };

  /* =========================================================
     CONFIRM MODAL
  ========================================================= */

  const showConfirm = (
    title: string,
    message: string,
    action: () => void,
    confirmText = "Xác nhận",
  ) => {
    confirmActionRef.current = action;

    setConfirmModal({
      title,
      message,
      confirmText,
    });
  };

  const closeConfirm = () => {
    setConfirmModal(null);
    confirmActionRef.current = null;
  };

  const handleConfirm = () => {
    const action = confirmActionRef.current;

    closeConfirm();

    if (action) {
      action();
    }
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setForm({
      taiKhoan: "",
      matKhau: "",
      hoTen: "",
      email: "",
      soDt: "",
      maLoaiNguoiDung: "HV",
      maNhom: "GP01",
    });
  };

  /* =========================================================
     LOAD USERS
  ========================================================= */

  const loadUsers = useCallback(
    async (pageNumber: number) => {
      try {
        setLoading(true);

        const result =
          await userApi.getUsersPagination(
            pageNumber,
            PAGE_SIZE,
          );

        console.log(
          "USER PAGINATION RESPONSE:",
          result.data,
        );

        const response = result.data;

        const usersData =
          getList<User>(response);

        setUsers(usersData);

        const total =
          Number(response?.totalPages) ||
          Number(response?.totalPagesCount) ||
          Number(
            response?.content?.totalPages,
          ) ||
          Number(
            response?.content?.totalPagesCount,
          ) ||
          1;

        setTotalPages(
          Math.max(1, total),
        );
      } catch (error) {
        console.error(
          "Lỗi lấy danh sách user:",
          error,
        );

        setUsers([]);

        showNotification(
          "error",
          "Không thể tải dữ liệu",
          getErrorMessage(
            error,
            "Không thể lấy danh sách người dùng.",
          ),
          6000,
        );
      } finally {
        setLoading(false);
      }
    },
    [showNotification],
  );

  /* =========================================================
     LOAD USER TYPES
  ========================================================= */

  const loadUserTypes = useCallback(
    async () => {
      try {
        const result =
          await userApi.getUserTypes();

        console.log(
          "USER TYPES RESPONSE:",
          result.data,
        );

        const typesData =
          getList<UserType>(
            result.data,
          );

        if (typesData.length > 0) {
          setTypes(typesData);
        } else {
          setTypes(DEFAULT_USER_TYPES);
        }
      } catch (error) {
        console.error(
          "Lỗi lấy loại người dùng:",
          error,
        );

        setTypes(DEFAULT_USER_TYPES);
      }
    },
    [],
  );

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    if (keyword.trim()) {
      return;
    }

    loadUsers(page);
  }, [
    page,
    keyword,
    loadUsers,
  ]);

  useEffect(() => {
    loadUserTypes();
  }, [loadUserTypes]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const searchUsers = useCallback(
    async (searchValue: string) => {
      const value = searchValue.trim();

      if (!value) {
        return;
      }

      const currentRequestId =
        ++searchRequestIdRef.current;

      try {
        setSearching(true);

        try {
          const result =
            await userApi.searchUsers(
              value,
            );

          console.log(
            "SEARCH API RESPONSE:",
            result.data,
          );

          if (
            currentRequestId !==
            searchRequestIdRef.current
          ) {
            return;
          }

          const searchResult =
            getList<User>(
              result.data,
            );

          if (
            searchResult.length > 0
          ) {
            setUsers(searchResult);
            setTotalPages(1);

            return;
          }
        } catch (apiError) {
          console.warn(
            "Search API không trả kết quả, chuyển fallback:",
            apiError,
          );
        }

        /* ==============================
           FALLBACK SEARCH
        ============================== */

        const allUsersResponse =
          await userApi.getUsers();

        if (
          currentRequestId !==
          searchRequestIdRef.current
        ) {
          return;
        }

        const allUsers =
          getList<User>(
            allUsersResponse.data,
          );

        const normalizedKeyword =
          normalizeText(value);

        const filteredUsers =
          allUsers.filter(
            (user) => {
              const taiKhoan =
                normalizeText(
                  user.taiKhoan,
                );

              const hoTen =
                normalizeText(
                  user.hoTen,
                );

              const email =
                normalizeText(
                  user.email,
                );

              const soDt =
                normalizeText(
                  user.soDt ||
                    user.soDT,
                );

              return (
                taiKhoan.includes(
                  normalizedKeyword,
                ) ||
                hoTen.includes(
                  normalizedKeyword,
                ) ||
                email.includes(
                  normalizedKeyword,
                ) ||
                soDt.includes(
                  normalizedKeyword,
                )
              );
            },
          );

        setUsers(filteredUsers);
        setTotalPages(1);
      } catch (error) {
        console.error(
          "Lỗi tìm kiếm user:",
          error,
        );

        if (
          currentRequestId ===
          searchRequestIdRef.current
        ) {
          setUsers([]);
          setTotalPages(1);
        }
      } finally {
        if (
          currentRequestId ===
          searchRequestIdRef.current
        ) {
          setSearching(false);
        }
      }
    },
    [],
  );

  /* =========================================================
     HANDLE SEARCH
  ========================================================= */

  const handleSearch = (
    value: string,
  ) => {
    setKeyword(value);

    if (searchTimerRef.current) {
      clearTimeout(
        searchTimerRef.current,
      );
    }

    searchRequestIdRef.current += 1;

    const searchValue =
      value.trim();

    if (!searchValue) {
      setSearching(false);
      setPage(1);
      loadUsers(1);

      return;
    }

    searchTimerRef.current =
      setTimeout(() => {
        searchUsers(searchValue);
      }, 400);
  };

  /* =========================================================
     CLEAR SEARCH
  ========================================================= */

  const clearSearch = () => {
    if (searchTimerRef.current) {
      clearTimeout(
        searchTimerRef.current,
      );

      searchTimerRef.current = null;
    }

    searchRequestIdRef.current += 1;

    setKeyword("");

    setSearching(false);

    setPage(1);

    loadUsers(1);
  };

  /* =========================================================
     SHOW FORM
  ========================================================= */

  const showForm = (
    user?: User,
  ) => {
    if (user) {
      setEditing(user);

      setForm({
        taiKhoan:
          user.taiKhoan || "",

        matKhau: "",

        hoTen:
          user.hoTen || "",

        email:
          user.email || "",

        soDt:
          user.soDt ||
          user.soDT ||
          "",

        maLoaiNguoiDung:
          user.maLoaiNguoiDung ||
          "HV",

        maNhom:
          user.maNhom ||
          "GP01",
      });
    } else {
      setEditing(null);

      resetForm();
    }

    setOpen(true);
  };

  /* =========================================================
     CLOSE FORM
  ========================================================= */

  const closeForm = () => {
    if (saving) {
      return;
    }

    setOpen(false);

    setEditing(null);

    resetForm();
  };

  /* =========================================================
     OPEN ENROLLMENT MODAL
  ========================================================= */

  const openEnrollModal = (
    taiKhoan: string,
  ) => {
    setSelectedUserForEnroll(
      taiKhoan,
    );

    setEnrollModalOpen(true);
  };

  const closeEnrollModal = () => {
    setEnrollModalOpen(false);

    setSelectedUserForEnroll(null);
  };

  /* =========================================================
     SUBMIT USER
  ========================================================= */

  const submit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    /* ==============================
       VALIDATE
    ============================== */

    if (!form.taiKhoan.trim()) {
      showNotification(
        "warning",
        "Thiếu thông tin",
        "Vui lòng nhập tài khoản.",
      );

      return;
    }

    if (
      !editing &&
      !form.matKhau.trim()
    ) {
      showNotification(
        "warning",
        "Thiếu mật khẩu",
        "Vui lòng nhập mật khẩu cho tài khoản mới.",
      );

      return;
    }

    if (!form.hoTen.trim()) {
      showNotification(
        "warning",
        "Thiếu thông tin",
        "Vui lòng nhập họ tên.",
      );

      return;
    }

    if (!form.email.trim()) {
      showNotification(
        "warning",
        "Thiếu thông tin",
        "Vui lòng nhập email.",
      );

      return;
    }

    if (!form.maNhom.trim()) {
      showNotification(
        "warning",
        "Thiếu mã nhóm",
        "Vui lòng nhập mã nhóm.",
      );

      return;
    }

    try {
      setSaving(true);

      const payload: Record<
        string,
        unknown
      > = {
        taiKhoan:
          form.taiKhoan.trim(),

        hoTen:
          form.hoTen.trim(),

        soDT:
          form.soDt.trim(),

        maLoaiNguoiDung:
          form.maLoaiNguoiDung.trim(),

        maNhom:
          form.maNhom
            .trim()
            .toUpperCase(),

        email:
          form.email.trim(),
      };

      /*
       * THÊM USER:
       * bắt buộc có mật khẩu.
       *
       * EDIT USER:
       * nếu nhập mật khẩu thì đổi mật khẩu.
       * nếu để trống thì giữ mật khẩu cũ.
       */

      if (
        !editing ||
        form.matKhau.trim()
      ) {
        payload.matKhau =
          form.matKhau.trim();
      }

      console.log(
        editing
          ? "UPDATE USER PAYLOAD:"
          : "ADD USER PAYLOAD:",
        payload,
      );

      /* ==============================
         UPDATE
      ============================== */

      if (editing) {
        await userApi.updateUser(
          payload,
        );

        showNotification(
          "success",
          "Cập nhật thành công",
          form.matKhau.trim()
            ? "Thông tin người dùng và mật khẩu đã được cập nhật."
            : "Thông tin người dùng đã được cập nhật.",
        );
      } else {
        /* ==============================
           ADD
        ============================== */

        await userApi.addUser(
          payload,
        );

        showNotification(
          "success",
          "Thêm người dùng thành công",
          `Tài khoản "${form.taiKhoan}" đã được tạo.`,
        );
      }

      /* ==============================
         CLOSE FORM
      ============================== */

      setOpen(false);

      setEditing(null);

      resetForm();

      /* ==============================
         RESET SEARCH
      ============================== */

      setKeyword("");

      searchRequestIdRef.current += 1;

      setPage(1);

      /* ==============================
         LOAD AGAIN
      ============================== */

      await loadUsers(1);
    } catch (error: any) {
      console.error(
        "LỖI LƯU USER:",
        error,
      );

      const message =
        getErrorMessage(
          error,
          "Có lỗi xảy ra khi lưu người dùng.",
        );

      if (
        message
          .toLowerCase()
          .includes(
            "nhóm người dùng",
          )
      ) {
        showNotification(
          "error",
          "Mã nhóm không hợp lệ",
          `${message} Mã nhóm hiện tại: ${form.maNhom}.`,
          6000,
        );
      } else {
        showNotification(
          "error",
          "Không thể lưu người dùng",
          message,
          6000,
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE USER
  ========================================================= */

  const remove = (
    user: User,
  ) => {
    if (deleting) {
      return;
    }

    showConfirm(
      "Xóa người dùng?",
      `Bạn có chắc muốn xóa tài khoản "${user.taiKhoan}"? Hành động này không thể hoàn tác.`,
      async () => {
        try {
          setDeleting(
            user.taiKhoan,
          );

          await userApi.deleteUser(
            user.taiKhoan,
          );

          showNotification(
            "success",
            "Xóa thành công",
            `Tài khoản "${user.taiKhoan}" đã được xóa khỏi hệ thống.`,
          );

          if (
            users.length === 1 &&
            page > 1
          ) {
            setPage(
              (prev) =>
                prev - 1,
            );
          } else {
            await loadUsers(page);
          }
        } catch (error: any) {
          console.error(
            "Lỗi xóa user:",
            error,
          );

          showNotification(
            "error",
            "Không thể xóa người dùng",
            getErrorMessage(
              error,
              "Đã xảy ra lỗi khi xóa người dùng.",
            ),
            6000,
          );
        } finally {
          setDeleting(null);
        }
      },
      "Xóa người dùng",
    );
  };

  /* =========================================================
     PAGINATION
  ========================================================= */

  const goToPreviousPage =
    () => {
      if (
        page <= 1 ||
        loading ||
        keyword.trim()
      ) {
        return;
      }

      setPage(
        (prev) =>
          Math.max(
            1,
            prev - 1,
          ),
      );
    };

  const goToNextPage = () => {
    if (
      page >= totalPages ||
      loading ||
      keyword.trim()
    ) {
      return;
    }

    setPage(
      (prev) =>
        Math.min(
          totalPages,
          prev + 1,
        ),
    );
  };

  /* =========================================================
     NOTIFICATION ICON
  ========================================================= */

  const NotificationIcon =
    () => {
      if (!notification) {
        return null;
      }

      if (
        notification.type ===
        "success"
      ) {
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
        );
      }

      if (
        notification.type ===
        "error"
      ) {
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
        );
      }

      if (
        notification.type ===
        "warning"
      ) {
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
        );
      }

      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
      );
    };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div>
      {/* =====================================================
          TOAST
      ===================================================== */}

      {notification && (
        <div className="pointer-events-none fixed right-5 top-5 z-[100] w-[calc(100%-40px)] max-w-md">
          <div
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] ${
              notification.type ===
              "success"
                ? "border-emerald-100"
                : notification.type ===
                    "error"
                  ? "border-red-100"
                  : notification.type ===
                      "warning"
                    ? "border-amber-100"
                    : "border-blue-100"
            }`}
          >
            <div className="flex items-start gap-3">
              <NotificationIcon />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-[#123b3a]">
                  {notification.title}
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {notification.message}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeNotification
                }
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              className={`absolute bottom-0 left-0 h-1 w-full ${
                notification.type ===
                "success"
                  ? "bg-emerald-500"
                  : notification.type ===
                      "error"
                    ? "bg-red-500"
                    : notification.type ===
                        "warning"
                      ? "bg-amber-500"
                      : "bg-blue-500"
              }`}
            />
          </div>
        </div>
      )}

      {/* =====================================================
          CONFIRM DELETE
      ===================================================== */}

      {confirmModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black text-[#123b3a]">
                    {
                      confirmModal.title
                    }
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {
                      confirmModal.message
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeConfirm
                  }
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 bg-slate-50/70 p-4">
              <button
                type="button"
                onClick={
                  closeConfirm
                }
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={
                  handleConfirm
                }
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 active:scale-[0.98]"
              >
                {
                  confirmModal.confirmText ||
                  "Xác nhận"
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#237c73]">
            Accounts
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#123b3a]">
            Quản lý người dùng
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Phân quyền, cập nhật tài khoản
            và quản lý ghi danh khóa học.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            showForm()
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123b3a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1c5754] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Thêm người dùng
        </button>
      </header>

      {/* =====================================================
          TABLE CARD
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(30,65,64,0.05)]">
        {/* SEARCH */}

        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-[#123b3a]">
            <Users className="mr-2 inline h-4 w-4" />
            Danh sách tài khoản
          </p>

          <div className="relative flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition focus-within:border-[#237c73] focus-within:ring-2 focus-within:ring-[#237c73]/10 sm:w-96">
            {searching ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#237c73]" />
            ) : (
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
            )}

            <input
              value={keyword}
              onChange={(e) =>
                handleSearch(
                  e.target.value,
                )
              }
              placeholder="Tìm tài khoản, họ tên, email..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />

            {keyword && (
              <button
                type="button"
                onClick={
                  clearSearch
                }
                className="shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#f7faf9] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">
                  Tài khoản
                </th>

                <th className="px-5 py-4">
                  Họ tên
                </th>

                <th className="px-5 py-4">
                  Email
                </th>

                <th className="px-5 py-4">
                  Số điện thoại
                </th>

                <th className="px-5 py-4">
                  Vai trò
                </th>

                <th className="px-5 py-4 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-14 text-center"
                  >
                    <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#237c73]" />

                    <p className="mt-3 text-sm text-slate-500">
                      Đang tải danh sách...
                    </p>
                  </td>
                </tr>
              ) : users.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-14 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <Users className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      {keyword
                        ? `Không tìm thấy người dùng "${keyword}"`
                        : "Chưa có người dùng."}
                    </p>

                    {keyword && (
                      <button
                        type="button"
                        onClick={
                          clearSearch
                        }
                        className="mt-3 text-xs font-bold text-[#237c73] hover:underline"
                      >
                        Xóa tìm kiếm
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                users.map(
                  (user) => (
                    <tr
                      key={
                        user.taiKhoan
                      }
                      className="transition hover:bg-[#fbfdfc]"
                    >
                      <td className="px-5 py-4">
                        <span className="font-semibold text-[#123b3a]">
                          {
                            user.taiKhoan
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {user.hoTen}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {user.email}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {user.soDt ||
                          user.soDT ||
                          "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-[#e6f4f1] px-2.5 py-1 text-xs font-bold text-[#237c73]">
                          {user.maLoaiNguoiDung ||
                            "HV"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {/* GHI DANH */}

                          <button
                            type="button"
                            title="Quản lý ghi danh"
                            onClick={() =>
                              openEnrollModal(
                                user.taiKhoan,
                              )
                            }
                            disabled={
                              !!deleting
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600 disabled:opacity-40"
                          >
                            <BookOpen className="h-4 w-4" />
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            title="Sửa người dùng"
                            onClick={() =>
                              showForm(
                                user,
                              )
                            }
                            disabled={
                              !!deleting
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-[#e6f4f1] hover:text-[#237c73] disabled:opacity-40"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            title="Xóa người dùng"
                            onClick={() =>
                              remove(
                                user,
                              )
                            }
                            disabled={
                              deleting ===
                              user.taiKhoan
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                          >
                            {deleting ===
                            user.taiKhoan ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        {!keyword.trim() && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm">
            <span className="text-slate-500">
              Trang{" "}
              <span className="font-bold text-[#123b3a]">
                {page}
              </span>{" "}
              / {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  page === 1 ||
                  loading
                }
                onClick={
                  goToPreviousPage
                }
                className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước
              </button>

              <button
                type="button"
                disabled={
                  page >=
                    totalPages ||
                  loading
                }
                onClick={
                  goToNextPage
                }
                className="rounded-lg bg-[#123b3a] px-3 py-2 font-semibold text-white transition hover:bg-[#1c5754] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================
          USER FORM MODAL
      ===================================================== */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <form
            onSubmit={submit}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            {/* HEADER */}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#123b3a]">
                  {editing
                    ? "Cập nhật người dùng"
                    : "Thêm người dùng"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editing
                    ? "Để trống mật khẩu nếu muốn giữ nguyên mật khẩu cũ."
                    : "Nhập đầy đủ thông tin tài khoản."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM FIELDS */}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* ACCOUNT */}

              <label className="text-sm font-semibold text-slate-600">
                Tài khoản

                <input
                  required
                  type="text"
                  disabled={!!editing}
                  value={
                    form.taiKhoan
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        taiKhoan:
                          e.target
                            .value,
                      }),
                    )
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-[#237c73] focus:ring-2 focus:ring-[#237c73]/10 disabled:bg-slate-100"
                  placeholder="Nhập tài khoản"
                />
              </label>

              {/* PASSWORD */}

              <label className="text-sm font-semibold text-slate-600">
                Mật khẩu

                {!editing && (
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                )}

                <input
                  required={!editing}
                  type="password"
                  value={
                    form.matKhau
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        matKhau:
                          e.target
                            .value,
                      }),
                    )
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-[#237c73] focus:ring-2 focus:ring-[#237c73]/10"
                  placeholder={
                    editing
                      ? "Để trống = giữ mật khẩu cũ"
                      : "Nhập mật khẩu"
                  }
                />

                {editing && (
                  <span className="mt-1 block text-[11px] font-normal text-slate-400">
                    Nhập mật khẩu mới
                    nếu muốn đổi.
                  </span>
                )}
              </label>

              {/* NAME */}

              <label className="text-sm font-semibold text-slate-600">
                Họ tên

                <input
                  required
                  type="text"
                  value={
                    form.hoTen
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        hoTen:
                          e.target
                            .value,
                      }),
                    )
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-[#237c73] focus:ring-2 focus:ring-[#237c73]/10"
                  placeholder="Nguyễn Văn A"
                />
              </label>

              {/* EMAIL */}

              <label className="text-sm font-semibold text-slate-600">
                Email

                <input
                  required
                  type="email"
                  value={
                    form.email
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        email:
                          e.target
                            .value,
                      }),
                    )
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-[#237c73] focus:ring-2 focus:ring-[#237c73]/10"
                  placeholder="email@gmail.com"
                />
              </label>

              {/* PHONE */}

              <label className="text-sm font-semibold text-slate-600">
                Số điện thoại

                <input
                  type="text"
                  value={
                    form.soDt
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        soDt:
                          e.target
                            .value,
                      }),
                    )
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-[#237c73] focus:ring-2 focus:ring-[#237c73]/10"
                  placeholder="0901234567"
                />
              </label>

              {/* GROUP */}

              <label className="text-sm font-semibold text-slate-600">
                Mã nhóm

                <input
                  required
                  type="text"
                  value={
                    form.maNhom
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        maNhom:
                          e.target.value.toUpperCase(),
                      }),
                    )
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 uppercase outline-none transition focus:border-[#237c73] focus:ring-2 focus:ring-[#237c73]/10"
                  placeholder="GP01"
                />

                <span className="mt-1 block text-[11px] font-normal text-slate-400">
                  Ví dụ: GP01
                </span>
              </label>

              {/* ROLE */}

              <label className="text-sm font-semibold text-slate-600 sm:col-span-2">
                Vai trò

                <select
                  value={
                    form.maLoaiNguoiDung
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        maLoaiNguoiDung:
                          e.target
                            .value,
                      }),
                    )
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-[#237c73] focus:ring-2 focus:ring-[#237c73]/10"
                >
                  {types.length >
                  0 ? (
                    types.map(
                      (type) => (
                        <option
                          key={
                            type.maLoaiNguoiDung
                          }
                          value={
                            type.maLoaiNguoiDung
                          }
                        >
                          {
                            type.tenLoaiNguoiDung
                          }
                        </option>
                      ),
                    )
                  ) : (
                    <>
                      <option value="HV">
                        Học viên
                      </option>

                      <option value="GV">
                        Giáo vụ
                      </option>
                    </>
                  )}
                </select>
              </label>
            </div>

            {/* BUTTON */}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={
                  closeForm
                }
                disabled={saving}
                className="w-1/2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex w-1/2 items-center justify-center gap-2 rounded-xl bg-[#123b3a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1c5754] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {saving
                  ? "Đang lưu..."
                  : editing
                    ? "Cập nhật"
                    : "Thêm người dùng"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          ENROLLMENT MODAL
      ===================================================== */}

      <UserEnrollmentModal
        isOpen={enrollModalOpen}
        onClose={
          closeEnrollModal
        }
        taiKhoan={
          selectedUserForEnroll
        }
      />
    </div>
  );
}
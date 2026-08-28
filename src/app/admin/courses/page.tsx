"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getImageUrl } from "@/lib/image";
import {
  Edit3,
  ImagePlus,
  Plus,
  Search,
  Trash2,
  Users,
  X,
  Loader2,
  RotateCcw,
} from "lucide-react";

import { courseApi } from "@/services/courseApi";
import { categoryApi } from "@/services/categoryApi";
import CourseEnrollmentModal from "@/components/admin/CourseEnrollmentModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/common/ToastProvider";

type Course = {
  maKhoaHoc: string;
  biDanh?: string;
  tenKhoaHoc: string;
  moTa?: string;
  luotXem?: number;
  danhGia?: number;
  hinhAnh?: string;
  maNhom?: string;
  ngayTao?: string;
  maDanhMucKhoaHoc?: string;
  taiKhoanNguoiTao?: string;

  nguoiTao?:
    | {
        taiKhoan?: string;
        hoTen?: string;
      }
    | string;
};

type Category = {
  maDanhMuc: string;
  tenDanhMuc: string;
};

/* =========================================================
   FORM
========================================================= */

type CourseForm = {
  maKhoaHoc: string;
  biDanh: string;
  tenKhoaHoc: string;
  moTa: string;
  luotXem: number;
  danhGia: number;
  hinhAnh: string;
  maNhom: string;
  ngayTao: string;
  maDanhMucKhoaHoc: string;
  taiKhoanNguoiTao: string;
};

/* =========================================================
   LẤY DANH SÁCH KHÓA HỌC
========================================================= */

const getCourseList = (value: unknown): Course[] => {
  if (Array.isArray(value)) {
    return value as Course[];
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const data = value as {
    content?: unknown;
    items?: unknown;
    data?: unknown;
  };

  if (Array.isArray(data.content)) {
    return data.content as Course[];
  }

  if (Array.isArray(data.items)) {
    return data.items as Course[];
  }

  if (Array.isArray(data.data)) {
    return data.data as Course[];
  }

  return [];
};

/* =========================================================
   LẤY MESSAGE ERROR
========================================================= */

const getErrorMessage = (error: any): string => {
  const responseData = error?.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  return (
    responseData?.message ||
    responseData?.content ||
    responseData?.error ||
    error?.message ||
    "Có lỗi xảy ra. Vui lòng thử lại."
  ).toString();
};

/* =========================================================
   FORM MẶC ĐỊNH
========================================================= */

const emptyForm: CourseForm = {
  maKhoaHoc: "",
  biDanh: "",
  tenKhoaHoc: "",
  moTa: "",
  luotXem: 0,
  danhGia: 0,
  hinhAnh: "",
  maNhom: "GP01",
  ngayTao: "",
  maDanhMucKhoaHoc: "",
  taiKhoanNguoiTao: "",
};

/* =========================================================
   COMPONENT
========================================================= */

export default function AdminCoursesPage() {
  const toast = useToast();

  /* =========================================================
     DATA
  ========================================================= */

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  /* =========================================================
     SEARCH
  ========================================================= */

  const [keyword, setKeyword] = useState("");

  /* =========================================================
     PAGINATION
  ========================================================= */

  const [page, setPage] = useState(1);

  const pageSize = 8;

  /* =========================================================
     FORM
  ========================================================= */

  const [editing, setEditing] = useState<Course | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<CourseForm>(emptyForm);

  /* =========================================================
     ENROLLMENT
  ========================================================= */

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<{
    maKhoaHoc: string;
    tenKhoaHoc: string;
  } | null>(null);

  /* =========================================================
     DELETE
  ========================================================= */

  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  /* =========================================================
     LẤY TÀI KHOẢN ADMIN
  ========================================================= */

  const getCurrentAccount = () => {
    if (typeof window === "undefined") {
      return "";
    }

    try {
      const userInfo = localStorage.getItem("USER_INFO");

      if (!userInfo) {
        return "";
      }

      const user = JSON.parse(userInfo);

      return (
        user?.taiKhoan ||
        user?.username ||
        user?.userName ||
        user?.taiKhoanNguoiTao ||
        ""
      );
    } catch (error) {
      console.error("USER_INFO error:", error);
      return "";
    }
  };

  /* =========================================================
     LOAD
  ========================================================= */

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const [courseResult, categoryResult] = await Promise.all([
        courseApi.getCourses(),
        categoryApi.getCategories(),
      ]);

      /* =========================
         COURSES
      ========================= */

      const courseData = getCourseList(courseResult.data);

      setCourses(courseData);

      /* =========================
         CATEGORIES
      ========================= */

      const categoryResponse = categoryResult.data;

      let categoryData: Category[] = [];

      if (Array.isArray(categoryResponse)) {
        categoryData = categoryResponse as Category[];
      } else if (categoryResponse && typeof categoryResponse === "object") {
        const response = categoryResponse as {
          content?: unknown;
          items?: unknown;
          data?: unknown;
        };

        if (Array.isArray(response.content)) {
          categoryData = response.content as Category[];
        } else if (Array.isArray(response.items)) {
          categoryData = response.items as Category[];
        } else if (Array.isArray(response.data)) {
          categoryData = response.data as Category[];
        }
      }

      setCategories(categoryData);
    } catch (error) {
      console.error("Load courses error:", error);

      toast.error(
        `Không thể tải danh sách khóa học: ${getErrorMessage(error)}`,
      );
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  /* =========================================================
     CATEGORY NAME
  ========================================================= */

  const getCategoryName = useCallback(
    (maDanhMuc?: string) => {
      if (!maDanhMuc) {
        return "Chưa phân loại";
      }

      return (
        categories.find((item) => item.maDanhMuc === maDanhMuc)?.tenDanhMuc ||
        maDanhMuc
      );
    },
    [categories],
  );

  /* =========================================================
     SEARCH TOÀN BỘ
  ========================================================= */

  const filteredCourses = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    if (!search) {
      return courses;
    }

    return courses.filter((course) => {
      const categoryName = getCategoryName(course.maDanhMucKhoaHoc);

      let creator = "";

      if (typeof course.nguoiTao === "string") {
        creator = course.nguoiTao;
      } else {
        creator = course.nguoiTao?.taiKhoan || course.nguoiTao?.hoTen || "";
      }

      const searchableText = [
        course.maKhoaHoc,
        course.tenKhoaHoc,
        course.biDanh,
        course.moTa,
        course.maDanhMucKhoaHoc,
        categoryName,
        course.maNhom,
        creator,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    });
  }, [courses, keyword, getCategoryName]);

  /* =========================================================
     TOTAL PAGES
  ========================================================= */

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));

  /* =========================================================
     PAGE HỢP LỆ
  ========================================================= */

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  /* =========================================================
     DATA HIỂN THỊ
  ========================================================= */

  const visibleCourses = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, page]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  const clearSearch = () => {
    setKeyword("");
    setPage(1);
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setEditing(null);

    setForm({
      ...emptyForm,
      taiKhoanNguoiTao: getCurrentAccount(),
    });
  };

  /* =========================================================
     OPEN ADD / EDIT
  ========================================================= */

  const openForm = (course?: Course) => {
    if (course) {
      setEditing(course);

      const creator =
        course.taiKhoanNguoiTao ||
        (typeof course.nguoiTao === "string"
          ? course.nguoiTao
          : course.nguoiTao?.taiKhoan) ||
        "";

      setForm({
        maKhoaHoc: course.maKhoaHoc || "",
        biDanh: course.biDanh || "",
        tenKhoaHoc: course.tenKhoaHoc || "",
        moTa: course.moTa || "",
        luotXem: course.luotXem ?? 0,
        danhGia: course.danhGia ?? 0,
        hinhAnh: course.hinhAnh || "",
        maNhom: course.maNhom || "GP01",
        ngayTao: course.ngayTao || "",
        maDanhMucKhoaHoc: course.maDanhMucKhoaHoc || "",
        taiKhoanNguoiTao: creator,
      });
    } else {
      const taiKhoanNguoiTao = getCurrentAccount();

      setEditing(null);

      setForm({
        maKhoaHoc: "",
        biDanh: "",
        tenKhoaHoc: "",
        moTa: "",
        luotXem: 0,
        danhGia: 0,
        hinhAnh: "",
        maNhom: "GP01",
        ngayTao: "",
        maDanhMucKhoaHoc: "",
        taiKhoanNguoiTao,
      });
    }

    setModalOpen(true);
  };

  /* =========================================================
     CLOSE FORM
  ========================================================= */

  const closeForm = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);

    resetForm();
  };

  /* =========================================================
     UPDATE FIELD
  ========================================================= */

  const updateField = (field: keyof CourseForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================================
     SUBMIT ADD / UPDATE
  ========================================================= */

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    /* =========================
     VALIDATE
  ========================= */

    if (!form.maKhoaHoc.trim()) {
      toast.error("Vui lòng nhập mã khóa học.");
      return;
    }

    if (!form.tenKhoaHoc.trim()) {
      toast.error("Vui lòng nhập tên khóa học.");
      return;
    }

    if (!form.biDanh.trim()) {
      toast.error("Vui lòng nhập bí danh.");
      return;
    }

    if (!form.maDanhMucKhoaHoc) {
      toast.error("Vui lòng chọn danh mục.");
      return;
    }

    const currentAccount = getCurrentAccount();

    if (!currentAccount && !editing) {
      toast.error("Không tìm thấy tài khoản người tạo.");
      return;
    }

    setSaving(true);

    try {
      /*
       * Nếu edit:
       * giữ lại taiKhoanNguoiTao của khóa học cũ.
       *
       * Nếu thêm:
       * lấy tài khoản đang đăng nhập.
       */
      const taiKhoanNguoiTao =
        editing?.taiKhoanNguoiTao ||
        (typeof editing?.nguoiTao === "string"
          ? editing.nguoiTao
          : editing?.nguoiTao?.taiKhoan) ||
        form.taiKhoanNguoiTao ||
        currentAccount;

      /*
       * API yêu cầu ngayTao.
       *
       * Khi edit -> giữ ngày tạo cũ.
       * Khi add -> tạo ngày hiện tại.
       */
      const ngayTao = editing?.ngayTao || new Date().toISOString();

      /*
       * PAYLOAD ĐÚNG THEO SCHEMA API
       */
      const payload = {
        maKhoaHoc: form.maKhoaHoc.trim(),

        biDanh: form.biDanh.trim(),

        tenKhoaHoc: form.tenKhoaHoc.trim(),

        moTa: form.moTa.trim(),

        luotXem: Number(form.luotXem) || 0,

        danhGia: Number(form.danhGia) || 0,

        hinhAnh: form.hinhAnh.trim(),

        maNhom: form.maNhom.trim() || "GP01",

        ngayTao,

        maDanhMucKhoaHoc: form.maDanhMucKhoaHoc,

        taiKhoanNguoiTao: taiKhoanNguoiTao,
      };

      console.log(
        editing
          ? "========== UPDATE COURSE =========="
          : "========== ADD COURSE ==========",
      );

      console.log("PAYLOAD:", JSON.stringify(payload, null, 2));

      /* =========================
       UPDATE
    ========================= */

      if (editing) {
        await courseApi.updateCourse(payload);

        toast.success(`Cập nhật khóa học "${form.tenKhoaHoc}" thành công!`);
      } else {
        /* =========================
       ADD
    ========================= */
        await courseApi.addCourse(payload);

        toast.success(`Thêm khóa học "${form.tenKhoaHoc}" thành công!`);
      }

      /* =========================
       CLOSE
    ========================= */

      setModalOpen(false);

      setEditing(null);

      setForm({
        ...emptyForm,
        taiKhoanNguoiTao: currentAccount,
      });

      /* =========================
       RELOAD
    ========================= */

      await load();

      /* =========================
       VỀ TRANG 1
    ========================= */

      setPage(1);
    } catch (error: any) {
      console.error(
        editing ? "UPDATE COURSE ERROR:" : "ADD COURSE ERROR:",
        error,
      );

      console.error("API RESPONSE:", error?.response?.data);

      toast.error(
        editing
          ? `Không thể cập nhật khóa học: ${getErrorMessage(error)}`
          : `Không thể thêm khóa học: ${getErrorMessage(error)}`,
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     ENROLLMENT
  ========================================================= */

  const openEnrollModal = (course: Course) => {
    setSelectedCourseForEnroll({
      maKhoaHoc: course.maKhoaHoc,
      tenKhoaHoc: course.tenKhoaHoc,
    });

    setEnrollModalOpen(true);
  };

  /* =========================================================
     DELETE MODAL
  ========================================================= */

  const openDeleteModal = (course: Course) => {
    if (isDeleting) {
      return;
    }

    setCourseToDelete(course);
  };

  const closeDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setCourseToDelete(null);
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const remove = async () => {
    if (!courseToDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await courseApi.deleteCourse(courseToDelete.maKhoaHoc);

      toast.success(`Đã xóa khóa học "${courseToDelete.tenKhoaHoc}"!`);

      setCourseToDelete(null);

      await load();

      /* Sau khi load, page sẽ tự điều chỉnh */

      setPage((currentPage) => {
        const newTotalPages = Math.max(
          1,
          Math.ceil(Math.max(0, filteredCourses.length - 1) / pageSize),
        );

        return Math.min(currentPage, newTotalPages);
      });
    } catch (error) {
      console.error("Delete course error:", error);

      toast.error(`Không thể xóa khóa học: ${getErrorMessage(error)}`);
    } finally {
      setIsDeleting(false);
    }
  };

  /* =========================================================
     REFRESH
  ========================================================= */

  const handleRefresh = async () => {
    await load();

    toast.success("Đã cập nhật danh sách khóa học.");
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#237c73]">
            Nội dung
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#123b3a]">
            Quản lý khóa học
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Tạo, cập nhật và tổ chức các khóa học trên hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openForm()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123b3a] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1c5855]"
        >
          <Plus className="h-4 w-4" />
          Thêm khóa học
        </button>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(30,65,64,0.05)]">
        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="border-b border-slate-100 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-[#123b3a]">
                Danh sách khóa học
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {keyword.trim()
                  ? `Tìm thấy ${filteredCourses.length} khóa học phù hợp`
                  : `Tổng cộng ${courses.length} khóa học`}
              </p>
            </div>

            <div className="flex w-full gap-2 lg:w-auto">
              {/* SEARCH INPUT */}

              <label className="relative flex w-full items-center lg:w-[420px]">
                <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />

                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Tìm mã, tên, bí danh, danh mục..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-[#f8faf9] pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#58a99e] focus:bg-white focus:ring-2 focus:ring-[#58a99e]/10"
                />

                {keyword && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                    title="Xóa tìm kiếm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>

              {/* REFRESH */}

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                title="Làm mới"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-[#123b3a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {keyword.trim() && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-[#e6f4f1] px-3 py-1.5 text-xs font-semibold text-[#237c73]">
                Từ khóa: "{keyword}"
              </span>

              <button
                type="button"
                onClick={clearSearch}
                className="text-xs font-semibold text-slate-400 transition hover:text-red-500"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#f7faf9] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">Khóa học</th>

                <th className="px-5 py-4">Mã khóa</th>

                <th className="px-5 py-4">Danh mục</th>

                <th className="px-5 py-4">Nhóm</th>

                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* LOADING */}

              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="mb-3 h-7 w-7 animate-spin text-[#237c73]" />

                      <p className="text-sm font-medium text-slate-500">
                        Đang tải danh sách khóa học...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : visibleCourses.length === 0 ? (
                /* EMPTY */

                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="mb-3 h-9 w-9 text-slate-200" />

                      <p className="font-semibold text-slate-500">
                        Không tìm thấy khóa học
                      </p>

                      {keyword && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="mt-2 text-sm font-semibold text-[#237c73] hover:underline"
                        >
                          Xóa từ khóa tìm kiếm
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                /* DATA */

                visibleCourses.map((course) => (
                  <tr
                    key={course.maKhoaHoc}
                    className="group transition hover:bg-[#fbfdfc]"
                  >
                    {/* COURSE */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e6f4f1] text-[#237c73]">
                          {course.hinhAnh ? (
                            <img
                              src={getImageUrl(course.hinhAnh)}
                              alt={course.tenKhoaHoc || "Khóa học"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImagePlus className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[350px] truncate font-bold text-slate-800">
                            {course.tenKhoaHoc}
                          </p>

                          <p className="mt-1 max-w-[350px] truncate text-xs text-slate-400">
                            {course.moTa || "Chưa có mô tả"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CODE */}

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-600">
                        {course.maKhoaHoc}
                      </span>
                    </td>

                    {/* CATEGORY */}

                    <td className="px-5 py-4 text-slate-600">
                      {getCategoryName(course.maDanhMucKhoaHoc)}
                    </td>

                    {/* GROUP */}

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-[#e6f4f1] px-2 py-1 text-xs font-bold text-[#237c73]">
                        {course.maNhom || "GP01"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1.5">
                        {/* USERS */}

                        <button
                          type="button"
                          title="Quản lý học viên"
                          onClick={() => openEnrollModal(course)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Users className="h-4 w-4" />
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          title="Sửa khóa học"
                          onClick={() => openForm(course)}
                          disabled={saving}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-[#e6f4f1] hover:text-[#237c73] disabled:opacity-40"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          title="Xóa khóa học"
                          onClick={() => openDeleteModal(course)}
                          disabled={isDeleting}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ===================================================
            PAGINATION
        =================================================== */}

        {!loading && filteredCourses.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              Hiển thị{" "}
              <span className="font-bold text-slate-700">
                {(page - 1) * pageSize + 1}
              </span>{" "}
              -{" "}
              <span className="font-bold text-slate-700">
                {Math.min(page * pageSize, filteredCourses.length)}
              </span>{" "}
              /{" "}
              <span className="font-bold text-slate-700">
                {filteredCourses.length}
              </span>{" "}
              khóa học
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước
              </button>

              <div className="rounded-lg bg-[#123b3a] px-3 py-2 text-sm font-bold text-white">
                {page} / {totalPages}
              </div>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg bg-[#123b3a] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1c5855] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
          <form
            onSubmit={submit}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            {/* HEADER */}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#123b3a]">
                  {editing ? "Cập nhật khóa học" : "Thêm khóa học"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {editing
                    ? "Chỉnh sửa thông tin khóa học."
                    : "Điền thông tin khóa học mới."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* CODE */}

              <label className="text-sm font-semibold text-slate-600">
                Mã khóa học
                <input
                  required
                  disabled={!!editing || saving}
                  value={form.maKhoaHoc}
                  onChange={(e) => updateField("maKhoaHoc", e.target.value)}
                  placeholder="VD: KH001"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-[#58a99e] focus:ring-2 focus:ring-[#58a99e]/10 disabled:bg-slate-100"
                />
              </label>

              {/* NAME */}

              <label className="text-sm font-semibold text-slate-600">
                Tên khóa học
                <input
                  required
                  disabled={saving}
                  value={form.tenKhoaHoc}
                  onChange={(e) => updateField("tenKhoaHoc", e.target.value)}
                  placeholder="VD: Lập trình ReactJS"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-[#58a99e] focus:ring-2 focus:ring-[#58a99e]/10 disabled:bg-slate-100"
                />
              </label>

              {/* ALIAS */}

              <label className="text-sm font-semibold text-slate-600">
                Bí danh
                <input
                  required
                  disabled={saving}
                  value={form.biDanh}
                  onChange={(e) => updateField("biDanh", e.target.value)}
                  placeholder="VD: lap-trinh-reactjs"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-[#58a99e] focus:ring-2 focus:ring-[#58a99e]/10 disabled:bg-slate-100"
                />
              </label>

              {/* CATEGORY */}

              <label className="text-sm font-semibold text-slate-600">
                Danh mục
                <select
                  required
                  disabled={saving}
                  value={form.maDanhMucKhoaHoc}
                  onChange={(e) =>
                    updateField("maDanhMucKhoaHoc", e.target.value)
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-[#58a99e] focus:ring-2 focus:ring-[#58a99e]/10 disabled:bg-slate-100"
                >
                  <option value="">Chọn danh mục</option>

                  {categories.map((category) => (
                    <option key={category.maDanhMuc} value={category.maDanhMuc}>
                      {category.tenDanhMuc}
                    </option>
                  ))}
                </select>
              </label>

              {/* IMAGE */}

              <label className="text-sm font-semibold text-slate-600 sm:col-span-2">
                Hình ảnh URL
                <input
                  type="url"
                  disabled={saving}
                  value={form.hinhAnh}
                  onChange={(e) => updateField("hinhAnh", e.target.value)}
                  placeholder="https://..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-[#58a99e] focus:ring-2 focus:ring-[#58a99e]/10 disabled:bg-slate-100"
                />
              </label>

              {/* DESCRIPTION */}

              <label className="text-sm font-semibold text-slate-600 sm:col-span-2">
                Mô tả
                <textarea
                  rows={4}
                  disabled={saving}
                  value={form.moTa}
                  onChange={(e) => updateField("moTa", e.target.value)}
                  placeholder="Nhập mô tả khóa học..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-[#58a99e] focus:ring-2 focus:ring-[#58a99e]/10 disabled:bg-slate-100"
                />
              </label>
            </div>

            {/* BUTTON */}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="w-1/3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#123b3a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1c5855] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    {editing ? "Đang cập nhật..." : "Đang thêm..."}
                  </>
                ) : editing ? (
                  "Cập nhật khóa học"
                ) : (
                  "Thêm khóa học"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRM
      ===================================================== */}

      <ConfirmModal
        isOpen={!!courseToDelete}
        onClose={closeDeleteModal}
        onConfirm={remove}
        title="Xóa khóa học?"
        description={
          courseToDelete
            ? `Bạn có chắc muốn xóa khóa học "${courseToDelete.tenKhoaHoc}" (${courseToDelete.maKhoaHoc})? Hành động này không thể hoàn tác.`
            : ""
        }
        isLoading={isDeleting}
      />

      {/* =====================================================
          ENROLLMENT
      ===================================================== */}

      <CourseEnrollmentModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        maKhoaHoc={selectedCourseForEnroll?.maKhoaHoc || null}
        tenKhoaHoc={selectedCourseForEnroll?.tenKhoaHoc}
      />
    </div>
  );
}

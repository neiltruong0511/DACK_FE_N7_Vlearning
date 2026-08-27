"use client";

import { FormEvent, useEffect, useState } from "react";
// THÊM: Import Users
import { Edit3, ImagePlus, Plus, Search, Trash2, Users } from "lucide-react";
import { courseApi } from "@/services/courseApi";
import { categoryApi } from "@/services/categoryApi";
import CourseEnrollmentModal from "@/components/admin/CourseEnrollmentModal";

type Course = {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  biDanh?: string;
  moTa?: string;
  hinhAnh?: string;
  maDanhMucKhoaHoc?: string;
  maNhom?: string;
};

type Category = { maDanhMuc: string; tenDanhMuc: string };

const getList = (value: unknown): Course[] => {
  if (Array.isArray(value)) return value as Course[];
  return ((value as { items?: Course[] })?.items || []) as Course[];
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Course | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    maKhoaHoc: "",
    tenKhoaHoc: "",
    biDanh: "",
    moTa: "",
    maDanhMucKhoaHoc: "",
    hinhAnh: "",
  });
  const pageSize = 8;

  // THÊM: State cho Modal Quản lý Học viên
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<{
    maKhoaHoc: string;
    tenKhoaHoc: string;
  } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [result, categoryResult] = await Promise.all([
        courseApi.getCoursePagination(page, pageSize),
        categoryApi.getCategories(),
      ]);
      const data = result.data as
        | { items?: Course[]; totalPages?: number }
        | Course[];
      setCourses(getList(data));
      setTotalPages(
        Math.max(1, Number((data as { totalPages?: number })?.totalPages || 1)),
      );
      setCategories(
        (Array.isArray(categoryResult.data)
          ? categoryResult.data
          : []) as Category[],
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const visibleCourses = courses.filter((course) =>
    course.tenKhoaHoc?.toLowerCase().includes(keyword.toLowerCase()),
  );

  const openForm = (course?: Course) => {
    setModalOpen(true);
    setEditing(course || null);
    setForm({
      maKhoaHoc: course?.maKhoaHoc || "",
      tenKhoaHoc: course?.tenKhoaHoc || "",
      biDanh: course?.biDanh || "",
      moTa: course?.moTa || "",
      maDanhMucKhoaHoc: course?.maDanhMucKhoaHoc || "",
      hinhAnh: course?.hinhAnh || "",
    });
  };

  // THÊM: Hàm mở Modal ghi danh học viên
  const openEnrollModal = (course: Course) => {
    setSelectedCourseForEnroll({
      maKhoaHoc: course.maKhoaHoc,
      tenKhoaHoc: course.tenKhoaHoc,
    });
    setEnrollModalOpen(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...form, maNhom: "GP01" };
    if (editing) await courseApi.updateCourse(payload);
    else await courseApi.addCourse(payload);
    setEditing(null);
    setModalOpen(false);
    await load();
  };

  const remove = async (course: Course) => {
    if (!window.confirm(`Xóa khóa học "${course.tenKhoaHoc}"?`)) return;
    await courseApi.deleteCourse(course.maKhoaHoc);
    await load();
  };

  return (
    <div>
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

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(30,65,64,0.05)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-[#123b3a]">Danh sách khóa học</p>
          <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 sm:w-72">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo tên khóa học"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
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
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : (
                visibleCourses.map((course) => (
                  <tr
                    key={course.maKhoaHoc}
                    className="transition hover:bg-[#fbfdfc]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-16 items-center justify-center overflow-hidden rounded-lg bg-[#e6f4f1] text-[#237c73]">
                          {course.hinhAnh ? (
                            <img
                              src={course.hinhAnh}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImagePlus className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {course.tenKhoaHoc}
                          </p>
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                            {course.moTa || "Chưa có mô tả"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      {course.maKhoaHoc}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {categories.find(
                        (item) => item.maDanhMuc === course.maDanhMucKhoaHoc,
                      )?.tenDanhMuc ||
                        course.maDanhMucKhoaHoc ||
                        "Chưa phân loại"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {course.maNhom || "GP01"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {/* THÊM: Nút Quản lý Học viên */}
                        <button
                          type="button"
                          title="Quản lý học viên"
                          onClick={() => openEnrollModal(course)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Users className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Sửa khóa học"
                          onClick={() => openForm(course)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-[#e6f4f1] hover:text-[#237c73]"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Xóa khóa học"
                          onClick={() => remove(course)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
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
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm">
          <span className="text-slate-500">
            Trang {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-slate-200 px-3 py-2 font-semibold disabled:opacity-40"
            >
              Trước
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg bg-[#123b3a] px-3 py-2 font-semibold text-white disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </section>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
          <form
            onSubmit={submit}
            className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#123b3a]">
                {editing ? "Cập nhật khóa học" : "Thêm khóa học"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditing(null);
                  setForm({
                    maKhoaHoc: "",
                    tenKhoaHoc: "",
                    biDanh: "",
                    moTa: "",
                    maDanhMucKhoaHoc: "",
                    hinhAnh: "",
                  });
                }}
                className="text-sm font-bold text-slate-400"
              >
                Đóng
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-600">
                Mã khóa học
                <input
                  required
                  disabled={!!editing}
                  value={form.maKhoaHoc}
                  onChange={(e) =>
                    setForm({ ...form, maKhoaHoc: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#58a99e]"
                />
              </label>
              <label className="text-sm font-semibold text-slate-600">
                Tên khóa học
                <input
                  required
                  value={form.tenKhoaHoc}
                  onChange={(e) =>
                    setForm({ ...form, tenKhoaHoc: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#58a99e]"
                />
              </label>
              <label className="text-sm font-semibold text-slate-600">
                Bí danh
                <input
                  required
                  value={form.biDanh}
                  onChange={(e) => setForm({ ...form, biDanh: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#58a99e]"
                />
              </label>
              <label className="text-sm font-semibold text-slate-600">
                Danh mục
                <select
                  required
                  value={form.maDanhMucKhoaHoc}
                  onChange={(e) =>
                    setForm({ ...form, maDanhMucKhoaHoc: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-[#58a99e]"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.maDanhMuc} value={category.maDanhMuc}>
                      {category.tenDanhMuc}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-600 sm:col-span-2">
                Hình ảnh URL
                <input
                  value={form.hinhAnh}
                  onChange={(e) =>
                    setForm({ ...form, hinhAnh: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#58a99e]"
                />
              </label>
              <label className="text-sm font-semibold text-slate-600 sm:col-span-2">
                Mô tả
                <textarea
                  rows={4}
                  value={form.moTa}
                  onChange={(e) => setForm({ ...form, moTa: e.target.value })}
                  className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#58a99e]"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-[#123b3a] px-4 py-3 text-sm font-bold text-white hover:bg-[#1c5855]"
            >
              Lưu khóa học
            </button>
          </form>
        </div>
      ) : null}

      {/* THÊM: Hiển thị Modal Ghi danh khóa học */}
      <CourseEnrollmentModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        maKhoaHoc={selectedCourseForEnroll?.maKhoaHoc || null}
        tenKhoaHoc={selectedCourseForEnroll?.tenKhoaHoc}
      />
    </div>
  );
}

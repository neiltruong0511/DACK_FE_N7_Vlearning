"use client";

import { FormEvent, useEffect, useState } from "react";
import { Edit3, FolderKanban, Plus, Trash2 } from "lucide-react";
import { categoryApi } from "@/services/categoryApi";

type Category = { maDanhMuc: string; tenDanhMuc: string };

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ maDanhMuc: "", tenDanhMuc: "" });

  const load = async () => {
    const result = await categoryApi.getCategories();
    setItems((Array.isArray(result.data) ? result.data : []) as Category[]);
  };
  useEffect(() => {
    load();
  }, []);

  const showForm = (item?: Category) => {
    setEditing(item || null);
    setForm({
      maDanhMuc: item?.maDanhMuc || "",
      tenDanhMuc: item?.tenDanhMuc || "",
    });
    setOpen(true);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (editing) await categoryApi.updateCategory(form);
    else await categoryApi.addCategory(form);
    setOpen(false);
    await load();
  };
  const remove = async (item: Category) => {
    if (window.confirm(`Xóa danh mục "${item.tenDanhMuc}"?`)) {
      await categoryApi.deleteCategory(item.maDanhMuc);
      await load();
    }
  };

  return (
    <div>
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#237c73]">
            Taxonomy
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#123b3a]">
            Danh mục khóa học
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sắp xếp nội dung để học viên tìm đúng lộ trình.
          </p>
        </div>
        <button
          type="button"
          onClick={() => showForm()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123b3a] px-4 py-3 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          Thêm danh mục
        </button>
      </header>
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(30,65,64,0.05)] sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.maDanhMuc}
              className="group rounded-xl border border-slate-200 p-4 transition hover:border-[#8bc9c0] hover:bg-[#fbfdfc]"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f4f1] text-[#237c73]">
                  <FolderKanban className="h-5 w-5" />
                </span>
                <div className="flex gap-1 opacity-60 group-hover:opacity-100">
                  <button
                    type="button"
                    title="Sửa danh mục"
                    onClick={() => showForm(item)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-[#e6f4f1] hover:text-[#237c73]"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Xóa danh mục"
                    onClick={() => remove(item)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h2 className="mt-5 font-bold text-slate-800">
                {item.tenDanhMuc}
              </h2>
              <p className="mt-1 font-mono text-xs text-slate-400">
                {item.maDanhMuc}
              </p>
            </article>
          ))}
        </div>
        {items.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-400">
            Chưa có danh mục nào.
          </p>
        )}
      </section>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
          <form
            onSubmit={submit}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 className="text-xl font-black text-[#123b3a]">
              {editing ? "Cập nhật danh mục" : "Thêm danh mục"}
            </h2>
            <label className="mt-5 block text-sm font-semibold text-slate-600">
              Mã danh mục
              <input
                required
                disabled={!!editing}
                value={form.maDanhMuc}
                onChange={(e) =>
                  setForm({ ...form, maDanhMuc: e.target.value })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
              />
            </label>
            <label className="mt-4 block text-sm font-semibold text-slate-600">
              Tên danh mục
              <input
                required
                value={form.tenDanhMuc}
                onChange={(e) =>
                  setForm({ ...form, tenDanhMuc: e.target.value })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
              />
            </label>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-1/2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="w-1/2 rounded-xl bg-[#123b3a] px-4 py-3 text-sm font-bold text-white"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

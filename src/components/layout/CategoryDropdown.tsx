"use client";

import Link from "next/link";
import { ChevronRight, FolderOpen } from "lucide-react";
import { useCategories } from "@/hooks/useCategory";

export default function CategoryDropdown() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <div
      className="
        invisible absolute left-0 top-full z-50
        translate-y-3 opacity-0
        transition-all duration-300
        group-hover:visible
        group-hover:translate-y-0
        group-hover:opacity-100
      "
    >
      <div className="mt-4 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white py-3 shadow-[0_20px_60px_rgba(15,23,42,.12)]">
        {/* Loading */}
        {isLoading && (
          <div className="px-5 py-8 text-center text-sm text-slate-500">
            Đang tải danh mục...
          </div>
        )}

        {/* Empty */}
        {!isLoading && categories.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-slate-500">
            Không có danh mục
          </div>
        )}

        {/* Categories */}
        {categories.map((item: any) => (
          <Link
            key={item.maDanhMuc}
            href={`/courses/category/${item.maDanhMuc}`}
            className="
              group/item
              mx-2 flex items-center justify-between
              rounded-2xl px-4 py-3
              transition-all duration-200
              hover:bg-blue-50
            "
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 transition group-hover/item:bg-blue-600">
                <FolderOpen
                  size={18}
                  className="text-blue-600 group-hover/item:text-white"
                />
              </div>

              <div>
                <p className="font-semibold text-slate-800 transition group-hover/item:text-blue-600">
                  {item.tenDanhMuc}
                </p>

                <p className="text-xs text-slate-400">Xem các khóa học</p>
              </div>
            </div>

            <ChevronRight
              size={18}
              className="text-slate-300 transition group-hover/item:translate-x-1 group-hover/item:text-blue-600"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

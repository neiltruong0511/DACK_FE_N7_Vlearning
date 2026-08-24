"use client";

import {
  ArrowDownAZ,
  ArrowUpAZ,
  Eye,
  RotateCcw,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";

export type SortOption = "newest" | "views" | "name-asc" | "name-desc";

export type ViewOption =
  | "all"
  | "under-100"
  | "100-500"
  | "500-1000"
  | "over-1000";

interface Props {
  categories: string[];
  category: string;
  setCategory: (value: string) => void;

  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;

  viewRange: ViewOption;
  setViewRange: (value: ViewOption) => void;
}

export default function SearchSidebar({
  categories,
  category,
  setCategory,
  sortBy,
  setSortBy,
  viewRange,
  setViewRange,
}: Props) {
  // =========================
  // RESET
  // =========================

  const handleReset = () => {
    setCategory("Tất cả");
    setSortBy("newest");
    setViewRange("all");
  };

  const hasFilter =
    category !== "Tất cả" || sortBy !== "newest" || viewRange !== "all";

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* ================= HEADER ================= */}

      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <SlidersHorizontal className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Bộ lọc</h2>

            <p className="text-xs text-slate-400">Tùy chỉnh khóa học</p>
          </div>
        </div>

        {hasFilter && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Đặt lại
          </button>
        )}
      </div>

      {/* ================= CATEGORY ================= */}

      <div className="border-b border-slate-100 pb-7">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">
          Danh mục
        </h3>

        <div className="space-y-1.5">
          {categories.map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                <span className="truncate">{item}</span>

                {active && (
                  <span className="ml-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= SORT ================= */}

      <div className="border-b border-slate-100 py-7">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">
          Sắp xếp
        </h3>

        <div className="space-y-1.5">
          <FilterButton
            active={sortBy === "newest"}
            onClick={() => setSortBy("newest")}
            icon={<TrendingUp className="h-4 w-4" />}
          >
            Mới nhất
          </FilterButton>

          <FilterButton
            active={sortBy === "views"}
            onClick={() => setSortBy("views")}
            icon={<Eye className="h-4 w-4" />}
          >
            Lượt xem nhiều nhất
          </FilterButton>

          <FilterButton
            active={sortBy === "name-asc"}
            onClick={() => setSortBy("name-asc")}
            icon={<ArrowDownAZ className="h-4 w-4" />}
          >
            Tên A → Z
          </FilterButton>

          <FilterButton
            active={sortBy === "name-desc"}
            onClick={() => setSortBy("name-desc")}
            icon={<ArrowUpAZ className="h-4 w-4" />}
          >
            Tên Z → A
          </FilterButton>
        </div>
      </div>

      {/* ================= VIEWS ================= */}

      <div className="py-7">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">
          Lượt xem
        </h3>

        <div className="space-y-2">
          <RadioOption
            checked={viewRange === "all"}
            onChange={() => setViewRange("all")}
            label="Tất cả"
          />

          <RadioOption
            checked={viewRange === "under-100"}
            onChange={() => setViewRange("under-100")}
            label="Dưới 100 lượt xem"
          />

          <RadioOption
            checked={viewRange === "100-500"}
            onChange={() => setViewRange("100-500")}
            label="100 – 500 lượt xem"
          />

          <RadioOption
            checked={viewRange === "500-1000"}
            onChange={() => setViewRange("500-1000")}
            label="500 – 1.000 lượt xem"
          />

          <RadioOption
            checked={viewRange === "over-1000"}
            onChange={() => setViewRange("over-1000")}
            label="Trên 1.000 lượt xem"
          />
        </div>
      </div>

      {/* ================= RESET ================= */}

      {hasFilter && (
        <button
          type="button"
          onClick={handleReset}
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-180" />
          Xóa tất cả bộ lọc
        </button>
      )}
    </aside>
  );
}

/* =====================================================
   FILTER BUTTON
===================================================== */

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, icon, children }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
      }`}
    >
      <span className={active ? "text-blue-600" : "text-slate-400"}>
        {icon}
      </span>

      <span>{children}</span>

      {active && <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />}
    </button>
  );
}

/* =====================================================
   RADIO OPTION
===================================================== */

interface RadioOptionProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

function RadioOption({ checked, onChange, label }: RadioOptionProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50"
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          checked ? "border-blue-600" : "border-slate-300"
        }`}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-blue-600" />}
      </span>

      <span className={checked ? "font-semibold text-slate-900" : ""}>
        {label}
      </span>
    </button>
  );
}

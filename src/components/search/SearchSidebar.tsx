"use client";

interface Props {
  categories: string[];
  category: string;
  setCategory: (value: string) => void;
}

const levels = ["Tất cả", "Mới bắt đầu", "Trung cấp", "Nâng cao"];

const ratings = [5, 4, 3, 2, 1];

export default function SearchSidebar({
  categories,
  category,
  setCategory,
}: Props) {
  return (
    <aside className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="mb-8 text-2xl font-bold">Bộ lọc</h2>

      {/* Danh mục */}
      <div className="mb-10">
        <h3 className="mb-4 text-lg font-semibold">Danh mục</h3>

        <div className="space-y-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`w-full rounded-xl px-4 py-3 text-left transition ${
                category === item
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Level */}
      <div className="mb-10">
        <h3 className="mb-4 text-lg font-semibold">Cấp độ</h3>

        <div className="space-y-3">
          {levels.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-3"
            >
              <input type="checkbox" />

              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Đánh giá</h3>

        <div className="space-y-3">
          {ratings.map((star) => (
            <label
              key={star}
              className="flex cursor-pointer items-center gap-3"
            >
              <input type="checkbox" />

              <span>{"⭐".repeat(star)}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

interface Props {
  keyword: string;
  total: number;
}

export default function SearchHero({ keyword, total }: Props) {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-10 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[4px] text-blue-200">
        Kết quả tìm kiếm
      </p>

      <h1 className="mt-4 text-5xl font-black">{keyword}</h1>

      <p className="mt-3 text-lg text-blue-100">
        Tìm thấy
        <span className="mx-2 font-bold text-white">{total}</span>
        khóa học
      </p>
    </section>
  );
}

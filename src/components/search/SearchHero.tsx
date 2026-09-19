interface Props {
  keyword: string;
  total: number;
}

export default function SearchHero({ keyword, total }: Props) {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-xl sm:p-10">
      <p className="text-xs uppercase tracking-[3px] text-blue-200 sm:text-sm sm:tracking-[4px]">
        Kết quả tìm kiếm
      </p>

      <h1 className="mt-4 break-words text-3xl font-black sm:text-5xl">{keyword}</h1>

      <p className="mt-3 text-base text-blue-100 sm:text-lg">
        Tìm thấy
        <span className="mx-2 font-bold text-white">{total}</span>
        khóa học
      </p>
    </section>
  );
}

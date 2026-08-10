"use client";

interface Props {
  keyword: string;
}

export default function SearchResult({ keyword }: Props) {
  return (
    <div>
      <h1>{keyword}</h1>
    </div>
  );
}

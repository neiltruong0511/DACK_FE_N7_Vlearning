import Image from "next/image";
import { Star } from "lucide-react";

export interface Teacher {
  id: number;
  name: string;
  avatar: string;
  position: string;
  rating: number;
  students: number;
}

interface Props {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: Props) {
  return (
    <div className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl">
      <div className="flex justify-center">
        <Image
          src={teacher.avatar}
          alt={teacher.name}
          width={90}
          height={90}
          className="rounded-full border-4 border-slate-100"
        />
      </div>

      <h3 className="mt-5 text-center text-xl font-bold">{teacher.name}</h3>

      <p className="mt-2 text-center text-gray-500">{teacher.position}</p>

      <div className="mt-5 flex justify-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star key={index} size={15} fill="#facc15" color="#facc15" />
        ))}
      </div>

      <p className="mt-3 text-center text-sm text-gray-500">
        {teacher.rating} ({teacher.students} đánh giá)
      </p>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
  role?: "HV" | "GV";
}

export default function AuthGuard({ children, role }: Props) {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role && user.maLoaiNguoiDung !== role) {
      router.replace("/");
    }
  }, []);

  return <>{children}</>;
}

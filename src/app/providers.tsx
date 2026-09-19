"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryClient } from "@/lib/react-query";
import ToastProvider from "@/components/common/ToastProvider";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  useEffect(() => {
    const appKeys = new Set([
      "ACCESS_TOKEN",
      "USER_INFO",
      "FAVORITE_COURSES",
      "MY_COURSES",
    ]);

    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);

      if (
        key &&
        (appKeys.has(key) ||
          key.startsWith("AVATAR_") ||
          key.startsWith("FAVORITE_COURSES_"))
      ) {
        localStorage.removeItem(key);
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}

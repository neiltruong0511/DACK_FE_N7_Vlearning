import AuthGuard from "@/components/common/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard role="GV">{children}</AuthGuard>;
}

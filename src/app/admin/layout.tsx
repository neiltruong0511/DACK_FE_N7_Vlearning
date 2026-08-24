import AuthGuard from "@/components/common/AuthGuard";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard role="GV">
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}

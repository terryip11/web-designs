import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { requireAdmin } from "@/lib/auth/admin";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authorized } = await requireAdmin();

  if (!authorized) {
    const user = await getCurrentUser();
    redirect(user ? "/account" : "/login?next=/admin");
  }

  return <AdminShell>{children}</AdminShell>;
}

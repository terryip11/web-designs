import { Suspense } from "react";
import AdminMemberFilters from "@/components/AdminMemberFilters";
import AdminMemberManager from "@/components/AdminMemberManager";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getAdminMembers } from "@/lib/admin/members";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  const { adminClient } = await requireAdmin();

  if (!adminClient) {
    return (
      <div className="text-center text-zinc-400">
        後台無法連線資料庫，請確認已設定{" "}
        <code className="text-amber-400">SUPABASE_SERVICE_ROLE_KEY</code>。
      </div>
    );
  }

  const { q, role } = await searchParams;
  const roleFilter =
    role === "admin" || role === "member" ? role : undefined;
  const { rows, error } = await getAdminMembers(adminClient, {
    q,
    role: roleFilter,
  });

  if (error) {
    return (
      <div className="text-center text-red-400">
        讀取會員失敗：{error}
      </div>
    );
  }

  const adminCount = rows.filter((row) => row.is_admin).length;

  return (
    <>
      <RevealOnScroll>
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-400/80">
            營運
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">會員管理</h1>
          <p className="mt-2 text-sm text-zinc-500">
            共 {rows.length} 位會員 · 管理員 {adminCount} 位
          </p>
        </div>
      </RevealOnScroll>

      <Suspense fallback={null}>
        <AdminMemberFilters />
      </Suspense>

      <RevealOnScroll delay={0.05}>
        <AdminMemberManager rows={rows} />
      </RevealOnScroll>
    </>
  );
}

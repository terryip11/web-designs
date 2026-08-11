import { Suspense } from "react";
import AdminInquiryFilters from "@/components/AdminInquiryFilters";
import AdminInquiryManager from "@/components/AdminInquiryManager";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getAdminInquiries } from "@/lib/admin/inquiries";
import { requireAdmin } from "@/lib/auth/admin";
import { formatPrice } from "@/lib/data";

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
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

  const { q, status } = await searchParams;
  const { rows } = await getAdminInquiries(adminClient, { q, status });
  const newCount = rows.filter((r) => (r.status ?? "new") === "new").length;
  const totalValue = rows.reduce((sum, r) => sum + (r.total_price ?? 0), 0);

  return (
    <>
      <RevealOnScroll>
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-400/80">
            營運
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">客戶詢價</h1>
          <p className="mt-2 text-sm text-zinc-500">
            共 {rows.length} 筆 · 新詢價 {newCount} · 參考總額{" "}
            {formatPrice(totalValue)} HKD
          </p>
        </div>
      </RevealOnScroll>

      <Suspense fallback={null}>
        <AdminInquiryFilters />
      </Suspense>

      <RevealOnScroll delay={0.05}>
        <AdminInquiryManager rows={rows} />
      </RevealOnScroll>
    </>
  );
}

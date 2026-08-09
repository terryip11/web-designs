import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminInquiryFilters from "@/components/AdminInquiryFilters";
import AdminInquiryTable, {
  type AdminInquiryRow,
} from "@/components/AdminInquiryTable";
import RevealOnScroll from "@/components/RevealOnScroll";
import { requireAdmin } from "@/lib/auth/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { formatPrice } from "@/lib/data";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { authorized, adminClient } = await requireAdmin();

  if (!authorized) {
    const user = await getCurrentUser();
    redirect(user ? "/account" : "/login?next=/admin");
  }

  if (!adminClient) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center text-zinc-400">
        後台無法連線資料庫，請確認已設定{" "}
        <code className="text-amber-400">SUPABASE_SERVICE_ROLE_KEY</code>。
      </div>
    );
  }

  const { q, status } = await searchParams;

  let query = adminClient
    .from("inquiries")
    .select(
      "id, name, email, phone, company, template_name, total_price, currency, created_at, selected_features, sketch_urls, message, status, email_customer_sent, email_notify_sent"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (status) {
    query = query.eq("status", status);
  }

  if (q?.trim()) {
    const safe = q.trim().replace(/[%_,]/g, "");
    if (safe) {
      const term = `%${safe}%`;
      query = query.or(
        `name.ilike.${term},email.ilike.${term},template_name.ilike.${term},company.ilike.${term}`
      );
    }
  }

  const { data: inquiries, error } = await query;

  if (error) {
    console.error("Admin inquiries fetch:", error);
  }

  const rows = (inquiries ?? []) as AdminInquiryRow[];
  const totalValue = rows.reduce((sum, r) => sum + (r.total_price ?? 0), 0);
  const newCount = rows.filter((r) => (r.status ?? "new") === "new").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <RevealOnScroll>
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-amber-400/80">
              管理後台
            </p>
            <h1 className="mt-1 text-3xl font-bold text-white">客戶詢價管理</h1>
            <p className="mt-2 text-sm text-zinc-500">
              共 {rows.length} 筆 · 新詢價 {newCount} · 參考總額{" "}
              {formatPrice(totalValue)} HKD
            </p>
          </div>
          <Link
            href="/account"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-white"
          >
            返回會員中心
          </Link>
        </div>
      </RevealOnScroll>

      <Suspense fallback={null}>
        <AdminInquiryFilters />
      </Suspense>

      <RevealOnScroll delay={0.05}>
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 p-12 text-center text-zinc-500">
            尚無符合條件的詢價紀錄
          </div>
        ) : (
          <AdminInquiryTable rows={rows} />
        )}
      </RevealOnScroll>
    </div>
  );
}

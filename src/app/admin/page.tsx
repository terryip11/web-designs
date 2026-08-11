import Link from "next/link";
import { Eye, MessageSquare, TrendingUp, Users } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getAdminInquiries } from "@/lib/admin/inquiries";
import { getAnalyticsSummary } from "@/lib/analytics/queries";
import { requireAdmin } from "@/lib/auth/admin";
import { formatPrice } from "@/lib/data";
import { INQUIRY_STATUS_LABELS } from "@/lib/inquiry-status";

function OverviewCard({
  label,
  value,
  hint,
  href,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint: string;
  href: string;
  icon: typeof Eye;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-colors hover:border-violet-500/40 hover:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          <p className="mt-1 text-xs text-zinc-500 group-hover:text-zinc-400">
            {hint} →
          </p>
        </div>
        <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}

export default async function AdminOverviewPage() {
  const { adminClient } = await requireAdmin();

  if (!adminClient) {
    return (
      <div className="text-center text-zinc-400">
        後台無法連線資料庫，請確認已設定{" "}
        <code className="text-amber-400">SUPABASE_SERVICE_ROLE_KEY</code>。
      </div>
    );
  }

  const [{ rows: allRows }, analytics] = await Promise.all([
    getAdminInquiries(adminClient),
    getAnalyticsSummary(adminClient),
  ]);

  const rows = allRows.slice(0, 5);
  const newCount = allRows.filter((r) => (r.status ?? "new") === "new").length;
  const totalValue = allRows.reduce((sum, r) => sum + (r.total_price ?? 0), 0);

  return (
    <>
      <RevealOnScroll>
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-400/80">
            總覽
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">儀表板</h1>
          <p className="mt-2 text-sm text-zinc-500">
            快速掌握詢價與網站流量概況
          </p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.03}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            label="新詢價"
            value={newCount}
            hint="前往客戶詢價"
            href="/admin/inquiries?status=new"
            icon={MessageSquare}
          />
          <OverviewCard
            label="詢價總筆數"
            value={allRows.length}
            hint="查看全部詢價"
            href="/admin/inquiries"
            icon={TrendingUp}
          />
          <OverviewCard
            label="即時在線"
            value={analytics.onlineNow}
            hint="查看網站瀏覽"
            href="/admin/analytics"
            icon={Users}
          />
          <OverviewCard
            label="近 24 小時瀏覽"
            value={analytics.views24h}
            hint="查看流量詳情"
            href="/admin/analytics"
            icon={Eye}
          />
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.05}>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-white">最近詢價</h2>
              <Link
                href="/admin/inquiries"
                className="text-xs text-violet-400 hover:underline"
              >
                查看全部
              </Link>
            </div>
            {rows.length === 0 ? (
              <p className="text-sm text-zinc-500">暫無詢價紀錄</p>
            ) : (
              <ul className="space-y-3">
                {rows.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-start justify-between gap-3 border-b border-zinc-800/80 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-zinc-200">{row.name}</p>
                      <p className="truncate text-xs text-zinc-500">
                        {row.template_name} ·{" "}
                        {INQUIRY_STATUS_LABELS[row.status ?? "new"]}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-zinc-400">
                      {formatPrice(row.total_price ?? 0)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-white">詢價摘要</h2>
              <Link
                href="/admin/inquiries"
                className="text-xs text-violet-400 hover:underline"
              >
                管理詢價
              </Link>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">參考總額</dt>
                <dd className="font-medium text-white">
                  {formatPrice(totalValue)} HKD
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">近 24 小時訪客</dt>
                <dd className="font-medium text-white">
                  {analytics.visitors24h} 人
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">近 24 小時 IP</dt>
                <dd className="font-medium text-white">
                  {analytics.uniqueIps24h} 個
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">近 7 日瀏覽</dt>
                <dd className="font-medium text-white">{analytics.views7d} 次</dd>
              </div>
            </dl>
          </section>
        </div>
      </RevealOnScroll>
    </>
  );
}

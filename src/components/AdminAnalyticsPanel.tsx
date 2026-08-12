import { AlertTriangle, Eye, Globe, Shield } from "lucide-react";
import type { AnalyticsSummary } from "@/lib/analytics/queries";
import { formatAdminIp } from "@/lib/analytics/queries";
import { formatPathLabel } from "@/lib/analytics/paths";

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("zh-HK", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Hong_Kong",
  }).format(new Date(iso));
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: number;
  hint: string;
  icon: typeof Eye;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          <p className="mt-1 text-xs text-zinc-500">{hint}</p>
        </div>
        <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPanel({
  analytics,
}: {
  analytics: AnalyticsSummary;
}) {
  if (!analytics.configured) {
    return (
      <section className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="text-lg font-semibold text-white">網站瀏覽統計</h2>
        <p className="mt-2 text-sm text-zinc-400">
          請在 Supabase SQL Editor 依序執行{" "}
          <code className="text-amber-300">010_page_views.sql</code> 至{" "}
          <code className="text-amber-300">017_analytics_quality.sql</code>{" "}
          後重新整理。
        </p>
      </section>
    );
  }

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <section>
      <div className="mb-6 rounded-xl border border-violet-500/25 bg-violet-500/5 p-5">
        <h3 className="text-sm font-semibold text-violet-200">
          真實訪客請以 Google Analytics 為準
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          下方數字已排除 Demo iframe、localhost、後台與 bot 噪音，但仍只是粗略參考。
          業務決策（有沒有客戶、從哪裡來）請以{" "}
          {gaId ? (
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-300 underline-offset-2 hover:underline"
            >
              GA4（{gaId}）
            </a>
          ) : (
            "GA4"
          )}{" "}
          及「詢價列表」為主。
        </p>
      </div>

      {analytics.suspicious24h > 0 && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-200">
                可疑探測（近 24 小時 · {analytics.suspicious24h} 次）
              </h3>
              <p className="mt-1 text-xs text-amber-200/70">
                自動掃描路徑（如 WordPress、.env），不是真實客戶；已自一般瀏覽統計排除。
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            {analytics.suspiciousActivity.map((row) => (
              <li
                key={`${row.path}-${row.last_seen}-${formatAdminIp(row)}`}
                className="flex items-start justify-between gap-3 border-b border-amber-500/15 pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-amber-100">{row.label}</p>
                  <p className="truncate font-mono text-xs text-amber-200/80">
                    {row.path}
                  </p>
                  <p className="mt-1 text-xs text-amber-200/60">
                    IP {formatAdminIp(row)} · {row.hits} 次
                  </p>
                </div>
                <time className="shrink-0 text-xs text-amber-200/50">
                  {formatTime(row.last_seen)}
                </time>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="近 24 小時訪客"
          value={analytics.visitors24h}
          hint="已過濾噪音 · 去重 cookie"
          icon={Globe}
        />
        <StatCard
          label="近 24 小時瀏覽"
          value={analytics.views24h}
          hint="已過濾噪音 · 頁面次數"
          icon={Eye}
        />
        <StatCard
          label="可疑探測"
          value={analytics.suspicious24h}
          hint="近 24 小時 · bot 掃描"
          icon={Shield}
        />
      </div>

      {analytics.suspicious24h === 0 && (
        <p className="mt-4 flex items-center gap-2 text-xs text-zinc-600">
          <Shield className="h-3.5 w-3.5" />
          近 24 小時無可疑探測紀錄
        </p>
      )}

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h3 className="text-sm font-semibold text-white">熱門頁面（24 小時 · 已過濾）</h3>
        {analytics.topPages.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">暫無資料</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {analytics.topPages.map((page) => (
              <li
                key={page.path}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-zinc-200">{page.label}</p>
                  <p className="truncate text-xs text-zinc-500">{page.path}</p>
                </div>
                <span className="shrink-0 rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                  {page.views}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

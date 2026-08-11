import { Eye, Globe, TrendingUp, Users } from "lucide-react";
import type { AnalyticsSummary } from "@/lib/analytics/queries";
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
          請在 Supabase SQL Editor 執行{" "}
          <code className="text-amber-300">010_page_views.sql</code>{" "}
          後重新整理，即可在此查看訪客瀏覽紀錄。
        </p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-400/80">
            即時統計
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">網站瀏覽</h2>
          <p className="mt-1 text-sm text-zinc-500">
            追蹤公開頁面瀏覽（不含後台、API 與登入頁）
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          即時在線以 5 分鐘內活動計算
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="即時在線"
          value={analytics.onlineNow}
          hint="近 5 分鐘有瀏覽的訪客"
          icon={Users}
        />
        <StatCard
          label="近 24 小時瀏覽"
          value={analytics.views24h}
          hint="頁面瀏覽次數"
          icon={Eye}
        />
        <StatCard
          label="近 24 小時訪客"
          value={analytics.visitors24h}
          hint="不重複訪客（cookie）"
          icon={Globe}
        />
        <StatCard
          label="近 7 日瀏覽"
          value={analytics.views7d}
          hint="累計頁面瀏覽"
          icon={TrendingUp}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h3 className="text-sm font-semibold text-white">最近瀏覽</h3>
          {analytics.recentViews.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">暫無瀏覽紀錄</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {analytics.recentViews.map((view) => (
                <li
                  key={view.id}
                  className="flex items-start justify-between gap-3 border-b border-zinc-800/80 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-zinc-200">
                      {formatPathLabel(view.path)}
                    </p>
                    <p className="truncate text-xs text-zinc-500">{view.path}</p>
                  </div>
                  <time className="shrink-0 text-xs text-zinc-500">
                    {formatTime(view.created_at)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h3 className="text-sm font-semibold text-white">熱門頁面（24 小時）</h3>
          {analytics.topPages.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">暫無資料</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {analytics.topPages.map((page) => (
                <li
                  key={page.path}
                  className="flex items-center justify-between gap-3"
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
      </div>
    </section>
  );
}

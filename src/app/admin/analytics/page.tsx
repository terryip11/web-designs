import RevealOnScroll from "@/components/RevealOnScroll";
import AdminAnalyticsPanel from "@/components/AdminAnalyticsPanel";
import { getAnalyticsSummary } from "@/lib/analytics/queries";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminAnalyticsPage() {
  const { adminClient } = await requireAdmin();

  if (!adminClient) {
    return (
      <div className="text-center text-zinc-400">
        後台無法連線資料庫，請確認已設定{" "}
        <code className="text-amber-400">SUPABASE_SERVICE_ROLE_KEY</code>。
      </div>
    );
  }

  const analytics = await getAnalyticsSummary(adminClient);

  return (
    <>
      <RevealOnScroll>
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-400/80">
            數據
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">網站瀏覽</h1>
          <p className="mt-2 text-sm text-zinc-500">
            安全探測與粗略流量；真實訪客請以 GA4 及詢價列表為準
          </p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.03}>
        <AdminAnalyticsPanel analytics={analytics} />
      </RevealOnScroll>
    </>
  );
}

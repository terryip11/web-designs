import type { SupabaseClient } from "@supabase/supabase-js";
import { formatPathLabel } from "@/lib/analytics/paths";

export interface PageViewRow {
  id: string;
  path: string;
  referrer: string | null;
  created_at: string;
}

export interface TopPageRow {
  path: string;
  label: string;
  views: number;
}

export interface AnalyticsSummary {
  configured: boolean;
  onlineNow: number;
  views24h: number;
  visitors24h: number;
  views7d: number;
  recentViews: PageViewRow[];
  topPages: TopPageRow[];
}

function isMissingTableError(message: string) {
  return message.includes("page_views") && message.includes("does not exist");
}

export async function getAnalyticsSummary(
  adminClient: SupabaseClient
): Promise<AnalyticsSummary> {
  const empty: AnalyticsSummary = {
    configured: false,
    onlineNow: 0,
    views24h: 0,
    visitors24h: 0,
    views7d: 0,
    recentViews: [],
    topPages: [],
  };

  const now = Date.now();
  const since5m = new Date(now - 5 * 60 * 1000).toISOString();
  const since24h = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const since7d = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    onlineRes,
    views24hRes,
    visitors24hRes,
    views7dRes,
    recentRes,
    topRes,
  ] = await Promise.all([
    adminClient
      .from("page_views")
      .select("visitor_id")
      .gte("created_at", since5m),
    adminClient
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since24h),
    adminClient
      .from("page_views")
      .select("visitor_id")
      .gte("created_at", since24h),
    adminClient
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since7d),
    adminClient
      .from("page_views")
      .select("id, path, referrer, created_at")
      .order("created_at", { ascending: false })
      .limit(15),
    adminClient
      .from("page_views")
      .select("path")
      .gte("created_at", since24h)
      .limit(5000),
  ]);

  const firstError =
    onlineRes.error ??
    views24hRes.error ??
    visitors24hRes.error ??
    views7dRes.error ??
    recentRes.error ??
    topRes.error;

  if (firstError) {
    if (isMissingTableError(firstError.message)) return empty;
    console.error("[analytics] summary:", firstError.message);
    return empty;
  }

  const onlineVisitors = new Set(
    (onlineRes.data ?? []).map((row) => row.visitor_id)
  );
  const unique24h = new Set(
    (visitors24hRes.data ?? []).map((row) => row.visitor_id)
  );

  const pathCounts = new Map<string, number>();
  for (const row of topRes.data ?? []) {
    pathCounts.set(row.path, (pathCounts.get(row.path) ?? 0) + 1);
  }

  const topPages = [...pathCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, views]) => ({
      path,
      label: formatPathLabel(path),
      views,
    }));

  return {
    configured: true,
    onlineNow: onlineVisitors.size,
    views24h: views24hRes.count ?? 0,
    visitors24h: unique24h.size,
    views7d: views7dRes.count ?? 0,
    recentViews: (recentRes.data ?? []) as PageViewRow[],
    topPages,
  };
}

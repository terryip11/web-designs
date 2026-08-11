import type { SupabaseClient } from "@supabase/supabase-js";
import { formatPathLabel } from "@/lib/analytics/paths";

export interface PageViewRow {
  id: string;
  path: string;
  referrer: string | null;
  ip_masked: string | null;
  created_at: string;
}

export interface RecentIpRow {
  ip_masked: string;
  ip_hash: string;
  last_path: string;
  last_seen: string;
  hits: number;
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
  uniqueIps24h: number;
  views7d: number;
  recentViews: PageViewRow[];
  recentIps: RecentIpRow[];
  topPages: TopPageRow[];
}

interface AnalyticsRpcPayload {
  counts: {
    online_now: number;
    views_24h: number;
    visitors_24h: number;
    unique_ips_24h: number;
    views_7d: number;
  };
  top_pages: { path: string; views: number }[];
  recent_views: PageViewRow[];
  recent_ips: RecentIpRow[];
}

function isMissingTableError(message: string) {
  return message.includes("page_views") && message.includes("does not exist");
}

function isMissingRpcError(message: string) {
  return (
    message.includes("admin_analytics_summary") &&
    (message.includes("does not exist") || message.includes("Could not find"))
  );
}

function emptySummary(): AnalyticsSummary {
  return {
    configured: false,
    onlineNow: 0,
    views24h: 0,
    visitors24h: 0,
    uniqueIps24h: 0,
    views7d: 0,
    recentViews: [],
    recentIps: [],
    topPages: [],
  };
}

function mapRpcPayload(payload: AnalyticsRpcPayload): AnalyticsSummary {
  const { counts, top_pages, recent_views, recent_ips } = payload;

  return {
    configured: true,
    onlineNow: counts.online_now ?? 0,
    views24h: counts.views_24h ?? 0,
    visitors24h: counts.visitors_24h ?? 0,
    uniqueIps24h: counts.unique_ips_24h ?? 0,
    views7d: counts.views_7d ?? 0,
    recentViews: recent_views ?? [],
    recentIps: recent_ips ?? [],
    topPages: (top_pages ?? []).map((row) => ({
      path: row.path,
      label: formatPathLabel(row.path),
      views: row.views,
    })),
  };
}

function buildRecentIps(
  rows: {
    ip_hash: string | null;
    ip_masked: string | null;
    path: string;
    created_at: string;
  }[]
): RecentIpRow[] {
  const byHash = new Map<string, RecentIpRow>();

  for (const row of rows) {
    if (!row.ip_hash || !row.ip_masked) continue;

    const existing = byHash.get(row.ip_hash);
    if (!existing) {
      byHash.set(row.ip_hash, {
        ip_hash: row.ip_hash,
        ip_masked: row.ip_masked,
        last_path: row.path,
        last_seen: row.created_at,
        hits: 1,
      });
      continue;
    }

    existing.hits += 1;
    if (row.created_at > existing.last_seen) {
      existing.last_seen = row.created_at;
      existing.last_path = row.path;
    }
  }

  return [...byHash.values()]
    .sort((a, b) => b.last_seen.localeCompare(a.last_seen))
    .slice(0, 10);
}

/** Legacy fallback when `012_analytics_rpc.sql` has not been applied yet. */
async function getAnalyticsSummaryLegacy(
  adminClient: SupabaseClient
): Promise<AnalyticsSummary> {
  const now = Date.now();
  const since5m = new Date(now - 5 * 60 * 1000).toISOString();
  const since24h = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const since7d = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    onlineRes,
    views24hRes,
    visitors24hRes,
    ips24hRes,
    views7dRes,
    recentRes,
    topRes,
    ipRows24hRes,
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
      .select("ip_hash")
      .gte("created_at", since24h)
      .not("ip_hash", "is", null),
    adminClient
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since7d),
    adminClient
      .from("page_views")
      .select("id, path, referrer, ip_masked, ip_hash, created_at")
      .order("created_at", { ascending: false })
      .limit(15),
    adminClient
      .from("page_views")
      .select("path")
      .gte("created_at", since24h)
      .limit(5000),
    adminClient
      .from("page_views")
      .select("ip_hash, ip_masked, path, created_at")
      .gte("created_at", since24h)
      .not("ip_hash", "is", null)
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  const firstError =
    onlineRes.error ??
    views24hRes.error ??
    visitors24hRes.error ??
    ips24hRes.error ??
    views7dRes.error ??
    recentRes.error ??
    topRes.error ??
    ipRows24hRes.error;

  if (firstError) {
    if (isMissingTableError(firstError.message)) return emptySummary();
    console.error("[analytics] legacy summary:", firstError.message);
    return emptySummary();
  }

  const pathCounts = new Map<string, number>();
  for (const row of topRes.data ?? []) {
    pathCounts.set(row.path, (pathCounts.get(row.path) ?? 0) + 1);
  }

  return {
    configured: true,
    onlineNow: new Set((onlineRes.data ?? []).map((row) => row.visitor_id)).size,
    views24h: views24hRes.count ?? 0,
    visitors24h: new Set(
      (visitors24hRes.data ?? []).map((row) => row.visitor_id)
    ).size,
    uniqueIps24h: new Set(
      (ips24hRes.data ?? []).map((row) => row.ip_hash).filter(Boolean)
    ).size,
    views7d: views7dRes.count ?? 0,
    recentViews: (recentRes.data ?? []) as PageViewRow[],
    recentIps: buildRecentIps(ipRows24hRes.data ?? []),
    topPages: [...pathCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, views]) => ({
        path,
        label: formatPathLabel(path),
        views,
      })),
  };
}

export async function getAnalyticsSummary(
  adminClient: SupabaseClient
): Promise<AnalyticsSummary> {
  const { data, error } = await adminClient.rpc("admin_analytics_summary");

  if (!error && data) {
    return mapRpcPayload(data as AnalyticsRpcPayload);
  }

  if (error) {
    if (isMissingTableError(error.message)) return emptySummary();
    if (isMissingRpcError(error.message)) {
      return getAnalyticsSummaryLegacy(adminClient);
    }
    console.error("[analytics] rpc summary:", error.message);
    return getAnalyticsSummaryLegacy(adminClient);
  }

  return emptySummary();
}

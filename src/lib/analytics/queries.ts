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

function isMissingTableError(message: string) {
  return message.includes("page_views") && message.includes("does not exist");
}

function buildRecentIps(
  rows: { ip_hash: string | null; ip_masked: string | null; path: string; created_at: string }[]
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

export async function getAnalyticsSummary(
  adminClient: SupabaseClient
): Promise<AnalyticsSummary> {
  const empty: AnalyticsSummary = {
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
  const uniqueIps = new Set(
    (ips24hRes.data ?? []).map((row) => row.ip_hash).filter(Boolean)
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

  const recentRows = (recentRes.data ?? []) as PageViewRow[];

  return {
    configured: true,
    onlineNow: onlineVisitors.size,
    views24h: views24hRes.count ?? 0,
    visitors24h: unique24h.size,
    uniqueIps24h: uniqueIps.size,
    views7d: views7dRes.count ?? 0,
    recentViews: recentRows,
    recentIps: buildRecentIps(ipRows24hRes.data ?? []),
    topPages,
  };
}

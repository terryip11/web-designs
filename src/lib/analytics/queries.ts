import type { SupabaseClient } from "@supabase/supabase-js";
import {
  formatPathLabel,
  getSuspiciousPathLabel,
  isQualityPageView,
} from "@/lib/analytics/paths";

export interface PageViewRow {
  id: string;
  path: string;
  referrer: string | null;
  ip_address: string | null;
  ip_masked: string | null;
  created_at: string;
}

export interface RecentIpRow {
  ip_address: string | null;
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

export interface SuspiciousActivityRow {
  path: string;
  label: string;
  ip_address: string | null;
  ip_masked: string | null;
  hits: number;
  last_seen: string;
}

export interface AnalyticsSummary {
  configured: boolean;
  onlineNow: number;
  views24h: number;
  visitors24h: number;
  uniqueIps24h: number;
  views7d: number;
  suspicious24h: number;
  recentViews: PageViewRow[];
  recentIps: RecentIpRow[];
  suspiciousActivity: SuspiciousActivityRow[];
  topPages: TopPageRow[];
}

interface AnalyticsRpcPayload {
  counts: {
    online_now: number;
    views_24h: number;
    visitors_24h: number;
    unique_ips_24h: number;
    views_7d: number;
    suspicious_24h: number;
  };
  top_pages: { path: string; views: number }[];
  recent_views: PageViewRow[];
  recent_ips: RecentIpRow[];
  suspicious_activity: {
    path: string;
    ip_address: string | null;
    ip_masked: string | null;
    hits: number;
    last_seen: string;
  }[];
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

function isMissingQualityFilterError(message: string) {
  return message.includes("is_quality_page_view");
}

type PageViewFilterRow = {
  path: string;
  referrer?: string | null;
  user_agent?: string | null;
  is_suspicious?: boolean | null;
};

function passesQualityFilter(row: PageViewFilterRow): boolean {
  if (row.is_suspicious) return false;
  return isQualityPageView(
    row.path,
    row.referrer ?? null,
    row.user_agent ?? null
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
    suspicious24h: 0,
    recentViews: [],
    recentIps: [],
    suspiciousActivity: [],
    topPages: [],
  };
}

function mapRpcPayload(payload: AnalyticsRpcPayload): AnalyticsSummary {
  const { counts, top_pages, recent_views, recent_ips, suspicious_activity } =
    payload;

  return {
    configured: true,
    onlineNow: counts.online_now ?? 0,
    views24h: counts.views_24h ?? 0,
    visitors24h: counts.visitors_24h ?? 0,
    uniqueIps24h: counts.unique_ips_24h ?? 0,
    views7d: counts.views_7d ?? 0,
    suspicious24h: counts.suspicious_24h ?? 0,
    recentViews: recent_views ?? [],
    recentIps: recent_ips ?? [],
    suspiciousActivity: (suspicious_activity ?? []).map((row) => ({
      path: row.path,
      label: getSuspiciousPathLabel(row.path),
      ip_address: row.ip_address,
      ip_masked: row.ip_masked,
      hits: row.hits,
      last_seen: row.last_seen,
    })),
    topPages: (top_pages ?? []).map((row) => ({
      path: row.path,
      label: formatPathLabel(row.path),
      views: row.views,
    })),
  };
}

export function formatAdminIp(row: {
  ip_address?: string | null;
  ip_masked?: string | null;
}) {
  return row.ip_address ?? row.ip_masked ?? "";
}

function buildRecentIps(
  rows: {
    ip_hash: string | null;
    ip_address?: string | null;
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
        ip_address: row.ip_address ?? null,
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
      existing.ip_address = row.ip_address ?? existing.ip_address;
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
    suspiciousRes,
  ] = await Promise.all([
    adminClient
      .from("page_views")
      .select("visitor_id, path, referrer, user_agent, is_suspicious")
      .gte("created_at", since5m)
      .eq("is_suspicious", false),
    adminClient
      .from("page_views")
      .select("id, path, referrer, user_agent, is_suspicious")
      .gte("created_at", since24h)
      .eq("is_suspicious", false),
    adminClient
      .from("page_views")
      .select("visitor_id, path, referrer, user_agent, is_suspicious")
      .gte("created_at", since24h)
      .eq("is_suspicious", false),
    adminClient
      .from("page_views")
      .select("ip_hash, path, referrer, user_agent, is_suspicious")
      .gte("created_at", since24h)
      .eq("is_suspicious", false)
      .not("ip_hash", "is", null),
    adminClient
      .from("page_views")
      .select("id, path, referrer, user_agent, is_suspicious")
      .gte("created_at", since7d)
      .eq("is_suspicious", false),
    adminClient
      .from("page_views")
      .select("id, path, referrer, ip_address, ip_masked, ip_hash, user_agent, is_suspicious, created_at")
      .eq("is_suspicious", false)
      .order("created_at", { ascending: false })
      .limit(50),
    adminClient
      .from("page_views")
      .select("path, referrer, user_agent, is_suspicious")
      .gte("created_at", since24h)
      .eq("is_suspicious", false)
      .limit(5000),
    adminClient
      .from("page_views")
      .select("ip_hash, ip_address, ip_masked, path, referrer, user_agent, is_suspicious, created_at")
      .gte("created_at", since24h)
      .eq("is_suspicious", false)
      .not("ip_hash", "is", null)
      .order("created_at", { ascending: false })
      .limit(500),
    adminClient
      .from("page_views")
      .select("path, ip_address, ip_masked, ip_hash, created_at")
      .gte("created_at", since24h)
      .eq("is_suspicious", true)
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
    ipRows24hRes.error ??
    suspiciousRes.error;

  if (firstError) {
    if (isMissingTableError(firstError.message)) return emptySummary();
    console.error("[analytics] legacy summary:", firstError.message);
    return emptySummary();
  }

  const onlineRows = (onlineRes.data ?? []).filter(passesQualityFilter);
  const views24hRows = (views24hRes.data ?? []).filter(passesQualityFilter);
  const visitors24hRows = (visitors24hRes.data ?? []).filter(passesQualityFilter);
  const ips24hRows = (ips24hRes.data ?? []).filter(passesQualityFilter);
  const views7dRows = (views7dRes.data ?? []).filter(passesQualityFilter);
  const recentQuality = (recentRes.data ?? []).filter(passesQualityFilter).slice(0, 10);
  const topQuality = (topRes.data ?? []).filter(passesQualityFilter);
  const ipQuality = (ipRows24hRes.data ?? []).filter(passesQualityFilter);

  const pathCounts = new Map<string, number>();
  for (const row of topQuality) {
    pathCounts.set(row.path, (pathCounts.get(row.path) ?? 0) + 1);
  }

  const suspiciousRows = suspiciousRes.data ?? [];
  const suspiciousByKey = new Map<string, SuspiciousActivityRow>();
  for (const row of suspiciousRows) {
    if (!row.ip_hash) continue;
    const key = `${row.path}:${row.ip_hash}`;
    const existing = suspiciousByKey.get(key);
    if (!existing) {
      suspiciousByKey.set(key, {
        path: row.path,
        label: getSuspiciousPathLabel(row.path),
        ip_address: row.ip_address ?? null,
        ip_masked: row.ip_masked ?? null,
        hits: 1,
        last_seen: row.created_at,
      });
      continue;
    }
    existing.hits += 1;
    if (row.created_at > existing.last_seen) {
      existing.last_seen = row.created_at;
    }
  }

  return {
    configured: true,
    onlineNow: new Set(onlineRows.map((row) => row.visitor_id)).size,
    views24h: views24hRows.length,
    visitors24h: new Set(visitors24hRows.map((row) => row.visitor_id)).size,
    uniqueIps24h: new Set(
      ips24hRows.map((row) => row.ip_hash).filter(Boolean)
    ).size,
    views7d: views7dRows.length,
    suspicious24h: suspiciousRows.length,
    recentViews: recentQuality as PageViewRow[],
    recentIps: buildRecentIps(ipQuality),
    suspiciousActivity: [...suspiciousByKey.values()]
      .sort((a, b) => b.last_seen.localeCompare(a.last_seen))
      .slice(0, 15),
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
    if (isMissingQualityFilterError(error.message)) {
      return getAnalyticsSummaryLegacy(adminClient);
    }
    if (isMissingRpcError(error.message)) {
      return getAnalyticsSummaryLegacy(adminClient);
    }
    console.error("[analytics] rpc summary:", error.message);
    return getAnalyticsSummaryLegacy(adminClient);
  }

  return emptySummary();
}

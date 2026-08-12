const SKIP_PREFIXES = [
  "/api/",
  "/admin",
  "/auth/",
  "/login",
  "/signup",
  "/account",
  "/_next/",
];

const PATH_LABELS: Record<string, string> = {
  "/": "首頁",
  "/demos": "展示站目錄",
  "/templates": "介面庫",
  "/sketch": "介面草圖",
  "/configure": "方案選配",
  "/summary": "方案摘要",
  "/contact": "聯絡我們",
  "/privacy": "私隱政策",
};

export function shouldTrackPageView(pathname: string): boolean {
  if (!pathname || pathname.length > 500) return false;
  if (/^\/google[0-9a-f]+\.html$/i.test(pathname)) return false;
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return false;
  return pathname.startsWith("/");
}

export function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return /bot|crawl|spider|slurp|facebookexternalhit|preview|headless/i.test(
    userAgent
  );
}

/** Demo iframe embed on /demos — inflates page-view counts. */
export function isDemoEmbedRequest(searchParams: URLSearchParams): boolean {
  return searchParams.get("embed") === "1";
}

/**
 * Count toward general traffic stats (excludes bots, localhost, admin, demo iframes).
 * Suspicious probes are tracked separately via isSuspiciousPath.
 */
export function isQualityPageView(
  pathname: string,
  referrer: string | null,
  userAgent: string | null
): boolean {
  if (!shouldTrackPageView(pathname)) return false;
  if (isBotUserAgent(userAgent)) return false;
  if (referrer && /localhost/i.test(referrer)) return false;
  if (referrer && /\/admin/i.test(referrer)) return false;
  if (
    pathname.startsWith("/demos/") &&
    referrer &&
    /desigpick-digital\.com\/demos\/?($|\?|#)/i.test(referrer)
  ) {
    return false;
  }
  return true;
}

const SUSPICIOUS_PATH_PATTERNS = [
  /^\/wp-admin/i,
  /^\/wp-login/i,
  /^\/wp-content/i,
  /^\/wp-includes/i,
  /^\/wordpress/i,
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/phpmyadmin/i,
  /^\/pma(?:\/|$)/i,
  /xmlrpc\.php/i,
  /^\/admin\.php/i,
  /^\/config\.php/i,
  /^\/\.aws/i,
  /^\/backup/i,
  /^\/cgi-bin/i,
  /^\/vendor\/phpunit/i,
  /^\/actuator/i,
  /^\/shell/i,
  /^\/debug/i,
  /^\/\.ht/i,
  /^\/database/i,
  /^\/sql/i,
];

export function isSuspiciousPath(pathname: string): boolean {
  return SUSPICIOUS_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

export function getSuspiciousPathLabel(path: string): string {
  if (/wp-admin|wordpress|wp-login|wp-content/i.test(path)) {
    return "WordPress 掃描";
  }
  if (/\.env|\.git|\.aws|\.ht/i.test(path)) {
    return "設定檔探測";
  }
  if (/phpmyadmin|pma|sql|database/i.test(path)) {
    return "資料庫探測";
  }
  if (/xmlrpc|admin\.php|shell|cgi-bin|phpunit|actuator/i.test(path)) {
    return "漏洞探測";
  }
  return "可疑路徑";
}

export function formatPathLabel(path: string): string {
  if (PATH_LABELS[path]) return PATH_LABELS[path];

  if (path.startsWith("/demos/")) {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 2) return `Demo · ${parts[1]}`;
    if (parts.length >= 3) return `Demo · ${parts[1]} / ${parts.slice(2).join("/")}`;
  }

  if (path.startsWith("/templates/")) {
    return `模板 · ${path.split("/")[2] ?? path}`;
  }

  return path;
}

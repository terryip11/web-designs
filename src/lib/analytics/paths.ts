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
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return false;
  return pathname.startsWith("/");
}

export function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return /bot|crawl|spider|slurp|facebookexternalhit|preview|headless/i.test(
    userAgent
  );
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

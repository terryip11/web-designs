function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function getAuthCallbackUrl(next = "/account") {
  const base = `${getSiteUrl()}/auth/callback`;
  const safeNext = next.startsWith("/") ? next : "/account";
  return `${base}?next=${encodeURIComponent(safeNext)}`;
}

export { getSiteUrl };

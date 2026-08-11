import { type NextRequest, type NextResponse } from "next/server";
import { resolveClientIp } from "@/lib/analytics/ip";
import { isBotUserAgent, shouldTrackPageView } from "@/lib/analytics/paths";
import {
  VISITOR_COOKIE,
  createVisitorId,
  isValidVisitorId,
} from "@/lib/analytics/visitor-id";

export function enqueuePageViewTrack(
  request: NextRequest,
  response: NextResponse
) {
  if (request.method !== "GET") return;

  const path = request.nextUrl.pathname;
  if (!shouldTrackPageView(path)) return;
  if (isBotUserAgent(request.headers.get("user-agent"))) return;

  let visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  if (!visitorId || !isValidVisitorId(visitorId)) {
    visitorId = createVisitorId();
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  const clientIp = resolveClientIp(
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip")
  );

  const collectUrl = new URL("/api/analytics/collect", request.url);

  void fetch(collectUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path,
      visitorId,
      clientIp,
      referrer: request.headers.get("referer")?.slice(0, 500) ?? null,
      userAgent: request.headers.get("user-agent")?.slice(0, 200) ?? null,
    }),
  }).catch(() => {});
}

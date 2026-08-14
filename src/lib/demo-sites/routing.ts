import { type NextRequest, NextResponse } from "next/server";
import { getDemoBySlug } from "@/lib/demo-sites/registry";

/** 從子網域解析 demo slug，例如 property-luxe-09.desigpick-digital.com */
export function getDemoSlugFromHost(host: string): string | null {
  const root = process.env.NEXT_PUBLIC_DEMO_ROOT_DOMAIN?.toLowerCase();
  if (!root) return null;

  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  if (hostname === root || hostname === `www.${root}`) return null;
  if (!hostname.endsWith(`.${root}`)) return null;

  const subdomain = hostname.slice(0, -(root.length + 1));
  if (!subdomain || subdomain.includes(".")) return null;

  const demo = getDemoBySlug(subdomain);
  return demo?.status === "live" ? demo.slug : null;
}

export function resolveDemoRewrite(request: NextRequest): NextResponse | null {
  const slug = getDemoSlugFromHost(request.headers.get("host") ?? "");
  if (!slug) return null;

  const url = request.nextUrl.clone();
  const suffix = url.pathname === "/" ? "" : url.pathname;
  url.pathname = `/demos/${slug}${suffix}`;
  const response = NextResponse.rewrite(url);
  response.headers.set("x-next-pathname", url.pathname);
  return response;
}

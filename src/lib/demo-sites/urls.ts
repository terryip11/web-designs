import { getDemoByTemplateId } from "@/lib/demo-sites/registry";

export function getDemoPath(templateId: string, subpath = ""): string | null {
  const demo = getDemoByTemplateId(templateId);
  if (!demo || demo.status !== "live") return null;
  const path = subpath.startsWith("/") ? subpath : subpath ? `/${subpath}` : "";
  return `/demos/${demo.templateId}${path}`;
}

export function getDemoSiteUrl(
  templateId: string,
  subpath = "",
  origin?: string
): string | null {
  const demo = getDemoByTemplateId(templateId);
  if (!demo || demo.status !== "live") return null;

  const root = process.env.NEXT_PUBLIC_DEMO_ROOT_DOMAIN;
  if (root) {
    const path = subpath.startsWith("/") ? subpath : subpath ? `/${subpath}` : "";
    return `https://${demo.slug}.${root}${path || "/"}`;
  }

  const base = origin ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const path = getDemoPath(templateId, subpath);
  if (!base || !path) return path;
  return `${base.replace(/\/$/, "")}${path}`;
}

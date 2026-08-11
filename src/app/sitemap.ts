import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/auth/site-url";
import { getPublicSitemapPaths } from "@/lib/seo/sitemap-urls";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return getPublicSitemapPaths().map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/demos/")
      ? ("monthly" as const)
      : path === ""
        ? ("weekly" as const)
        : ("weekly" as const),
    priority: path === "" ? 1 : path.startsWith("/demos/") ? 0.75 : 0.8,
  }));
}

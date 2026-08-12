import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/blog/queries";
import { getSiteUrl } from "@/lib/auth/site-url";
import { getPublicSitemapPaths } from "@/lib/seo/sitemap-urls";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function sitemapEntry(
  base: string,
  path: string,
  lastModified: Date,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
) {
  return {
    url: `${base}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const supabase = createServerClient();
  const posts = await getPublishedBlogPosts(supabase);

  const staticEntries = getPublicSitemapPaths().map((path) =>
    sitemapEntry(
      base,
      path,
      now,
      path === "" ? 1 : path.startsWith("/demos/") ? 0.75 : 0.8,
      path.startsWith("/demos/") ? "monthly" : "weekly"
    )
  );

  const blogEntries = posts.map((post) =>
    sitemapEntry(
      base,
      `/blog/${post.slug}`,
      new Date(post.updatedAt),
      0.7,
      "monthly"
    )
  );

  return [...staticEntries, ...blogEntries];
}

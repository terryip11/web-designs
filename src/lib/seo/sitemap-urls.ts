import templates from "@/data/templates.json";
import { getBlogSlugs } from "@/lib/blog/posts";
import { getLiveDemos } from "@/lib/demo-sites/registry";

export function getPublicSitemapPaths(): string[] {
  const staticPages = [
    "",
    "/templates",
    "/demos",
    "/sketch",
    "/configure",
    "/summary",
    "/contact",
    "/privacy",
    "/blog",
  ];

  const templatePages = templates.map((t) => `/templates/${t.id}`);

  const blogPages = getBlogSlugs().map((slug) => `/blog/${slug}`);

  const demoPages = getLiveDemos().flatMap((demo) =>
    demo.pages.map((page) =>
      page.path ? `/demos/${demo.slug}${page.path}` : `/demos/${demo.slug}`
    )
  );

  return [...staticPages, ...templatePages, ...blogPages, ...demoPages];
}

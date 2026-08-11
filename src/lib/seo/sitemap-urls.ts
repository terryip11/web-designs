import templates from "@/data/templates.json";
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
  ];

  const templatePages = templates.map((t) => `/templates/${t.id}`);

  const demoPages = getLiveDemos().flatMap((demo) =>
    demo.pages.map((page) =>
      page.path ? `/demos/${demo.slug}${page.path}` : `/demos/${demo.slug}`
    )
  );

  return [...staticPages, ...templatePages, ...demoPages];
}

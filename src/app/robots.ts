import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/auth/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/api/", "/auth/", "/login", "/signup"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}

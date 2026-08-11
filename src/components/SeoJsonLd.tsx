import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/auth/site-url";

export default function SeoJsonLd() {
  const siteUrl = getSiteUrl();

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        description: DEFAULT_DESCRIPTION,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "zh-HK",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

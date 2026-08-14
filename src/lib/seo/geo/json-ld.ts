import templates from "@/data/templates.json";
import type { BlogPost } from "@/lib/blog/types";
import { getSiteUrl } from "@/lib/auth/site-url";
import { formatPrice, PRICE_DISCLAIMER } from "@/lib/data";
import {
  DEFAULT_DESCRIPTION,
  SITE_ALTERNATE_NAMES,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/seo/metadata";
import { GEO_FAQ_HOME_PREVIEW_IDS, GEO_FAQ_ITEMS } from "@/lib/seo/geo/faq";

function getOrganizationId(siteUrl: string) {
  return `${siteUrl}/#organization`;
}

function getWebsiteId(siteUrl: string) {
  return `${siteUrl}/#website`;
}

export function buildOrganizationWebSiteGraph() {
  const siteUrl = getSiteUrl();
  const prices = templates.map((t) => t.basePrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": getOrganizationId(siteUrl),
        name: SITE_NAME,
        url: siteUrl,
        description: DEFAULT_DESCRIPTION,
        alternateName: [...SITE_ALTERNATE_NAMES],
        areaServed: {
          "@type": "Country",
          name: "Hong Kong",
        },
        knowsLanguage: ["zh-HK", "zh-Hant"],
      },
      {
        "@type": "WebSite",
        "@id": getWebsiteId(siteUrl),
        url: siteUrl,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "zh-HK",
        publisher: {
          "@id": getOrganizationId(siteUrl),
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#service`,
        name: SITE_NAME,
        url: siteUrl,
        description: `${SITE_TAGLINE}。${DEFAULT_DESCRIPTION}`,
        provider: {
          "@id": getOrganizationId(siteUrl),
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Hong Kong",
        },
        priceRange: `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "HKD",
          lowPrice: minPrice,
          highPrice: maxPrice,
          offerCount: templates.length,
          description: PRICE_DISCLAIMER,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "網站設計模板",
          itemListElement: templates.map((template, index) => ({
            "@type": "Offer",
            position: index + 1,
            name: template.name,
            category: template.category,
            price: template.basePrice,
            priceCurrency: "HKD",
            url: `${siteUrl}/templates/${template.id}`,
            description: template.suitableFor,
          })),
        },
      },
    ],
  };
}

export function buildFaqPageGraph() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/faq#faq`,
    url: `${siteUrl}/faq`,
    inLanguage: "zh-HK",
    mainEntity: GEO_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      "@id": `${siteUrl}/faq#${item.id}`,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildHomeFaqPreviewGraph() {
  const siteUrl = getSiteUrl();
  const items = GEO_FAQ_HOME_PREVIEW_IDS.map((id) =>
    GEO_FAQ_ITEMS.find((item) => item.id === id)
  ).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq-preview`,
    url: siteUrl,
    inLanguage: "zh-HK",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      "@id": `${siteUrl}/faq#${item!.id}`,
      name: item!.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item!.answer,
      },
    })),
  };
}

export function buildArticleGraph(post: BlogPost) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: "zh-HK",
    url,
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
    keywords: post.tags.join(", "),
    timeRequired: `PT${post.readingMinutes}M`,
  };
}

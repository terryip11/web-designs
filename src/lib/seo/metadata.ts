import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/auth/site-url";

export const SITE_NAME = "desigpick-digital";
export const SITE_ALTERNATE_NAMES = ["desigpick-digital"] as const;
export const SITE_TAGLINE = "網站設計選配平台";
export const DEFAULT_DESCRIPTION =
  "瀏覽介面樣式、選擇功能模組，快速組合您的專屬網站方案。香港市場參考報價（HKD），完整 Demo 展示站供客戶預覽。";

export function getMetadataBase(): URL {
  return new URL(`${getSiteUrl()}/`);
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      locale: "zh_HK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}

export function getRootMetadata(): Metadata {
  const defaultTitle = `${SITE_NAME} — ${SITE_TAGLINE}`;

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: defaultTitle,
      template: `%s — ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: defaultTitle,
      description: DEFAULT_DESCRIPTION,
      url: "/",
      siteName: SITE_NAME,
      locale: "zh_HK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: DEFAULT_DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    appleWebApp: {
      capable: true,
      title: SITE_NAME,
      statusBarStyle: "black-translucent",
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export function buildDemoMetadata(
  title: string,
  description: string,
  demoId: string,
  subpath = ""
) {
  return buildPageMetadata({
    title,
    description,
    path: `/demos/${demoId}${subpath}`,
  });
}

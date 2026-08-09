export type DemoSiteStatus = "live" | "coming-soon";

export interface DemoSiteConfig {
  templateId: string;
  /** 子網域 slug，例如 property-luxe-09.example.com */
  slug: string;
  brandName: string;
  tagline: string;
  status: DemoSiteStatus;
  pages: { path: string; label: string }[];
}

export const DEMO_SITES: DemoSiteConfig[] = [
  {
    templateId: "property-luxe-09",
    slug: "property-luxe-09",
    brandName: "麗致物業",
    tagline: "香港高端住宅 · 商業物業",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/listings", label: "樓盤搜尋" },
      { path: "/properties/the-peak-residence", label: "物業詳情" },
      { path: "/about", label: "關於" },
      { path: "/contact", label: "聯絡" },
    ],
  },
  {
    templateId: "restaurant-warm-01",
    slug: "restaurant-warm-01",
    brandName: "暖色餐廳",
    tagline: "精緻餐飲體驗",
    status: "coming-soon",
    pages: [],
  },
  {
    templateId: "medical-trust-05",
    slug: "medical-trust-05",
    brandName: "信賴醫療中心",
    tagline: "專業可信赖的醫療服務",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/services", label: "服務項目" },
      { path: "/doctors", label: "醫師團隊" },
      { path: "/booking", label: "預約" },
      { path: "/contact", label: "聯絡" },
    ],
  },
  {
    templateId: "corporate-clean-03",
    slug: "corporate-clean-03",
    brandName: "企業官網",
    tagline: "專業 B2B 服務",
    status: "coming-soon",
    pages: [],
  },
  {
    templateId: "ecommerce-dark-02",
    slug: "ecommerce-dark-02",
    brandName: "質感電商",
    tagline: "高端線上購物體驗",
    status: "coming-soon",
    pages: [],
  },
  {
    templateId: "tech-saas-12",
    slug: "tech-saas-12",
    brandName: "科技 SaaS",
    tagline: "現代化產品展示",
    status: "coming-soon",
    pages: [],
  },
];

export function getDemoByTemplateId(templateId: string): DemoSiteConfig | undefined {
  return DEMO_SITES.find((d) => d.templateId === templateId);
}

export function getDemoBySlug(slug: string): DemoSiteConfig | undefined {
  return DEMO_SITES.find((d) => d.slug === slug);
}

export function getLiveDemos(): DemoSiteConfig[] {
  return DEMO_SITES.filter((d) => d.status === "live");
}

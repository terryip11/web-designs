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
    brandName: "暖色小館",
    tagline: "精緻地中海風味 · 中環",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/menu", label: "菜單" },
      { path: "/about", label: "關於" },
      { path: "/reservations", label: "訂位" },
      { path: "/contact", label: "聯絡" },
    ],
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
    brandName: "銳思顧問",
    tagline: "策略 · 營運 · 數碼轉型",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/services", label: "服務" },
      { path: "/team", label: "團隊" },
      { path: "/cases", label: "案例" },
      { path: "/contact", label: "聯絡" },
    ],
  },
  {
    templateId: "ecommerce-dark-02",
    slug: "ecommerce-dark-02",
    brandName: "NOIR 選物",
    tagline: "精選設計師單品 · 質感生活",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/products", label: "商品" },
      { path: "/products/linen-blazer", label: "商品詳情" },
      { path: "/cart", label: "購物車" },
      { path: "/about", label: "關於" },
      { path: "/contact", label: "聯絡" },
    ],
  },
  {
    templateId: "tech-saas-12",
    slug: "tech-saas-12",
    brandName: "FlowStack",
    tagline: "工作流自動化 · 團隊效率平台",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/features", label: "功能" },
      { path: "/pricing", label: "定價" },
      { path: "/customers", label: "客戶案例" },
      { path: "/contact", label: "聯絡" },
    ],
  },
  {
    templateId: "portfolio-creative-04",
    slug: "portfolio-creative-04",
    brandName: "墨境創作",
    tagline: "品牌視覺 · 平面設計 · 創意策劃",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/about", label: "關於" },
      { path: "/services", label: "服務" },
      { path: "/contact", label: "聯絡" },
    ],
  },
  {
    templateId: "education-bright-06",
    slug: "education-bright-06",
    brandName: "明光教育中心",
    tagline: "中小學補習 · 升學規劃",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/about", label: "關於" },
      { path: "/services", label: "課程" },
      { path: "/contact", label: "聯絡" },
    ],
  },
  {
    templateId: "beauty-elegant-07",
    slug: "beauty-elegant-07",
    brandName: "悅姿美容",
    tagline: "專業護膚 · 醫美級療程",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/about", label: "關於" },
      { path: "/services", label: "療程" },
      { path: "/contact", label: "聯絡" },
    ],
  },
  {
    templateId: "fitness-energy-08",
    slug: "fitness-energy-08",
    brandName: "動能健身",
    tagline: "私人教練 · 小組訓練",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/about", label: "關於" },
      { path: "/services", label: "課程" },
      { path: "/contact", label: "聯絡" },
    ],
  },
  {
    templateId: "hotel-resort-10",
    slug: "hotel-resort-10",
    brandName: "海灣度假酒店",
    tagline: "海景度假 · 水療 · 婚宴",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/about", label: "關於" },
      { path: "/services", label: "設施" },
      { path: "/contact", label: "聯絡" },
    ],
  },
  {
    templateId: "wedding-romantic-11",
    slug: "wedding-romantic-11",
    brandName: "誓約婚禮策劃",
    tagline: "婚禮統籌 · 場地佈置",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/about", label: "關於" },
      { path: "/services", label: "服務" },
      { path: "/contact", label: "聯絡" },
    ],
  },
  {
    templateId: "ngo-warm-13",
    slug: "ngo-warm-13",
    brandName: "暖光社區協會",
    tagline: "長者支援 · 基層家庭",
    status: "live",
    pages: [
      { path: "", label: "首頁" },
      { path: "/about", label: "關於" },
      { path: "/services", label: "項目" },
      { path: "/contact", label: "聯絡" },
    ],
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

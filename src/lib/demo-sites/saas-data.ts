import { demoImage } from "@/lib/images/url";

export const SAAS_BRAND = {
  name: "FlowStack",
  englishName: "FlowStack",
  phone: "+852 3900 1200",
  email: "hello@flowstack.io",
  address: "香港數碼港 3 座 12 樓",
  tagline: "一站式工作流自動化 · 讓團隊專注真正重要的事",
};

export interface SaasFeature {
  slug: string;
  title: string;
  summary: string;
  icon: string;
}

export interface SaasPlan {
  slug: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface SaasCustomer {
  slug: string;
  company: string;
  industry: string;
  quote: string;
  author: string;
  role: string;
  logo: string;
}

export const SAAS_FEATURES: SaasFeature[] = [
  {
    slug: "automation",
    title: "視覺化自動化",
    summary: "拖拉式流程設計，連接 Slack、Google Workspace 及 200+ 工具。",
    icon: "zap",
  },
  {
    slug: "analytics",
    title: "即時分析",
    summary: "追蹤流程瓶頸、完成率及團隊效率，數據驅動優化。",
    icon: "chart",
  },
  {
    slug: "security",
    title: "企業級安全",
    summary: "SOC 2 合規、SSO 及細粒度權限，保障敏感資料。",
    icon: "lock",
  },
  {
    slug: "collaboration",
    title: "跨團隊協作",
    summary: "評論、@提及及版本紀錄，減少來回溝通。",
    icon: "users",
  },
];

export const SAAS_PLANS: SaasPlan[] = [
  {
    slug: "starter",
    name: "Starter",
    price: "HK$299",
    period: "/ 月",
    description: "適合 5 人以下小團隊",
    features: ["10 個活躍流程", "基礎整合", "Email 支援", "7 天活動紀錄"],
  },
  {
    slug: "pro",
    name: "Pro",
    price: "HK$899",
    period: "/ 月",
    description: "成長型團隊首選",
    features: ["無限流程", "進階整合 + API", "優先支援", "90 天活動紀錄", "SSO"],
    highlighted: true,
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    price: "客製報價",
    period: "",
    description: "大型組織及合規需求",
    features: ["專屬客戶經理", "SLA 保證", "私有部署選項", "客製整合", "合規審計支援"],
  },
];

export const SAAS_CUSTOMERS: SaasCustomer[] = [
  {
    slug: "nova-retail",
    company: "Nova Retail",
    industry: "零售科技",
    quote: "FlowStack 幫我們把訂單處理時間從 2 小時縮短到 15 分鐘。",
    author: "陳穎欣",
    role: "營運總監",
    logo: demoImage("demos/saas/customers/nova-retail.jpg"),
  },
  {
    slug: "apex-legal",
    company: "Apex Legal",
    industry: "法律科技",
    quote: "合約審批流程完全數碼化，合規審計一次過關。",
    author: "David Wong",
    role: "合夥人",
    logo: demoImage("demos/saas/customers/apex-legal.jpg"),
  },
  {
    slug: "green-logistics",
    company: "Green Logistics",
    industry: "物流",
    quote: "跨部門協作透明化，客戶投訴率下降 30%。",
    author: "李美儀",
    role: "CEO",
    logo: demoImage("demos/saas/customers/green-logistics.jpg"),
  },
];

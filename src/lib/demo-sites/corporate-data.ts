export const CORPORATE_BRAND = {
  name: "銳思顧問",
  englishName: "Sharp Advisory",
  phone: "+852 3902 8800",
  email: "hello@sharpadvisory.hk",
  address: "香港中環皇后大道中 99 號 28 樓",
  tagline: "策略、營運與數碼轉型 · 助力企業持續成長",
};

export interface CorporateService {
  slug: string;
  title: string;
  summary: string;
  icon: string;
}

export interface CorporateTeamMember {
  slug: string;
  name: string;
  title: string;
  bio: string;
  image: string;
}

export interface CorporateCase {
  slug: string;
  client: string;
  industry: string;
  title: string;
  result: string;
  image: string;
}

export const CORPORATE_SERVICES: CorporateService[] = [
  {
    slug: "strategy",
    title: "策略顧問",
    summary: "市場進入、競爭定位及三年路線圖，協助管理層做出可執行決策。",
    icon: "target",
  },
  {
    slug: "operations",
    title: "營運優化",
    summary: "流程梳理、成本結構分析及 KPI 設計，提升組織效率。",
    icon: "workflow",
  },
  {
    slug: "digital",
    title: "數碼轉型",
    summary: "CRM、自動化及數據儀表板規劃，縮短從策略到落地的距離。",
    icon: "cpu",
  },
  {
    slug: "compliance",
    title: "合規與風險",
    summary: "政策審閱、內控框架及培訓，符合香港及跨境監管要求。",
    icon: "shield",
  },
];

export const CORPORATE_TEAM: CorporateTeamMember[] = [
  {
    slug: "alex-cheng",
    name: "鄭立言",
    title: "管理合夥人",
    bio: "前四大顧問，專注金融及專業服務業策略項目。",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
  },
  {
    slug: "michelle-yip",
    name: "葉美玲",
    title: "營運總監",
    bio: "15 年營運顧問經驗，擅長零售及物流流程再造。",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
  },
  {
    slug: "david-ho",
    name: "何俊傑",
    title: "數碼轉型主管",
    bio: "帶領超過 30 個 CRM 及數據平台落地項目。",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
  },
];

export const CORPORATE_CASES: CorporateCase[] = [
  {
    slug: "fintech-expansion",
    client: "某金融科技公司",
    industry: "金融科技",
    title: "東南亞市場進入策略",
    result: "6 個月內完成 3 地合規評估及合作夥伴篩選，成功啟動試點。",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    slug: "retail-ops",
    client: "連鎖零售品牌",
    industry: "零售",
    title: "門店營運效率提升",
    result: "庫存周轉提升 22%，前線培訓週期縮短 40%。",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  },
  {
    slug: "law-digital",
    client: "本地律師行",
    industry: "專業服務",
    title: "知識管理系統上線",
    result: "案件檢索時間減少 55%，合規審計一次通過。",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
];

export function getCorporateCase(slug: string) {
  return CORPORATE_CASES.find((c) => c.slug === slug);
}

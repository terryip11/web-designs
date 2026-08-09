export interface PropertyListing {
  slug: string;
  title: string;
  district: string;
  price: string;
  priceLabel: string;
  beds: number;
  baths: number;
  area: number;
  type: string;
  featured?: boolean;
  image: string;
  summary: string;
  highlights: string[];
}

export const PROPERTY_BRAND = {
  name: "麗致物業",
  englishName: "Luxe Realty",
  phone: "+852 2888 6600",
  email: "hello@luxerealty.hk",
  address: "香港中環皇后大道中 88 號 28 樓",
  whatsapp: "85291234567",
};

export const PROPERTY_LISTINGS: PropertyListing[] = [
  {
    slug: "the-peak-residence",
    title: "山頂御峰 · 全海景複式",
    district: "山頂",
    price: "88000000",
    priceLabel: "HK$8,800 萬",
    beds: 4,
    baths: 3,
    area: 2850,
    type: "出售",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    summary:
      "罕有山頂複式單位，270 度維港全景，私人電梯直達，配備恆溫酒窖與家庭影院。",
    highlights: ["維港全海景", "私人電梯", "雙車位", "會所設施"],
  },
  {
    slug: "mid-levels-penthouse",
    title: "半山壹號 · 高層複式",
    district: "半山",
    price: "42000000",
    priceLabel: "HK$4,200 萬",
    beds: 3,
    baths: 2,
    area: 1680,
    type: "出售",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    summary: "半山傳統豪宅區，高層複式連天台，採光充足，步行至 Central 約 12 分鐘。",
    highlights: ["連私人天台", "步行至 Central", "新裝修", "會所泳池"],
  },
  {
    slug: "kowloon-station-tower",
    title: "天璽 · 高層三房",
    district: "九龍站",
    price: "26800000",
    priceLabel: "HK$2,680 萬",
    beds: 3,
    baths: 2,
    area: 1120,
    type: "出售",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    summary: "九龍核心樞紐，高鐵及機場快線上蓋，適合跨境家庭及投資客。",
    highlights: ["交通樞紐", "機場快線", "圓方購物", "高層景觀"],
  },
  {
    slug: "repulse-bay-villa",
    title: "淺水灣花園 · 獨立屋",
    district: "淺水灣",
    price: "120000000",
    priceLabel: "HK$1.2 億",
    beds: 5,
    baths: 4,
    area: 4200,
    type: "出售",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed4cd6?w=1200&q=80",
    summary: "淺水灣傳統豪宅，私人大花園連泳池，環境清幽，私隱度極高。",
    highlights: ["私人泳池", "大花園", "近 beach", "雙車庫"],
  },
  {
    slug: "central-office-suite",
    title: "國際金融中心 · 甲級寫字樓",
    district: "中環",
    price: "85000",
    priceLabel: "HK$85,000 / 月",
    beds: 0,
    baths: 2,
    area: 2400,
    type: "出租",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    summary: "IFC 高層全層或半層，維港景觀，適合金融及專業服務機構。",
    highlights: ["甲級寫字樓", "全海景", "地鐵直達", "高端配套"],
  },
  {
    slug: "tseung-kwan-o-new",
    title: "康城 · 全新三房",
    district: "將軍澳",
    price: "9800000",
    priceLabel: "HK$980 萬",
    beds: 3,
    baths: 2,
    area: 680,
    type: "出售",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f84d663ca?w=1200&q=80",
    summary: "全新樓盤，高性價比三房，鄰近大型商場及地鐵站，適合首置家庭。",
    highlights: ["全新樓", "近地鐵", "大型商場", "會所設施"],
  },
];

export function getPropertyBySlug(slug: string): PropertyListing | undefined {
  return PROPERTY_LISTINGS.find((p) => p.slug === slug);
}

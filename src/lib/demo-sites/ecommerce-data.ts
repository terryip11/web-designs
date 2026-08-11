import { demoImage } from "@/lib/images/url";

export const ECOMMERCE_BRAND = {
  name: "NOIR 選物",
  englishName: "NOIR Curated",
  phone: "+852 2888 6600",
  email: "hello@noircurated.hk",
  address: "香港銅鑼灣 Fashion Walk 2 樓",
  tagline: "精選設計師單品 · 質感生活從細節開始",
};

export interface EcommerceProduct {
  slug: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  tags?: string[];
}

export const ECOMMERCE_PRODUCTS: EcommerceProduct[] = [
  {
    slug: "linen-blazer",
    name: "亞麻休閒西裝外套",
    category: "服飾",
    price: "HK$1,680",
    description: "意大利亞麻混紡，輕盈透氣，適合春夏通勤。",
    image: demoImage("demos/ecommerce/products/linen-blazer.jpg"),
    tags: ["新品"],
  },
  {
    slug: "ceramic-vase",
    name: "手工陶瓷花瓶",
    category: "家居",
    price: "HK$580",
    description: "本地陶藝師手作，每件紋理獨一無二。",
    image: demoImage("demos/ecommerce/products/ceramic-vase.jpg"),
  },
  {
    slug: "leather-tote",
    name: "植鞣革托特包",
    category: "配件",
    price: "HK$2,280",
    description: "全粒面牛皮，可放 13 吋筆電，附可拆肩帶。",
    image: demoImage("demos/ecommerce/products/leather-tote.jpg"),
    tags: ["熱賣"],
  },
  {
    slug: "silk-scarf",
    name: "真絲方巾",
    category: "配件",
    price: "HK$720",
    description: "100% 桑蠶絲，手工捲邊，適合送禮。",
    image: demoImage("demos/ecommerce/products/silk-scarf.jpg"),
  },
  {
    slug: "minimal-watch",
    name: "極簡機械錶",
    category: "腕錶",
    price: "HK$4,800",
    description: "日本自動機芯，藍寶石水晶镜面，防水 50m。",
    image: demoImage("demos/ecommerce/products/minimal-watch.jpg"),
  },
  {
    slug: "soy-candle",
    name: "大豆蠟香氛蠟燭",
    category: "家居",
    price: "HK$320",
    description: "雪松與佛手柑調，燃燒時間約 45 小時。",
    image: demoImage("demos/ecommerce/products/soy-candle.jpg"),
  },
];

export function getProductBySlug(slug: string) {
  return ECOMMERCE_PRODUCTS.find((p) => p.slug === slug);
}

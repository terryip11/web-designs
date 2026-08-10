export const RESTAURANT_BRAND = {
  name: "暖色小館",
  englishName: "Warm Table",
  phone: "+852 2521 6688",
  email: "hello@warmtable.hk",
  address: "香港中環荷李活道 28 號",
  hours: "週二至週日 12:00 – 22:00 · 週一休息",
  whatsapp: "85291234567",
  tagline: "以季節食材，現代詮釋地中海風味",
};

export type MenuCategory = "starters" | "mains" | "desserts" | "drinks";

export interface MenuItem {
  slug: string;
  category: MenuCategory;
  title: string;
  description: string;
  price: string;
  image: string;
  tags?: string[];
}

export const MENU_CATEGORY_LABELS: Record<MenuCategory, string> = {
  starters: "前菜",
  mains: "主餐",
  desserts: "甜品",
  drinks: "飲品",
};

export const MENU_ITEMS: MenuItem[] = [
  {
    slug: "burrata-tomato",
    category: "starters",
    title: "布拉塔芝士配慢烤番茄",
    description: "新鮮布拉塔、聖馬利諾番茄、羅勒油及酸種麵包。",
    price: "HK$128",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
    tags: ["素食"],
  },
  {
    slug: "octopus-citrus",
    category: "starters",
    title: "炭烤八爪魚配柑橘",
    description: "慢煮八爪魚、血橙、茴香及橄欖油乳化。",
    price: "HK$168",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80",
  },
  {
    slug: "mushroom-soup",
    category: "starters",
    title: "野生蘑菇濃湯",
    description: "混合野菇、松露油及脆麵包粒。",
    price: "HK$88",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    tags: ["素食"],
  },
  {
    slug: "sea-bass",
    category: "mains",
    title: "香煎海鱸配番紅花燉飯",
    description: "本地海鱸、番紅花 risotto、蘆筍及檸檬奶油。",
    price: "HK$268",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
  },
  {
    slug: "lamb-rack",
    category: "mains",
    title: "迷迭香羊架",
    description: "紐西蘭羊架、迷迭香 jus、烤根菜及土豆泥。",
    price: "HK$328",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
  },
  {
    slug: "pasta-prawn",
    category: "mains",
    title: "手工寬帶麵配大蝦",
    description: "每日手作寬帶麵、虎蝦、番茄及白酒醬。",
    price: "HK$198",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
  },
  {
    slug: "risotto-truffle",
    category: "mains",
    title: "黑松露野菇燉飯",
    description: "阿博里奥米、混合野菇、帕玛森及黑松露。",
    price: "HK$218",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
    tags: ["素食"],
  },
  {
    slug: "tiramisu",
    category: "desserts",
    title: "經典提拉米蘇",
    description: "馬斯卡彭、濃縮咖啡及可可粉，每日現做。",
    price: "HK$78",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
  },
  {
    slug: "panna-cotta",
    category: "desserts",
    title: "番石榴奶凍",
    description: "香草奶凍、番石榴啫喱及開心果碎。",
    price: "HK$72",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
    tags: ["無麩質"],
  },
  {
    slug: "espresso",
    category: "drinks",
    title: "單品濃縮咖啡",
    description: "每日烘焙，可選雙份。",
    price: "HK$38",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
  },
  {
    slug: "house-wine",
    category: "drinks",
    title: "侍酒師精選紅／白酒",
    description: "杯賣或瓶賣，請向店員查詢當日酒單。",
    price: "HK$88 起",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
  },
  {
    slug: "sparkling-lemon",
    category: "drinks",
    title: "自制氣泡檸檬梳打",
    description: "新鮮檸檬、迷迭香及氣泡水，無添加糖。",
    price: "HK$48",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
    tags: ["無酒精"],
  },
];

export function getMenuItemsByCategory(category: MenuCategory): MenuItem[] {
  return MENU_ITEMS.filter((item) => item.category === category);
}

export function getMenuItemBySlug(slug: string): MenuItem | undefined {
  return MENU_ITEMS.find((item) => item.slug === slug);
}

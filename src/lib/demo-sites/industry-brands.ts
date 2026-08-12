export interface IndustryBrand {
  templateId: string;
  name: string;
  englishName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  heroImage: string;
  aboutImage: string;
  initials: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  aboutTitle: string;
  aboutBody: string[];
  stats: { value: string; label: string }[];
  services: { title: string; summary: string }[];
  ctaLabel: string;
}

export const INDUSTRY_BRANDS: Record<string, IndustryBrand> = {
  "portfolio-creative-04": {
    templateId: "portfolio-creative-04",
    name: "墨境創作",
    englishName: "Ink Studio",
    tagline: "品牌視覺 · 平面設計 · 創意策劃",
    phone: "+852 6123 4567",
    email: "hello@inkstudio.hk",
    address: "香港仔黃竹坑道 28 號",
    primaryColor: "#7C3AED",
    accentColor: "#A78BFA",
    textColor: "#1E1B4B",
    heroImage: "demos/shared/about-hero.jpg",
    aboutImage: "demos/corporate/hero.jpg",
    initials: "IS",
    heroTitle: "用設計",
    heroHighlight: "說好品牌故事",
    heroDescription: "為中小企、文化機構同新創品牌打造具辨識度的視覺系統。",
    aboutTitle: "關於墨境創作",
    aboutBody: [
      "我們相信好設計不止係靚，更要幫品牌同受眾建立清晰連結。",
      "服務涵蓋品牌識別、網站視覺、社交媒體素材同印刷品設計。",
    ],
    stats: [
      { value: "120+", label: "完成專案" },
      { value: "8", label: "年經驗" },
      { value: "40+", label: "合作品牌" },
      { value: "98%", label: "準時交付" },
    ],
    services: [
      { title: "品牌識別", summary: "Logo、色彩、字體同品牌指南" },
      { title: "網站視覺", summary: "Landing page 同 UI 設計稿" },
      { title: "社交素材", summary: "Instagram、Facebook 視覺模板" },
      { title: "印刷設計", summary: "名片、海報、宣傳品" },
    ],
    ctaLabel: "預約諮詢",
  },
  "education-bright-06": {
    templateId: "education-bright-06",
    name: "明光教育中心",
    englishName: "Bright Learning",
    tagline: "中小學補習 · 升學規劃 · 專注學習",
    phone: "+852 2345 6789",
    email: "info@brightlearning.hk",
    address: "九龍塘達之路 88 號",
    primaryColor: "#2563EB",
    accentColor: "#60A5FA",
    textColor: "#1E3A5F",
    heroImage: "demos/corporate/hero.jpg",
    aboutImage: "demos/shared/about-hero.jpg",
    initials: "BL",
    heroTitle: "點亮",
    heroHighlight: "每個孩子的潛能",
    heroDescription: "小班教學、個人化進度追蹤，協助 DSE 同國際課程學生穩步提升。",
    aboutTitle: "關於明光教育",
    aboutBody: [
      "成立於 2012 年，專注香港本地同國際學校學生的學術支援。",
      "導師團隊具備豐富公開試評卷同升學輔導經驗。",
    ],
    stats: [
      { value: "2,500+", label: "學生人次" },
      { value: "15", label: "專科導師" },
      { value: "92%", label: "家長推薦" },
      { value: "12", label: "年營運" },
    ],
    services: [
      { title: "DSE 補習", summary: "中文、英文、數學、通識等核心科目" },
      { title: "國際課程", summary: "IGCSE、IB、A-Level 專班" },
      { title: "升學規劃", summary: "選科、JUPAS 同海外升學諮詢" },
      { title: "暑期密集班", summary: "短時強化基礎同試題操練" },
    ],
    ctaLabel: "預約試堂",
  },
  "beauty-elegant-07": {
    templateId: "beauty-elegant-07",
    name: "悅姿美容",
    englishName: "Élégance Beauty",
    tagline: "專業護膚 · 醫美級療程 · 中環",
    phone: "+852 2890 1234",
    email: "book@elegancebeauty.hk",
    address: "中環皇后大道中 99 號",
    primaryColor: "#BE185D",
    accentColor: "#F9A8D4",
    textColor: "#4A044E",
    heroImage: "demos/medical/hero.jpg",
    aboutImage: "demos/shared/about-hero.jpg",
    initials: "EB",
    heroTitle: "綻放",
    heroHighlight: "你的自然美",
    heroDescription: "結合皮膚科學同細緻手藝，提供個人化面部及身體護理療程。",
    aboutTitle: "關於悅姿美容",
    aboutBody: [
      "所有療程由持牌美容師主理，使用經認證嘅護膚品牌。",
      "首次到訪提供免費皮膚分析同療程建議。",
    ],
    stats: [
      { value: "10+", label: "年經驗" },
      { value: "6,000+", label: "服務人次" },
      { value: "4.9", label: "Google 評分" },
      { value: "18", label: "療程項目" },
    ],
    services: [
      { title: "面部護理", summary: "深層清潔、保濕、抗老療程" },
      { title: "醫美級護理", summary: "LED、射頻同導入療程" },
      { title: "身體護理", summary: "排毒、緊緻同淋巴按摩" },
      { title: "新娘套餐", summary: "婚前皮膚調理計劃" },
    ],
    ctaLabel: "預約療程",
  },
  "fitness-energy-08": {
    templateId: "fitness-energy-08",
    name: "動能健身",
    englishName: "Pulse Fitness",
    tagline: "私人教練 · 小組訓練 · 銅鑼灣",
    phone: "+852 2789 5678",
    email: "join@pulsefitness.hk",
    address: "銅鑼灣軒尼詩道 500 號",
    primaryColor: "#EA580C",
    accentColor: "#FB923C",
    textColor: "#431407",
    heroImage: "demos/ecommerce/hero.jpg",
    aboutImage: "demos/corporate/hero.jpg",
    initials: "PF",
    heroTitle: "突破",
    heroHighlight: "你的極限",
    heroDescription: "科學化訓練計劃，配合營養建議，助你在 12 週內看見改變。",
    aboutTitle: "關於動能健身",
    aboutBody: [
      "場館配備完整力量同有氧設備，並設獨立功能性訓練區。",
      "教練均持有 ACSM / NASM 等國際認證。",
    ],
    stats: [
      { value: "800+", label: "活躍會員" },
      { value: "12", label: "認證教練" },
      { value: "24/7", label: "會員通行" },
      { value: "3", label: "分店" },
    ],
    services: [
      { title: "私人教練", summary: "一對一度身訓練計劃" },
      { title: "小組課程", summary: "HIIT、瑜伽、拳擊有氧" },
      { title: "企業 wellness", summary: "公司團體健康計劃" },
      { title: "營養諮詢", summary: "配合訓練嘅飲食建議" },
    ],
    ctaLabel: "預約體驗",
  },
  "hotel-resort-10": {
    templateId: "hotel-resort-10",
    name: "海灣度假酒店",
    englishName: "Bayview Resort",
    tagline: "海景度假 · 水療 · 婚宴場地",
    phone: "+852 3555 8888",
    email: "reservations@bayviewresort.hk",
    address: "大嶼山愉景北徑 1 號",
    primaryColor: "#0D9488",
    accentColor: "#5EEAD4",
    textColor: "#134E4A",
    heroImage: "demos/property/hero.jpg",
    aboutImage: "demos/shared/about-hero.jpg",
    initials: "BR",
    heroTitle: "遠離繁囂",
    heroHighlight: "擁抱海天一色",
    heroDescription: "180 間海景客房、無邊際泳池同米其林推介餐廳，打造完美假期。",
    aboutTitle: "關於海灣度假",
    aboutBody: [
      "酒店坐擁私人海灘，車程 25 分鐘直達機場同迪士尼。",
      "提供婚宴、企業 retreat 同家庭度假套餐。",
    ],
    stats: [
      { value: "180", label: "海景客房" },
      { value: "4.8", label: "TripAdvisor" },
      { value: "3", label: "餐廳酒吧" },
      { value: "25min", label: "至機場" },
    ],
    services: [
      { title: "海景住宿", summary: "標準至總統套房選擇" },
      { title: "水療中心", summary: "泰式按摩同熱石療程" },
      { title: "婚宴場地", summary: "戶外海濱同宴會廳" },
      { title: "企業 retreat", summary: "會議室同團建活動" },
    ],
    ctaLabel: "查詢房價",
  },
  "wedding-romantic-11": {
    templateId: "wedding-romantic-11",
    name: "誓約婚禮策劃",
    englishName: "Vow & Co.",
    tagline: "婚禮統籌 · 場地佈置 · 香港及海外",
    phone: "+852 9012 3456",
    email: "hello@vowandco.hk",
    address: "尖沙咀廣東道 30 號",
    primaryColor: "#DB2777",
    accentColor: "#FBCFE8",
    textColor: "#831843",
    heroImage: "demos/restaurant/hero-dining.jpg",
    aboutImage: "demos/shared/about-hero.jpg",
    initials: "VC",
    heroTitle: "見證",
    heroHighlight: "你們的愛",
    heroDescription: "由求婚到婚宴，一站式婚禮策劃，讓每個細節都承載你們嘅故事。",
    aboutTitle: "關於誓約",
    aboutBody: [
      "過去八年為 300 對新人打造難忘婚禮，風格由法式浪漫到現代簡約。",
      "提供場地搜尋、供應商協調同當日統籌服務。",
    ],
    stats: [
      { value: "300+", label: "完成婚禮" },
      { value: "8", label: "年經驗" },
      { value: "15", label: "合作場地" },
      { value: "100%", label: "當日統籌" },
    ],
    services: [
      { title: "全案策劃", summary: "由概念到執行嘅完整婚禮統籌" },
      { title: "場地佈置", summary: "花藝、燈光同舞台設計" },
      { title: "當日統籌", summary: "現場流程同供應商管理" },
      { title: "海外婚禮", summary: "日本、峇里、歐洲目的地婚禮" },
    ],
    ctaLabel: "預約諮詢",
  },
  "ngo-warm-13": {
    templateId: "ngo-warm-13",
    name: "暖光社區協會",
    englishName: "Warm Light NGO",
    tagline: "長者支援 · 基層家庭 · 社區連結",
    phone: "+852 2234 5678",
    email: "contact@warmlight.org.hk",
    address: "深水埗汝州街 88 號",
    primaryColor: "#D97706",
    accentColor: "#FCD34D",
    textColor: "#78350F",
    heroImage: "demos/shared/about-hero.jpg",
    aboutImage: "demos/corporate/hero.jpg",
    initials: "WL",
    heroTitle: "用行動",
    heroHighlight: "溫暖社區",
    heroDescription: "為長者同基層家庭提供探訪、物資支援同技能培訓，共建關愛社區。",
    aboutTitle: "關於暖光",
    aboutBody: [
      "註冊慈善機構，過去十年服務超過 5,000 個家庭。",
      "歡迎義工、企業合作同定期捐款支持。",
    ],
    stats: [
      { value: "5,000+", label: "受惠家庭" },
      { value: "200+", label: "活躍義工" },
      { value: "10", label: "年服務" },
      { value: "12", label: "社區據點" },
    ],
    services: [
      { title: "長者探訪", summary: "每週探訪獨居長者" },
      { title: "食物援助", summary: "糧食包同節日關懷" },
      { title: "技能培訓", summary: "基層青年就業支援" },
      { title: "企業義工", summary: "團隊建設同社區服務日" },
    ],
    ctaLabel: "支持我們",
  },
};

export function getIndustryBrand(templateId: string): IndustryBrand | null {
  return INDUSTRY_BRANDS[templateId] ?? null;
}

export function isIndustryTemplate(templateId: string): boolean {
  return templateId in INDUSTRY_BRANDS;
}

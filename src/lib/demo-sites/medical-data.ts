export const MEDICAL_BRAND = {
  name: "信賴醫療中心",
  englishName: "Trust Medical Centre",
  phone: "+852 2818 8800",
  email: "hello@trustmedical.hk",
  address: "香港銅鑼灣告士打道 311 號 15 樓",
  hours: "週一至週六 9:00 – 19:00 · 週日及公眾假期休息",
  whatsapp: "85291234567",
};

export interface MedicalService {
  slug: string;
  title: string;
  summary: string;
  duration: string;
  priceFrom: string;
  image: string;
}

export interface MedicalDoctor {
  slug: string;
  name: string;
  title: string;
  specialty: string;
  credentials: string[];
  image: string;
}

export const MEDICAL_SERVICES: MedicalService[] = [
  {
    slug: "general-checkup",
    title: "全面健康檢查",
    summary: "包含血液、心電圖及醫生面談，適合年度體檢或入職前檢查。",
    duration: "約 90 分鐘",
    priceFrom: "HK$2,800 起",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
  },
  {
    slug: "dental-care",
    title: "牙科護理",
    summary: "洗牙、補牙及初步口腔評估，採用數位影像輔助診斷。",
    duration: "約 45 分鐘",
    priceFrom: "HK$680 起",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e37737a753?w=800&q=80",
  },
  {
    slug: "physiotherapy",
    title: "物理治療",
    summary: "運動創傷、肩頸痛及術後復康，由註冊物理治療師跟進。",
    duration: "約 60 分鐘",
    priceFrom: "HK$850 起",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
  },
  {
    slug: "vaccination",
    title: "疫苗接種",
    summary: "季節性流感、旅行疫苗及兒童計劃，需提前預約。",
    duration: "約 20 分鐘",
    priceFrom: "HK$320 起",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
  },
  {
    slug: "dermatology",
    title: "皮膚科諮詢",
    summary: "暗瘡、濕疹及皮膚檢查，提供個人化護理方案。",
    duration: "約 30 分鐘",
    priceFrom: "HK$1,200 起",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
  },
  {
    slug: "women-health",
    title: "婦女健康",
    summary: "婦科檢查、超聲波及健康諮詢，注重私隱及細心解釋。",
    duration: "約 45 分鐘",
    priceFrom: "HK$1,500 起",
    image:
      "https://images.unsplash.com/photo-1579686111587-38a1b5c6a5c8?w=800&q=80",
  },
];

export const MEDICAL_DOCTORS: MedicalDoctor[] = [
  {
    slug: "dr-chan",
    name: "陳信言醫生",
    title: "家庭醫學顧問",
    specialty: "內科 · 健康檢查",
    credentials: ["香港大學內外全科醫學士", "英國皇家全科醫學院院士", "15 年臨床經驗"],
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
  },
  {
    slug: "dr-wong",
    name: "黃慧儀醫生",
    title: "牙科醫生",
    specialty: "牙科 · 口腔護理",
    credentials: ["香港大學牙醫學士", "香港牙科醫學院院員", "擅長微創牙科治療"],
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80",
  },
  {
    slug: "dr-lam",
    name: "林卓軒物理治療師",
    title: "註冊物理治療師",
    specialty: "物理治療 · 運動復康",
    credentials: ["理學士（物理治療）", "香港物理治療師註冊", "前港隊運動創傷顧問"],
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80",
  },
];

export function getMedicalService(slug: string) {
  return MEDICAL_SERVICES.find((s) => s.slug === slug);
}

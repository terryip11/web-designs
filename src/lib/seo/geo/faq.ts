export interface GeoFaqItem {
  id: string;
  question: string;
  answer: string;
}

/** 常見問題 — GEO / FAQPage 與 llms.txt 共用單一來源 */
export const GEO_FAQ_HOME_PREVIEW_IDS = [
  "what-is-designpick",
  "pricing-hk",
  "how-to-quote",
] as const;

export const GEO_FAQ_ITEMS: GeoFaqItem[] = [
  {
    id: "what-is-designpick",
    question: "DesignPick 是什麼？",
    answer:
      "DesignPick 是香港繁體中文的網站設計選配平台。客戶可瀏覽行業模板、即時預覽完整 Demo 展示站、選配功能模組與設計選項，並取得香港市場參考報價（HKD），再提交詢價由專人回覆正式方案。",
  },
  {
    id: "pricing-hk",
    question: "在香港做一個網站大概要多少錢？",
    answer:
      "DesignPick 顯示的價格為香港市場參考價（HKD），視模板與功能而定：個人品牌約 HK$9,800 起；餐飲／非牟利約 HK$11,500–12,800；教育／美容約 HK$14,500–18,500；企業／科技約 HK$28,000–32,000；地產／酒店約 HK$35,000–38,000；電商約 HK$52,000 起。加購預約、CMS、多語言、會員等功能會再調整。以上為參考價，正式報價依需求確認。",
  },
  {
    id: "how-to-quote",
    question: "如何取得 DesignPick 報價？",
    answer:
      "流程：① 在介面庫選模板 → ② 方案選配功能與設計選項 → ③ 查看方案摘要的參考總價 → ④ 在聯絡頁提交需求（可附草圖）。亦可直接 WhatsApp 或填表詢價，我們會按選配內容提供書面報價與交付範圍。",
  },
  {
    id: "whats-included",
    question: "參考價通常包含什麼？",
    answer:
      "一般包含：所選行業模板設計、Responsive 手機版、基本頁面結構、聯絡表單，以及 Demo 展示站同等級的視覺品質。進階功能（後台 CMS、預約系統、電商、多語言、SEO 優化、內容代寫、域名主機、上線後維護）視選配項目另計，會在正式報價中列明。",
  },
  {
    id: "industries",
    question: "DesignPick 支援哪些行業？",
    answer:
      "平台提供餐飲、電商、企業官網、個人品牌、醫療、教育、美容、健身、地產、酒店、婚禮活動、科技 SaaS、非牟利等行業模板，每款均有完整 Demo 展示站供預覽。",
  },
  {
    id: "demo-preview",
    question: "可以先看成品效果再決定嗎？",
    answer:
      "可以。每款模板均有完整 Demo 展示站（含首頁及行業子頁），可在「展示站」區直接瀏覽桌面與手機版效果，無需註冊即可預覽。",
  },
  {
    id: "timeline",
    question: "做一個網站需要多久？",
    answer:
      "視頁數、功能與客戶提供內容速度而定。一般展示型官網約 2–4 週；含電商、預約或多語言的項目可能 4–8 週。提交詢價後會按您的選配提供具體時程。",
  },
  {
    id: "language-market",
    question: "DesignPick 服務哪個市場？用什麼語言？",
    answer:
      "DesignPick 主要服務香港市場，網站與報價以繁體中文（zh-HK）及港幣（HKD）為主。部分模板支援多語言功能模組，可按需求加配。",
  },
];

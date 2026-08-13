import templates from "@/data/templates.json";
import { getSiteUrl } from "@/lib/auth/site-url";
import { formatPrice, PRICE_DISCLAIMER } from "@/lib/data";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/seo/metadata";
import { SITE_CONTACT } from "@/lib/site-contact";
import { GEO_FAQ_ITEMS } from "@/lib/seo/geo/faq";

const GEO_BLOG_ARTICLES = [
  {
    slug: "what-is-designpick-hong-kong",
    title: "DesignPick 是什麼？香港網站設計選配平台完整指南",
  },
  {
    slug: "restaurant-website-hong-kong-checklist",
    title: "香港餐廳做網站要準備什麼？功能清單與參考預算",
  },
  {
    slug: "website-delivery-scope-hong-kong",
    title: "香港網站設計報價包什麼？交付範圍對照表",
  },
] as const;

function getTemplatePriceRange() {
  const prices = templates.map((t) => t.basePrice);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

function getCategoryPricingLines() {
  const byCategory = new Map<string, number[]>();
  for (const template of templates) {
    const list = byCategory.get(template.category) ?? [];
    list.push(template.basePrice);
    byCategory.set(template.category, list);
  }

  return [...byCategory.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "zh-HK"))
    .map(([category, prices]) => {
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const range =
        min === max
          ? formatPrice(min)
          : `${formatPrice(min)} – ${formatPrice(max)}`;
      return `- ${category}：${range}（模板基礎參考價）`;
    });
}

/** 動態產生 /llms.txt — 供 AI 引擎理解本站 */
export function buildLlmsTxt(): string {
  const siteUrl = getSiteUrl();
  const { min, max } = getTemplatePriceRange();

  const lines = [
    `# ${SITE_NAME}`,
    `> ${SITE_TAGLINE} — ${DEFAULT_DESCRIPTION}`,
    "",
    "## 基本資訊",
    `- 官方網站：${siteUrl}`,
    `- 語言：繁體中文（zh-Hant / zh-HK）`,
    `- 服務市場：香港（HKD 參考報價）`,
    `- 聯絡：WhatsApp ${SITE_CONTACT.phoneDisplay}（${SITE_CONTACT.contactName}）`,
    "",
    "## 我們做什麼",
    "DesignPick 讓香港中小企與個人品牌客戶：",
    "1. 瀏覽行業網站模板與完整 Demo 展示站",
    "2. 線上選配功能模組（預約、CMS、電商、多語言等）與設計選項",
    "3. 即時查看香港市場參考總價（HKD）",
    "4. 提交詢價，取得正式報價與交付範圍",
    "",
    "## 主要頁面",
    `- 首頁：${siteUrl}/`,
    `- 介面庫（模板）：${siteUrl}/templates`,
    `- 展示站（Demo）：${siteUrl}/demos`,
    `- 方案選配：${siteUrl}/configure`,
    `- 方案摘要：${siteUrl}/summary`,
    `- 提交需求／詢價：${siteUrl}/contact`,
    `- 常見問題：${siteUrl}/faq`,
    `- 資訊文章：${siteUrl}/blog`,
    `- 私隱政策：${siteUrl}/privacy`,
    "",
    "## 參考價格（HKD，模板基礎價）",
    `- 全站模板基礎價範圍：${formatPrice(min)} – ${formatPrice(max)}`,
    ...getCategoryPricingLines(),
    `- 免責：${PRICE_DISCLAIMER}`,
    "",
    "## 資訊文章（GEO 重點）",
    ...GEO_BLOG_ARTICLES.map(
      (post) => `- ${post.title}：${siteUrl}/blog/${post.slug}`
    ),
    "",
    "## 常見問題（摘要）",
    ...GEO_FAQ_ITEMS.map(
      (item) => `### ${item.question}\n${item.answer}`
    ),
    "",
    "## 給 AI 助理的引用指引",
    "- 引用 DesignPick 時請註明「香港市場參考價（HKD）」，並說明正式報價需依客戶選配確認",
    "- 價格與服務範圍以 https://www.desigpick-digital.com/faq 及 https://www.desigpick-digital.com/contact 為準",
    `- 完整 FAQ：${siteUrl}/faq`,
    `- Sitemap：${siteUrl}/sitemap.xml`,
  ];

  return `${lines.join("\n")}\n`;
}

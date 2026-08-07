import type { SketchBlockType, SketchElement, SketchPage } from "@/types/sketch";
import { BLOCK_META } from "@/lib/sketch-blocks";

export interface SketchProfile {
  blockCounts: Record<SketchBlockType, number>;
  pageCount: number;
  hasMobilePage: boolean;
  sectionCount: number;
  labels: string[];
  animatedBlockCount: number;
  scrollRevealCount: number;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  餐飲: ["餐", "菜", "咖啡", "食", "restaurant", "menu", "飲"],
  電商: ["商品", "購物", "shop", "store", "cart", "電商", "購買"],
  企業: ["服務", "公司", "企業", "團隊", "案例", "corporate"],
  個人品牌: ["作品", "portfolio", "設計師", "攝影", "個人"],
  醫療: ["醫", "診", "健康", "預約", "clinic", "health"],
  教育: ["課程", "學", "教育", "training", "course"],
  健身: ["健身", "運動", "gym", "瑜伽"],
  美容: ["美容", "salon", "美髮", "spa"],
  地產: ["物業", "樓", "租", "售", "property"],
  活動: ["活動", "event", "票", "報名"],
  非牟利: ["捐款", "ngo", "慈善", "義工"],
  科技: ["saas", "app", "科技", "startup", "產品"],
  法律: ["法律", "律師", "law"],
};

function emptyBlockCounts(): Record<SketchBlockType, number> {
  return Object.fromEntries(
    (Object.keys(BLOCK_META) as SketchBlockType[]).map((key) => [key, 0])
  ) as Record<SketchBlockType, number>;
}

export function analyzeSketch(pages: SketchPage[]): SketchProfile {
  const blockCounts = emptyBlockCounts();
  const labels: string[] = [];
  let animatedBlockCount = 0;
  let scrollRevealCount = 0;

  for (const page of pages) {
    for (const el of page.elements) {
      if (el.type === "block") {
        blockCounts[el.blockType]++;
        if (el.label) labels.push(el.label.toLowerCase());
        if (el.animation && el.animation !== "none") {
          animatedBlockCount++;
          if (el.animation === "scroll-reveal") scrollRevealCount++;
        }
      }
    }
  }

  return {
    blockCounts,
    pageCount: pages.filter((p) => p.elements.length > 0).length || pages.length,
    hasMobilePage: pages.some((p) => p.device === "mobile" && p.elements.length > 0),
    sectionCount:
      blockCounts.section +
      blockCounts.hero +
      blockCounts.card +
      blockCounts.pricing +
      blockCounts.faq +
      blockCounts.form,
    labels,
    animatedBlockCount,
    scrollRevealCount,
  };
}

/** 草圖元件摘要（供 configure 等頁面顯示） */
export function formatSketchBlockSummary(
  blockCounts: Record<SketchBlockType, number>
): string {
  const parts = (Object.keys(BLOCK_META) as SketchBlockType[])
    .filter((type) => blockCounts[type] > 0)
    .map((type) => `${BLOCK_META[type].label.split(" ")[0]}×${blockCounts[type]}`);
  return parts.slice(0, 8).join(" · ");
}

export function hasSketchContent(pages: SketchPage[]): boolean {
  return pages.some((p) => p.elements.length > 0);
}

/** 從草圖文字推斷最可能的行業分類 */
export function inferCategoryFromSketch(pages: SketchPage[]): string | null {
  if (!hasSketchContent(pages)) return null;

  const profile = analyzeSketch(pages);
  const text = profile.labels.join(" ");
  if (!text.trim()) return null;

  let bestCategory: string | null = null;
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw.toLowerCase())) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestScore > 0 ? bestCategory : null;
}

import type { DesignSelections } from "@/types";
import type { SketchPage } from "@/types/sketch";
import { getFeatureById } from "@/lib/data";
import {
  getAnimationTierById,
  getHeroTypeById,
  getLayoutById,
  getNavigationById,
} from "@/lib/design-options";
import { analyzeSketch, hasSketchContent } from "@/lib/sketch-template-match";

export type SketchSuggestionField =
  | keyof DesignSelections
  | "navigationIds"
  | "featureIds";

export interface SketchDesignSuggestion {
  field: SketchSuggestionField;
  optionId: string;
  name: string;
  reason: string;
}

export function suggestDesignFromSketch(
  pages: SketchPage[]
): SketchDesignSuggestion[] {
  if (!hasSketchContent(pages)) return [];

  const profile = analyzeSketch(pages);
  const { blockCounts } = profile;
  const suggestions: SketchDesignSuggestion[] = [];
  const labelText = profile.labels.join(" ");

  // —— 版面 ——
  if (blockCounts.sidebar >= 1) {
    suggestions.push({
      field: "layoutId",
      optionId: "sidebar-left",
      name: getLayoutById("sidebar-left")?.name ?? "左側邊欄",
      reason: "草圖含側邊欄區塊，適合左側固定導航 + 右側內容",
    });
  } else if (blockCounts.tabs >= 1 && profile.sectionCount >= 2) {
    suggestions.push({
      field: "layoutId",
      optionId: "magazine",
      name: getLayoutById("magazine")?.name ?? "雜誌式排版",
      reason: "草圖有分頁／Tab 與多個內容區，適合區塊混排",
    });
  } else if (blockCounts.pricing >= 1 || blockCounts.card >= 3) {
    suggestions.push({
      field: "layoutId",
      optionId: "three-column-grid",
      name: getLayoutById("three-column-grid")?.name ?? "三欄網格",
      reason:
        blockCounts.pricing >= 1
          ? `草圖含 ${blockCounts.pricing} 個價格表，三欄網格便於方案比較`
          : `草圖含 ${blockCounts.card} 個卡片區塊，適合三欄網格展示`,
    });
  } else if (blockCounts.card >= 2 && blockCounts.image >= 1) {
    suggestions.push({
      field: "layoutId",
      optionId: "card-masonry",
      name: getLayoutById("card-masonry")?.name ?? "瀑布流卡片",
      reason: "草圖有卡片與圖片混排，適合瀑布流版面",
    });
  } else if (blockCounts.table >= 1) {
    suggestions.push({
      field: "layoutId",
      optionId: "two-column",
      name: getLayoutById("two-column")?.name ?? "雙欄式",
      reason: "草圖含表格區塊，雙欄式便於資料與說明並列",
    });
  } else if (blockCounts.hero >= 1 && profile.sectionCount >= 2) {
    suggestions.push({
      field: "layoutId",
      optionId: "full-hero",
      name: getLayoutById("full-hero")?.name ?? "全寬 Hero + 內容區",
      reason: "草圖有 Hero 與多個內容區，符合 Landing Page 結構",
    });
  } else if (blockCounts.faq >= 1 || profile.sectionCount >= 3) {
    suggestions.push({
      field: "layoutId",
      optionId: "single-column",
      name: getLayoutById("single-column")?.name ?? "單欄式",
      reason:
        blockCounts.faq >= 1
          ? "草圖含 FAQ 區塊，單欄閱讀動線最清晰"
          : "草圖以垂直內容區為主，單欄閱讀動線清晰",
    });
  }

  // —— Hero ——
  if (blockCounts.video >= 1) {
    suggestions.push({
      field: "heroTypeId",
      optionId: "video-background",
      name: getHeroTypeById("video-background")?.name ?? "全屏影片背景",
      reason: "草圖含影片區塊，首屏可採影片背景",
    });
  } else if (blockCounts.form >= 1 || blockCounts.input >= 2) {
    suggestions.push({
      field: "heroTypeId",
      optionId: "hero-with-form",
      name: getHeroTypeById("hero-with-form")?.name ?? "Hero 嵌入表單",
      reason: "草圖含表單／輸入欄，首屏嵌入表單可提高轉化",
    });
  } else if (blockCounts.hero >= 1) {
    if (blockCounts.button >= 2) {
      suggestions.push({
        field: "heroTypeId",
        optionId: "fullscreen-cta",
        name: getHeroTypeById("fullscreen-cta")?.name ?? "全屏 CTA Hero",
        reason: "草圖 Hero 區含多個行動按鈕，適合轉化導向首屏",
      });
    } else if (blockCounts.image >= 2) {
      suggestions.push({
        field: "heroTypeId",
        optionId: "carousel-slider",
        name: getHeroTypeById("carousel-slider")?.name ?? "輪播 Slider",
        reason: "草圖含多個圖片區，Hero 可採輪播展示",
      });
    } else if (profile.scrollRevealCount >= 1 || profile.animatedBlockCount >= 2) {
      suggestions.push({
        field: "heroTypeId",
        optionId: "parallax-hero",
        name: getHeroTypeById("parallax-hero")?.name ?? "視差捲動 Hero",
        reason: "草圖 Hero 已規劃進場特效，視差首屏可呼應動態感",
      });
    } else if (blockCounts.text >= 2 && blockCounts.image === 0) {
      suggestions.push({
        field: "heroTypeId",
        optionId: "minimal-text",
        name: getHeroTypeById("minimal-text")?.name ?? "極簡文字 Hero",
        reason: "草圖 Hero 以文字為主，極簡排版更契合",
      });
    } else {
      suggestions.push({
        field: "heroTypeId",
        optionId: "full-width-image",
        name: getHeroTypeById("full-width-image")?.name ?? "全幅影像 Hero",
        reason: "草圖含 Hero 區塊，建議全幅影像首屏",
      });
    }
  }

  // —— 導航 ——
  if (blockCounts.search >= 1) {
    suggestions.push({
      field: "navigationIds",
      optionId: "search-nav",
      name: getNavigationById("search-nav")?.name ?? "搜尋列導航",
      reason: "草圖含搜尋框，導航列可整合搜尋功能",
    });
  }
  if (blockCounts.sidebar >= 1) {
    suggestions.push({
      field: "navigationIds",
      optionId: "side-drawer",
      name: getNavigationById("side-drawer")?.name ?? "側邊抽屜導航",
      reason: "草圖有側邊欄結構，可搭配側邊抽屜導航",
    });
  }
  if (
    (blockCounts.nav >= 1 || blockCounts.tabs >= 1) &&
    profile.sectionCount >= 3
  ) {
    suggestions.push({
      field: "navigationIds",
      optionId: "anchor-single-page",
      name: getNavigationById("anchor-single-page")?.name ?? "錨點單頁導航",
      reason: "草圖區塊多且在同一頁，適合錨點跳轉導航",
    });
  }
  if (profile.hasMobilePage) {
    suggestions.push({
      field: "navigationIds",
      optionId: "hamburger-mobile",
      name: getNavigationById("hamburger-mobile")?.name ?? "漢堡選單",
      reason: "你已規劃手機版草圖，建議保留漢堡選單",
    });
  }

  // —— 動效（依草圖元件上的 animation 欄位）——
  if (profile.animatedBlockCount >= 6 || profile.scrollRevealCount >= 3) {
    suggestions.push({
      field: "animationTierId",
      optionId: "premium",
      name: getAnimationTierById("premium")?.name ?? "高端動效",
      reason: `草圖已規劃 ${profile.animatedBlockCount} 個進場特效，高端動效可完整呈現`,
    });
  } else if (
    profile.animatedBlockCount >= 2 ||
    profile.scrollRevealCount >= 1 ||
    blockCounts.card >= 3
  ) {
    suggestions.push({
      field: "animationTierId",
      optionId: "advanced",
      name: getAnimationTierById("advanced")?.name ?? "進階動效",
      reason:
        profile.animatedBlockCount >= 2
          ? `草圖含 ${profile.animatedBlockCount} 個特效標記，進階飛入／交錯動效較吻合`
          : "草圖區塊豐富，進階飛入動效能強化層次感",
    });
  }

  // —— 功能模組 ——
  if (blockCounts.form >= 1 || blockCounts.input >= 1) {
    suggestions.push({
      field: "featureIds",
      optionId: "contact-form",
      name: getFeatureById("contact-form")?.name ?? "聯絡表單",
      reason: "草圖含表單或輸入欄，需後端表單處理與通知",
    });
  }
  if (blockCounts.map >= 1) {
    suggestions.push({
      field: "featureIds",
      optionId: "google-map",
      name: getFeatureById("google-map")?.name ?? "Google 地圖",
      reason: "草圖含地圖區塊，可嵌入 Google 地圖顯示位置",
    });
  }
  if (blockCounts.image >= 3 && blockCounts.card >= 1) {
    suggestions.push({
      field: "featureIds",
      optionId: "gallery",
      name: getFeatureById("gallery")?.name ?? "相簿 / 作品集",
      reason: "草圖有多個圖片／卡片展示區，適合作品集或相簿模組",
    });
  }
  if (
    blockCounts.list >= 2 ||
    /blog|文章|消息|news|最新/.test(labelText)
  ) {
    suggestions.push({
      field: "featureIds",
      optionId: "blog",
      name: getFeatureById("blog")?.name ?? "部落格 / 最新消息",
      reason: "草圖含列表或文章型區塊，適合部落格模組",
    });
  }
  if (
    blockCounts.pricing >= 1 ||
    /購物|商品|shop|cart|電商/.test(labelText)
  ) {
    suggestions.push({
      field: "featureIds",
      optionId: "ecommerce",
      name: getFeatureById("ecommerce")?.name ?? "金流 / 購物車",
      reason: "草圖含價格表或電商相關文案，可能需要購物車與金流",
    });
  }
  if (/預約|booking|appointment/.test(labelText)) {
    suggestions.push({
      field: "featureIds",
      optionId: "booking",
      name: getFeatureById("booking")?.name ?? "線上預約",
      reason: "草圖文案提及預約，建議加入線上預約模組",
    });
  }

  return dedupeSuggestions(suggestions);
}

function dedupeSuggestions(
  items: SketchDesignSuggestion[]
): SketchDesignSuggestion[] {
  const seen = new Set<string>();
  return items.filter((s) => {
    const key = `${s.field}:${s.optionId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function applyDesignSuggestions(
  suggestions: SketchDesignSuggestion[],
  apply: {
    setLayout: (id: string) => void;
    setHeroType: (id: string) => void;
    setAnimationTier: (id: string) => void;
    toggleNavigation: (id: string) => void;
    toggleFeature: (id: string) => void;
    designSelections: DesignSelections;
    selectedFeatureIds: string[];
  }
) {
  for (const s of suggestions) {
    if (s.field === "layoutId") apply.setLayout(s.optionId);
    else if (s.field === "heroTypeId") apply.setHeroType(s.optionId);
    else if (s.field === "animationTierId") apply.setAnimationTier(s.optionId);
    else if (
      s.field === "navigationIds" &&
      !apply.designSelections.navigationIds.includes(s.optionId)
    ) {
      apply.toggleNavigation(s.optionId);
    } else if (
      s.field === "featureIds" &&
      !apply.selectedFeatureIds.includes(s.optionId)
    ) {
      apply.toggleFeature(s.optionId);
    }
  }
}

export function getSuggestedOptionIds(
  suggestions: SketchDesignSuggestion[]
): Set<string> {
  return new Set(suggestions.map((s) => s.optionId));
}

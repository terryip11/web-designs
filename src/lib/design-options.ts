import designOptionsData from "@/data/design-options.json";
import type { DesignOption, DesignSelections } from "@/types";

export const layouts = designOptionsData.layouts as DesignOption[];
export const navigationOptions = designOptionsData.navigation as DesignOption[];
export const animationTiers = designOptionsData.animationTiers as DesignOption[];
export const heroTypes = designOptionsData.heroTypes as DesignOption[];

export function getDefaultDesignSelections(): DesignSelections {
  return {
    layoutId: layouts.find((l) => l.included)?.id ?? layouts[0].id,
    navigationIds: navigationOptions
      .filter((n) => n.included)
      .map((n) => n.id),
    animationTierId:
      animationTiers.find((a) => a.included)?.id ?? animationTiers[0].id,
    heroTypeId: heroTypes.find((h) => h.included)?.id ?? heroTypes[0].id,
  };
}

export function getLayoutById(id: string): DesignOption | undefined {
  return layouts.find((l) => l.id === id);
}

export function getNavigationById(id: string): DesignOption | undefined {
  return navigationOptions.find((n) => n.id === id);
}

export function getAnimationTierById(id: string): DesignOption | undefined {
  return animationTiers.find((a) => a.id === id);
}

export function getHeroTypeById(id: string): DesignOption | undefined {
  return heroTypes.find((h) => h.id === id);
}

export function calculateDesignPrice(selections: DesignSelections): number {
  let total = 0;

  const layout = getLayoutById(selections.layoutId);
  total += layout?.price ?? 0;

  selections.navigationIds.forEach((id) => {
    const nav = getNavigationById(id);
    total += nav?.price ?? 0;
  });

  const tier = getAnimationTierById(selections.animationTierId);
  total += tier?.price ?? 0;

  const hero = getHeroTypeById(selections.heroTypeId);
  total += hero?.price ?? 0;

  return total;
}

export function getDesignSelectionLabels(selections: DesignSelections) {
  return {
    layout: getLayoutById(selections.layoutId)?.name ?? selections.layoutId,
    navigation: selections.navigationIds
      .map((id) => getNavigationById(id)?.name ?? id)
      .filter(Boolean),
    animationTier:
      getAnimationTierById(selections.animationTierId)?.name ??
      selections.animationTierId,
    heroType:
      getHeroTypeById(selections.heroTypeId)?.name ?? selections.heroTypeId,
  };
}

export function getSelectedDesignOptions(selections: DesignSelections): {
  layout: DesignOption | undefined;
  navigation: DesignOption[];
  animationTier: DesignOption | undefined;
  heroType: DesignOption | undefined;
} {
  return {
    layout: getLayoutById(selections.layoutId),
    navigation: selections.navigationIds
      .map((id) => getNavigationById(id))
      .filter(Boolean) as DesignOption[],
    animationTier: getAnimationTierById(selections.animationTierId),
    heroType: getHeroTypeById(selections.heroTypeId),
  };
}

const ANIMATION_EFFECT_LABELS: Record<string, string> = {
  "fade-in": "滾動淡入",
  hover: "按鈕／卡片 Hover 微互動",
  "slide-in": "區塊飛入（左／右／上／下）",
  stagger: "交錯延遲進場",
  "smooth-scroll": "平滑捲動錨點",
  parallax: "視差滾動（背景與前景不同速度）",
  "page-transition": "頁面切換轉場動畫",
  counter: "數字計數動畫（如 500+ 客戶）",
  lottie: "Lottie 向量動畫",
  preloader: "自訂進站 Preloader",
  cursor: "游標磁吸／跟隨特效",
};

const ANIMATION_TIER_INCLUDES: Record<string, string | null> = {
  standard: null,
  advanced: "含標準動效全部效果",
  premium: "含進階動效全部效果",
  ultimate: "含高端動效全部效果",
};

/** 動效等級 hover 說明內容 */
export function getAnimationTierTooltipLines(tier: DesignOption): string[] {
  const lines = [tier.description];
  const includes = ANIMATION_TIER_INCLUDES[tier.id];
  if (includes) lines.push(includes);
  if (tier.effects?.length) {
    lines.push("包含效果：");
    for (const effect of tier.effects) {
      lines.push(`• ${ANIMATION_EFFECT_LABELS[effect] ?? effect}`);
    }
  }
  return lines;
}

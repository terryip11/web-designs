import type { Template } from "@/types";
import type { DesignSelections } from "@/types";

/** 依頁面數量估算交付週數 */
export function getEstimatedDeliveryWeeks(template: Template): string {
  const count = template.includedPages.length;
  if (count <= 5) return "3–4";
  if (count <= 7) return "4–6";
  return "6–8";
}

/** 各行業建議預選功能（需在 compatibleFeatures 內） */
export const CATEGORY_RECOMMENDED_FEATURES: Record<string, string[]> = {
  醫療: ["contact-form", "booking", "google-map", "seo"],
  餐飲: ["contact-form", "google-map", "seo", "gallery"],
  電商: ["contact-form", "seo", "cms"],
  企業: ["contact-form", "seo", "cms"],
};

export function getRecommendedFeaturesForTemplate(
  template: Template
): string[] {
  const recommended = CATEGORY_RECOMMENDED_FEATURES[template.category] ?? [
    "contact-form",
    "seo",
  ];
  return recommended.filter((id) => template.compatibleFeatures.includes(id));
}

export function getCategoryComplianceNote(category: string): string | null {
  if (category === "醫療") {
    return "網站內容需符合香港醫療廣告相關規定，我們可協助審稿。";
  }
  return null;
}

export function getCategoryIndustryHint(template: Template): string {
  return `此方案含 ${template.includedPages.length} 個標準頁面，預估 ${getEstimatedDeliveryWeeks(template)} 週交付。適合：${template.suitableFor}。`;
}

export interface ShareableConfig {
  selectedTemplateId: string;
  selectedFeatureIds: string[];
  designSelections: DesignSelections;
}

export function buildConfigureShareUrl(
  origin: string,
  config: ShareableConfig
): string {
  const params = new URLSearchParams();
  params.set("template", config.selectedTemplateId);
  params.set("layout", config.designSelections.layoutId);
  params.set("nav", config.designSelections.navigationIds.join(","));
  params.set("anim", config.designSelections.animationTierId);
  params.set("hero", config.designSelections.heroTypeId);
  if (config.selectedFeatureIds.length > 0) {
    params.set("features", config.selectedFeatureIds.join(","));
  }
  return `${origin.replace(/\/$/, "")}/configure?${params.toString()}`;
}

export function parseConfigureShareParams(
  params: URLSearchParams
): Partial<ShareableConfig> | null {
  const template = params.get("template");
  if (!template) return null;

  const layout = params.get("layout");
  const nav = params.get("nav");
  const anim = params.get("anim");
  const hero = params.get("hero");
  const features = params.get("features");

  return {
    selectedTemplateId: template,
    selectedFeatureIds: features
      ? features.split(",").filter(Boolean)
      : undefined,
    designSelections:
      layout && anim && hero
        ? {
            layoutId: layout,
            navigationIds: nav ? nav.split(",").filter(Boolean) : [],
            animationTierId: anim,
            heroTypeId: hero,
          }
        : undefined,
  };
}

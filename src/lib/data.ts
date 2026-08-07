import templatesData from "@/data/templates.json";
import featuresData from "@/data/features.json";
import filtersData from "@/data/filters.json";
import type { Feature, Template } from "@/types";
import type { DesignSelections } from "@/types";
import { calculateDesignPrice } from "@/lib/design-options";

export const templates = templatesData as Template[];
export const features = featuresData as Feature[];

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getFeatureById(id: string): Feature | undefined {
  return features.find((f) => f.id === id);
}

export function getFeaturedTemplates(): Template[] {
  return templates.filter((t) => t.featured);
}

export function getCategories(): string[] {
  return filtersData.categories;
}

export function getStyles(): string[] {
  return filtersData.styles;
}

export function getUsedCategories(): string[] {
  return [...new Set(templates.map((t) => t.category))];
}

export function getUsedStyles(): string[] {
  return [...new Set(templates.flatMap((t) => t.style))];
}

export function getCompatibleFeatures(template: Template): Feature[] {
  return features.filter((f) => template.compatibleFeatures.includes(f.id));
}

export function calculateTotalPrice(
  template: Template,
  selectedFeatureIds: string[],
  designSelections?: DesignSelections
): number {
  const featurePrice = selectedFeatureIds.reduce((sum, id) => {
    const feature = getFeatureById(id);
    return sum + (feature?.price ?? 0);
  }, 0);
  const designPrice = designSelections
    ? calculateDesignPrice(designSelections)
    : 0;
  return template.basePrice + featurePrice + designPrice;
}

export { formatPrice, CURRENCY_CODE, CURRENCY_LABEL, PRICE_DISCLAIMER } from "./currency";

export function filterTemplates(options: {
  category?: string;
  style?: string;
  search?: string;
}): Template[] {
  return templates.filter((t) => {
    if (options.category && t.category !== options.category) return false;
    if (options.style && !t.style.includes(options.style)) return false;
    if (options.search) {
      const q = options.search.toLowerCase();
      const haystack = [t.name, t.category, t.suitableFor, ...t.style]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

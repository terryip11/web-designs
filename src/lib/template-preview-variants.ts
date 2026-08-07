export type PreviewVariant =
  | "restaurant"
  | "ecommerce"
  | "corporate"
  | "portfolio"
  | "medical"
  | "education"
  | "beauty"
  | "fitness"
  | "property"
  | "hotel"
  | "wedding"
  | "tech"
  | "ngo";

export const TEMPLATE_PREVIEW_VARIANT: Record<string, PreviewVariant> = {
  "restaurant-warm-01": "restaurant",
  "ecommerce-dark-02": "ecommerce",
  "corporate-clean-03": "corporate",
  "portfolio-creative-04": "portfolio",
  "medical-trust-05": "medical",
  "education-bright-06": "education",
  "beauty-elegant-07": "beauty",
  "fitness-energy-08": "fitness",
  "property-luxe-09": "property",
  "hotel-resort-10": "hotel",
  "wedding-romantic-11": "wedding",
  "tech-saas-12": "tech",
  "ngo-warm-13": "ngo",
};

export function getPreviewVariant(templateId: string): PreviewVariant {
  return TEMPLATE_PREVIEW_VARIANT[templateId] ?? "corporate";
}

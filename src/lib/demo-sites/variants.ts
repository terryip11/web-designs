export type DemoVariant =
  | "property"
  | "medical"
  | "restaurant"
  | "corporate"
  | "ecommerce"
  | "saas"
  | "industry";

const VARIANT_MAP: Record<string, DemoVariant> = {
  "property-luxe-09": "property",
  "medical-trust-05": "medical",
  "restaurant-warm-01": "restaurant",
  "corporate-clean-03": "corporate",
  "ecommerce-dark-02": "ecommerce",
  "tech-saas-12": "saas",
  "portfolio-creative-04": "industry",
  "education-bright-06": "industry",
  "beauty-elegant-07": "industry",
  "fitness-energy-08": "industry",
  "hotel-resort-10": "industry",
  "wedding-romantic-11": "industry",
  "ngo-warm-13": "industry",
};

export function getDemoVariant(templateId: string): DemoVariant | null {
  return VARIANT_MAP[templateId] ?? null;
}

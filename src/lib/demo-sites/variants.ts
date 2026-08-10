export type DemoVariant =
  | "property"
  | "medical"
  | "restaurant"
  | "corporate"
  | "ecommerce"
  | "saas";

const VARIANT_MAP: Record<string, DemoVariant> = {
  "property-luxe-09": "property",
  "medical-trust-05": "medical",
  "restaurant-warm-01": "restaurant",
  "corporate-clean-03": "corporate",
  "ecommerce-dark-02": "ecommerce",
  "tech-saas-12": "saas",
};

export function getDemoVariant(templateId: string): DemoVariant | null {
  return VARIANT_MAP[templateId] ?? null;
}

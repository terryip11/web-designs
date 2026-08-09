export type DemoVariant = "property" | "medical";

const VARIANT_MAP: Record<string, DemoVariant> = {
  "property-luxe-09": "property",
  "medical-trust-05": "medical",
};

export function getDemoVariant(templateId: string): DemoVariant | null {
  return VARIANT_MAP[templateId] ?? null;
}

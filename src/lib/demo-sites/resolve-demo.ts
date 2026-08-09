import { getDemoByTemplateId } from "@/lib/demo-sites/registry";
import { getDemoVariant, type DemoVariant } from "@/lib/demo-sites/variants";

export function resolveLiveDemo(id: string): {
  demo: NonNullable<ReturnType<typeof getDemoByTemplateId>>;
  variant: DemoVariant;
  basePath: string;
} | null {
  const demo = getDemoByTemplateId(id);
  const variant = getDemoVariant(id);
  if (!demo || demo.status !== "live" || !variant) return null;
  return { demo, variant, basePath: `/demos/${id}` };
}

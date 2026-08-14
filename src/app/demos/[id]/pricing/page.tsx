import { notFound } from "next/navigation";
import SaasPricingPage from "@/components/demos/saas/SaasPricingPage";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { SAAS_BRAND } from "@/lib/demo-sites/saas-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (resolveLiveDemo(id)?.variant !== "saas") {
    return { title: "Demo — desigpick-digital" };
  }
  return { title: `定價 — ${SAAS_BRAND.name}` };
}

export default async function DemoPricingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "saas") notFound();
  return <SaasPricingPage basePath={resolved.basePath} />;
}

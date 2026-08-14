import { notFound } from "next/navigation";
import SaasFeaturesPage from "@/components/demos/saas/SaasFeaturesPage";
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
  return { title: `功能 — ${SAAS_BRAND.name}` };
}

export default async function DemoFeaturesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "saas") notFound();
  return <SaasFeaturesPage basePath={resolved.basePath} />;
}

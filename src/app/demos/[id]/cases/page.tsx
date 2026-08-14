import { notFound } from "next/navigation";
import CorporateCasesPage from "@/components/demos/corporate/CorporateCasesPage";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { CORPORATE_BRAND } from "@/lib/demo-sites/corporate-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (resolveLiveDemo(id)?.variant !== "corporate") {
    return { title: "Demo — desigpick-digital" };
  }
  return { title: `案例 — ${CORPORATE_BRAND.name}` };
}

export default async function DemoCasesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "corporate") notFound();
  return <CorporateCasesPage basePath={resolved.basePath} />;
}

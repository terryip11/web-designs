import { notFound } from "next/navigation";
import CorporateTeamPage from "@/components/demos/corporate/CorporateTeamPage";
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
  return { title: `團隊 — ${CORPORATE_BRAND.name}` };
}

export default async function DemoTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "corporate") notFound();
  return <CorporateTeamPage basePath={resolved.basePath} />;
}

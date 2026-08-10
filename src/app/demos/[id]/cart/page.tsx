import { notFound } from "next/navigation";
import EcommerceCartPage from "@/components/demos/ecommerce/EcommerceCartPage";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { ECOMMERCE_BRAND } from "@/lib/demo-sites/ecommerce-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (resolveLiveDemo(id)?.variant !== "ecommerce") {
    return { title: "Demo — DesignPick" };
  }
  return { title: `購物車 — ${ECOMMERCE_BRAND.name}` };
}

export default async function DemoCartPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ add?: string }>;
}) {
  const { id } = await params;
  const { add } = await searchParams;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "ecommerce") notFound();
  return <EcommerceCartPage basePath={resolved.basePath} addedSlug={add} />;
}

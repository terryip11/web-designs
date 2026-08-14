import { notFound } from "next/navigation";
import EcommerceProductsPage from "@/components/demos/ecommerce/EcommerceProductsPage";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { ECOMMERCE_BRAND } from "@/lib/demo-sites/ecommerce-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (resolveLiveDemo(id)?.variant !== "ecommerce") {
    return { title: "Demo — desigpick-digital" };
  }
  return { title: `商品列表 — ${ECOMMERCE_BRAND.name}` };
}

export default async function DemoProductsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "ecommerce") notFound();
  return <EcommerceProductsPage basePath={resolved.basePath} />;
}

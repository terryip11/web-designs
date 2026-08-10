import { notFound } from "next/navigation";
import EcommerceProductDetail from "@/components/demos/ecommerce/EcommerceProductDetail";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import {
  ECOMMERCE_PRODUCTS,
  getProductBySlug,
} from "@/lib/demo-sites/ecommerce-data";

const ECOMMERCE_TEMPLATE_ID = "ecommerce-dark-02";

export function generateStaticParams() {
  return ECOMMERCE_PRODUCTS.map((p) => ({
    id: ECOMMERCE_TEMPLATE_ID,
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product ? `${product.name} — NOIR 選物` : "商品詳情" };
}

export default async function DemoProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "ecommerce") notFound();
  if (!getProductBySlug(slug)) notFound();
  return <EcommerceProductDetail basePath={resolved.basePath} slug={slug} />;
}

import { notFound } from "next/navigation";
import CorporateContactPage from "@/components/demos/corporate/CorporateContactPage";
import EcommerceContactPage from "@/components/demos/ecommerce/EcommerceContactPage";
import MedicalContactPage from "@/components/demos/medical/MedicalContactPage";
import PropertyContactPage from "@/components/demos/property/PropertyContactPage";
import RestaurantContactPage from "@/components/demos/restaurant/RestaurantContactPage";
import SaasContactPage from "@/components/demos/saas/SaasContactPage";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { CORPORATE_BRAND } from "@/lib/demo-sites/corporate-data";
import { ECOMMERCE_BRAND } from "@/lib/demo-sites/ecommerce-data";
import { MEDICAL_BRAND } from "@/lib/demo-sites/medical-data";
import { PROPERTY_BRAND } from "@/lib/demo-sites/property-data";
import { RESTAURANT_BRAND } from "@/lib/demo-sites/restaurant-data";
import { SAAS_BRAND } from "@/lib/demo-sites/saas-data";

const TITLES = {
  medical: MEDICAL_BRAND.name,
  restaurant: RESTAURANT_BRAND.name,
  property: PROPERTY_BRAND.name,
  corporate: CORPORATE_BRAND.name,
  ecommerce: ECOMMERCE_BRAND.name,
  saas: SAAS_BRAND.name,
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved) return { title: "Demo — DesignPick" };
  return { title: `聯絡我們 — ${TITLES[resolved.variant]}` };
}

export default async function DemoContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved) notFound();

  const { basePath, variant } = resolved;

  switch (variant) {
    case "medical":
      return <MedicalContactPage basePath={basePath} />;
    case "restaurant":
      return <RestaurantContactPage basePath={basePath} />;
    case "corporate":
      return <CorporateContactPage basePath={basePath} />;
    case "ecommerce":
      return <EcommerceContactPage basePath={basePath} />;
    case "saas":
      return <SaasContactPage basePath={basePath} />;
    default:
      return <PropertyContactPage basePath={basePath} />;
  }
}

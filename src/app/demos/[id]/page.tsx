import { notFound } from "next/navigation";
import { DemoComingSoon } from "@/components/demos/DemoComingSoon";
import CorporateHomePage from "@/components/demos/corporate/CorporateHomePage";
import EcommerceHomePage from "@/components/demos/ecommerce/EcommerceHomePage";
import MedicalHomePage from "@/components/demos/medical/MedicalHomePage";
import PropertyHomePage from "@/components/demos/property/PropertyHomePage";
import RestaurantHomePage from "@/components/demos/restaurant/RestaurantHomePage";
import SaasHomePage from "@/components/demos/saas/SaasHomePage";
import { getDemoByTemplateId } from "@/lib/demo-sites/registry";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import type { DemoVariant } from "@/lib/demo-sites/variants";
import { buildDemoMetadata, buildPageMetadata } from "@/lib/seo/metadata";
import { CORPORATE_BRAND } from "@/lib/demo-sites/corporate-data";
import { ECOMMERCE_BRAND } from "@/lib/demo-sites/ecommerce-data";
import { MEDICAL_BRAND } from "@/lib/demo-sites/medical-data";
import { PROPERTY_BRAND } from "@/lib/demo-sites/property-data";
import { RESTAURANT_BRAND } from "@/lib/demo-sites/restaurant-data";
import { SAAS_BRAND } from "@/lib/demo-sites/saas-data";

const HOME_META: Record<
  DemoVariant,
  { title: string; description: string }
> = {
  property: {
    title: `${PROPERTY_BRAND.name} — 香港高端物業`,
    description: `${PROPERTY_BRAND.name} · DesignPick 模板展示`,
  },
  medical: {
    title: `${MEDICAL_BRAND.name} — 專業醫療服務`,
    description: `${MEDICAL_BRAND.name} · DesignPick 模板展示`,
  },
  restaurant: {
    title: `${RESTAURANT_BRAND.name} — 精緻地中海料理`,
    description: `${RESTAURANT_BRAND.name} · DesignPick 模板展示`,
  },
  corporate: {
    title: `${CORPORATE_BRAND.name} — 企業顧問服務`,
    description: `${CORPORATE_BRAND.name} · DesignPick 模板展示`,
  },
  ecommerce: {
    title: `${ECOMMERCE_BRAND.name} — 質感選物`,
    description: `${ECOMMERCE_BRAND.name} · DesignPick 模板展示`,
  },
  saas: {
    title: `${SAAS_BRAND.name} — 工作流自動化`,
    description: `${SAAS_BRAND.name} · DesignPick 模板展示`,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved) {
    return buildPageMetadata({
      title: "Demo 展示站",
      path: `/demos/${id}`,
    });
  }
  const meta = HOME_META[resolved.variant];
  return buildDemoMetadata(meta.title, meta.description, id);
}

export default async function DemoHomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const demo = getDemoByTemplateId(id);
  if (!demo) notFound();

  const resolved = resolveLiveDemo(id);
  if (!resolved) return <DemoComingSoon templateId={id} />;

  const { basePath, variant } = resolved;

  switch (variant) {
    case "medical":
      return <MedicalHomePage basePath={basePath} />;
    case "restaurant":
      return <RestaurantHomePage basePath={basePath} />;
    case "corporate":
      return <CorporateHomePage basePath={basePath} />;
    case "ecommerce":
      return <EcommerceHomePage basePath={basePath} />;
    case "saas":
      return <SaasHomePage basePath={basePath} />;
    default:
      return <PropertyHomePage basePath={basePath} />;
  }
}

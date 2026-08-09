import { notFound } from "next/navigation";
import { DemoComingSoon } from "@/components/demos/DemoComingSoon";
import MedicalHomePage from "@/components/demos/medical/MedicalHomePage";
import PropertyHomePage from "@/components/demos/property/PropertyHomePage";
import { getDemoByTemplateId } from "@/lib/demo-sites/registry";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { MEDICAL_BRAND } from "@/lib/demo-sites/medical-data";
import { PROPERTY_BRAND } from "@/lib/demo-sites/property-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved) return { title: "Demo — DesignPick" };
  if (resolved.variant === "medical") {
    return {
      title: `${MEDICAL_BRAND.name} — 專業醫療服務`,
      description: `${MEDICAL_BRAND.name} · DesignPick 模板展示`,
    };
  }
  return {
    title: `${PROPERTY_BRAND.name} — 香港高端物業`,
    description: `${PROPERTY_BRAND.name} · DesignPick 模板展示`,
  };
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

  if (resolved.variant === "medical") {
    return <MedicalHomePage basePath={resolved.basePath} />;
  }

  return <PropertyHomePage basePath={resolved.basePath} />;
}

import { notFound } from "next/navigation";
import MedicalContactPage from "@/components/demos/medical/MedicalContactPage";
import PropertyContactPage from "@/components/demos/property/PropertyContactPage";
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
    return { title: `聯絡我們 — ${MEDICAL_BRAND.name}` };
  }
  return { title: `聯絡我們 — ${PROPERTY_BRAND.name}` };
}

export default async function DemoContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved) notFound();

  if (resolved.variant === "medical") {
    return <MedicalContactPage basePath={resolved.basePath} />;
  }

  return <PropertyContactPage basePath={resolved.basePath} />;
}

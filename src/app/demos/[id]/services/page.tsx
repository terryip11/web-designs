import { notFound } from "next/navigation";
import CorporateServicesPage from "@/components/demos/corporate/CorporateServicesPage";
import MedicalServicesPage from "@/components/demos/medical/MedicalServicesPage";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { CORPORATE_BRAND } from "@/lib/demo-sites/corporate-data";
import { MEDICAL_BRAND } from "@/lib/demo-sites/medical-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved) return { title: "Demo — DesignPick" };
  if (resolved.variant === "medical") {
    return { title: `服務項目 — ${MEDICAL_BRAND.name}` };
  }
  if (resolved.variant === "corporate") {
    return { title: `服務介紹 — ${CORPORATE_BRAND.name}` };
  }
  return { title: "Demo — DesignPick" };
}

export default async function DemoServicesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved) notFound();

  if (resolved.variant === "medical") {
    return <MedicalServicesPage basePath={resolved.basePath} />;
  }

  if (resolved.variant === "corporate") {
    return <CorporateServicesPage basePath={resolved.basePath} />;
  }

  notFound();
}

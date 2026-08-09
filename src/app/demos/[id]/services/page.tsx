import { notFound } from "next/navigation";
import MedicalServicesPage from "@/components/demos/medical/MedicalServicesPage";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { MEDICAL_BRAND } from "@/lib/demo-sites/medical-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (resolveLiveDemo(id)?.variant !== "medical") {
    return { title: "Demo — DesignPick" };
  }
  return { title: `服務項目 — ${MEDICAL_BRAND.name}` };
}

export default async function DemoServicesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "medical") notFound();

  return <MedicalServicesPage basePath={resolved.basePath} />;
}

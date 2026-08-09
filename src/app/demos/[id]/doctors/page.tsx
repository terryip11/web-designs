import { notFound } from "next/navigation";
import MedicalDoctorsPage from "@/components/demos/medical/MedicalDoctorsPage";
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
  return { title: `醫師團隊 — ${MEDICAL_BRAND.name}` };
}

export default async function DemoDoctorsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "medical") notFound();

  return <MedicalDoctorsPage basePath={resolved.basePath} />;
}

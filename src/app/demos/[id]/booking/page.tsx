import { notFound } from "next/navigation";
import MedicalBookingPage from "@/components/demos/medical/MedicalBookingPage";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { MEDICAL_BRAND } from "@/lib/demo-sites/medical-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (resolveLiveDemo(id)?.variant !== "medical") {
    return { title: "Demo — desigpick-digital" };
  }
  return { title: `網上預約 — ${MEDICAL_BRAND.name}` };
}

export default async function DemoBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ service?: string; doctor?: string }>;
}) {
  const { id } = await params;
  const { service, doctor } = await searchParams;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "medical") notFound();

  return (
    <MedicalBookingPage
      basePath={resolved.basePath}
      preselectedService={service}
      preselectedDoctor={doctor}
    />
  );
}

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import MedicalShell from "@/components/demos/medical/MedicalShell";
import { MEDICAL_SERVICES } from "@/lib/demo-sites/medical-data";

export default function MedicalServicesPage({ basePath }: { basePath: string }) {
  return (
    <MedicalShell basePath={basePath}>
      <section className="border-b border-[#0EA5E9]/10 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#334155]">服務項目</h1>
          <p className="mt-2 text-[#64748B]">
            共 {MEDICAL_SERVICES.length} 項服務 · 價格供參考，實際以診所報價為準
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {MEDICAL_SERVICES.map((service) => (
            <article
              key={service.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#0EA5E9]/10 bg-white shadow-sm sm:flex-row"
            >
              <div className="relative aspect-[16/10] sm:aspect-auto sm:w-2/5 sm:min-h-[200px]">
                <Image src={service.image} alt={service.title} fill className="object-cover" sizes="40vw" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-semibold text-[#334155]">{service.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#64748B]">
                  {service.summary}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1 text-xs text-[#64748B]">
                    <Clock className="h-3.5 w-3.5" />
                    {service.duration}
                  </span>
                  <span className="font-semibold text-[#0EA5E9]">{service.priceFrom}</span>
                </div>
                <Link
                  href={`${basePath}/booking?service=${service.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-[#0EA5E9] hover:underline"
                >
                  預約此服務 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </MedicalShell>
  );
}

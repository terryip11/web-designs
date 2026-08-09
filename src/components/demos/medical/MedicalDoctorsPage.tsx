import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import MedicalShell from "@/components/demos/medical/MedicalShell";
import { MEDICAL_DOCTORS } from "@/lib/demo-sites/medical-data";

export default function MedicalDoctorsPage({ basePath }: { basePath: string }) {
  return (
    <MedicalShell basePath={basePath}>
      <section className="border-b border-[#0EA5E9]/10 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#334155]">醫師團隊</h1>
          <p className="mt-2 text-[#64748B]">
            資歷透明、專業可靠 — 所有醫護人員均持有有效執業證明
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {MEDICAL_DOCTORS.map((doctor) => (
            <article
              key={doctor.slug}
              className="overflow-hidden rounded-2xl border border-[#0EA5E9]/10 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image src={doctor.image} alt={doctor.name} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#334155]">{doctor.name}</h2>
                <p className="text-sm font-medium text-[#0EA5E9]">{doctor.title}</p>
                <p className="mt-1 text-sm text-[#64748B]">{doctor.specialty}</p>
                <ul className="mt-4 space-y-2">
                  {doctor.credentials.map((item) => (
                    <li key={item} className="flex gap-2 text-xs text-[#64748B]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0EA5E9]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`${basePath}/booking?doctor=${doctor.slug}`}
                  className="mt-5 inline-flex text-sm font-medium text-[#0EA5E9] hover:underline"
                >
                  預約 {doctor.name} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </MedicalShell>
  );
}

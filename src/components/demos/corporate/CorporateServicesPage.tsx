import { Briefcase, Cpu, Shield, Target } from "lucide-react";
import CorporateShell from "@/components/demos/corporate/CorporateShell";
import { CORPORATE_SERVICES } from "@/lib/demo-sites/corporate-data";

const ICONS = { target: Target, workflow: Briefcase, cpu: Cpu, shield: Shield } as const;

export default function CorporateServicesPage({ basePath }: { basePath: string }) {
  return (
    <CorporateShell basePath={basePath}>
      <section className="border-b border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#1E293B]">服務介紹</h1>
          <p className="mt-2 text-slate-600">為 B2B 企業提供可落地的顧問方案</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {CORPORATE_SERVICES.map((service) => {
            const Icon = ICONS[service.icon as keyof typeof ICONS] ?? Briefcase;
            return (
              <article
                key={service.slug}
                className="flex gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10">
                  <Icon className="h-6 w-6 text-[#2563EB]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#1E293B]">{service.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.summary}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </CorporateShell>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Cpu, Shield, Target } from "lucide-react";
import CorporateShell from "@/components/demos/corporate/CorporateShell";
import {
  CORPORATE_BRAND,
  CORPORATE_CASES,
  CORPORATE_SERVICES,
} from "@/lib/demo-sites/corporate-data";

const ICONS = { target: Target, workflow: Briefcase, cpu: Cpu, shield: Shield } as const;

export default function CorporateHomePage({ basePath }: { basePath: string }) {
  return (
    <CorporateShell basePath={basePath}>
      <section className="bg-gradient-to-br from-[#2563EB]/5 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-[#2563EB]">
              {CORPORATE_BRAND.englishName}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-[#1E293B] sm:text-5xl">
              專業顧問
              <br />
              <span className="text-[#2563EB]">驅動企業成長</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">{CORPORATE_BRAND.tagline}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`${basePath}/contact`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-7 py-3.5 font-medium text-white hover:bg-blue-700"
              >
                預約諮詢
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`${basePath}/cases`}
                className="inline-flex items-center gap-2 rounded-lg border border-[#2563EB]/30 px-7 py-3.5 font-medium text-[#2563EB] hover:bg-blue-50"
              >
                查看案例
              </Link>
            </div>
          </div>
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl shadow-xl lg:min-h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
              alt="辦公環境"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1E293B]">服務項目</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CORPORATE_SERVICES.map((service) => {
            const Icon = ICONS[service.icon as keyof typeof ICONS] ?? Briefcase;
            return (
              <div
                key={service.slug}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <Icon className="h-8 w-8 text-[#2563EB]" />
                <h3 className="mt-4 font-semibold text-[#1E293B]">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{service.summary}</p>
              </div>
            );
          })}
        </div>
        <Link
          href={`${basePath}/services`}
          className="mt-8 inline-flex text-sm font-medium text-[#2563EB] hover:underline"
        >
          全部服務 →
        </Link>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1E293B]">成功案例</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {CORPORATE_CASES.map((c) => (
              <article
                key={c.slug}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10]">
                  <Image src={c.image} alt={c.title} fill className="object-cover" sizes="33vw" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium text-[#2563EB]">{c.industry}</p>
                  <h3 className="mt-1 font-semibold text-[#1E293B]">{c.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{c.result}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#2563EB] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">準備好討論下一步？</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            首 30 分鐘諮詢免費，了解您的目標後提供初步建議。
          </p>
          <Link
            href={`${basePath}/contact`}
            className="mt-8 inline-flex rounded-lg bg-white px-8 py-3.5 font-medium text-[#2563EB] hover:bg-slate-100"
          >
            聯絡我們
          </Link>
        </div>
      </section>
    </CorporateShell>
  );
}

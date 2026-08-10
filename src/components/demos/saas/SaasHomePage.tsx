import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Lock, Users, Zap } from "lucide-react";
import SaasShell from "@/components/demos/saas/SaasShell";
import { SAAS_BRAND, SAAS_CUSTOMERS, SAAS_FEATURES } from "@/lib/demo-sites/saas-data";

const ICONS = { zap: Zap, chart: BarChart3, lock: Lock, users: Users } as const;

export default function SaasHomePage({ basePath }: { basePath: string }) {
  return (
    <SaasShell basePath={basePath}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wider text-[#6366F1]">
              Workflow Automation
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              自動化工作流
              <br />
              <span className="text-[#6366F1]">釋放團隊潛力</span>
            </h1>
            <p className="mt-6 text-lg text-slate-400">{SAAS_BRAND.tagline}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`${basePath}/contact`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-7 py-3.5 font-medium text-white hover:bg-indigo-500"
              >
                開始免費試用
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`${basePath}/pricing`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-7 py-3.5 font-medium text-white hover:bg-white/5"
              >
                查看定價
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white">核心功能</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SAAS_FEATURES.map((f) => {
            const Icon = ICONS[f.icon as keyof typeof ICONS] ?? Zap;
            return (
              <div key={f.slug} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <Icon className="h-8 w-8 text-[#6366F1]" />
                <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{f.summary}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">客戶怎麼說</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SAAS_CUSTOMERS.map((c) => (
              <blockquote
                key={c.slug}
                className="rounded-xl border border-white/10 bg-[#0F172A] p-6"
              >
                <p className="text-sm leading-relaxed text-slate-300">&ldquo;{c.quote}&rdquo;</p>
                <footer className="mt-4 flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image src={c.logo} alt={c.company} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{c.author}</p>
                    <p className="text-xs text-slate-500">
                      {c.role} · {c.company}
                    </p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#6366F1] py-16 text-center">
        <h2 className="text-3xl font-bold text-white">14 天免費試用，無需信用卡</h2>
        <Link
          href={`${basePath}/contact`}
          className="mt-8 inline-flex rounded-lg bg-white px-8 py-3.5 font-medium text-[#6366F1] hover:bg-slate-100"
        >
          立即開始
        </Link>
      </section>
    </SaasShell>
  );
}

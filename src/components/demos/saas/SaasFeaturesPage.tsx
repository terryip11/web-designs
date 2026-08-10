import { BarChart3, Lock, Users, Zap } from "lucide-react";
import SaasShell from "@/components/demos/saas/SaasShell";
import { SAAS_FEATURES } from "@/lib/demo-sites/saas-data";

const ICONS = { zap: Zap, chart: BarChart3, lock: Lock, users: Users } as const;

export default function SaasFeaturesPage({ basePath }: { basePath: string }) {
  return (
    <SaasShell basePath={basePath}>
      <section className="border-b border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">功能</h1>
          <p className="mt-2 text-slate-400">為現代團隊設計的自動化平台</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {SAAS_FEATURES.map((f) => {
            const Icon = ICONS[f.icon as keyof typeof ICONS] ?? Zap;
            return (
              <article
                key={f.slug}
                className="flex gap-5 rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#6366F1]/20">
                  <Icon className="h-6 w-6 text-[#6366F1]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{f.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.summary}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </SaasShell>
  );
}

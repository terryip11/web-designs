import Link from "next/link";
import { Check } from "lucide-react";
import SaasShell from "@/components/demos/saas/SaasShell";
import { SAAS_PLANS } from "@/lib/demo-sites/saas-data";

export default function SaasPricingPage({ basePath }: { basePath: string }) {
  return (
    <SaasShell basePath={basePath}>
      <section className="border-b border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">定價</h1>
          <p className="mt-2 text-slate-400">透明方案，按團隊規模選擇</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {SAAS_PLANS.map((plan) => (
            <div
              key={plan.slug}
              className={`rounded-xl border p-8 ${
                plan.highlighted
                  ? "border-[#6366F1] bg-[#6366F1]/10 shadow-lg shadow-indigo-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {plan.highlighted && (
                <span className="rounded-full bg-[#6366F1] px-3 py-0.5 text-xs text-white">
                  最受歡迎
                </span>
              )}
              <h2 className="mt-4 text-xl font-bold text-white">{plan.name}</h2>
              <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
              <p className="mt-6">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400">{plan.period}</span>
              </p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6366F1]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`${basePath}/contact`}
                className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-medium ${
                  plan.highlighted
                    ? "bg-[#6366F1] text-white hover:bg-indigo-500"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                選擇方案
              </Link>
            </div>
          ))}
        </div>
      </section>
    </SaasShell>
  );
}

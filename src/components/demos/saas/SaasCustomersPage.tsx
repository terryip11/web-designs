import Image from "next/image";
import SaasShell from "@/components/demos/saas/SaasShell";
import { SAAS_CUSTOMERS } from "@/lib/demo-sites/saas-data";

export default function SaasCustomersPage({ basePath }: { basePath: string }) {
  return (
    <SaasShell basePath={basePath}>
      <section className="border-b border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">客戶案例</h1>
          <p className="mt-2 text-slate-400">來自不同行業的信任與成果</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          {SAAS_CUSTOMERS.map((c) => (
            <article
              key={c.slug}
              className="grid gap-6 rounded-xl border border-white/10 bg-white/5 p-8 md:grid-cols-[auto_1fr]"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                <Image src={c.logo} alt={c.company} fill className="object-cover" sizes="64px" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#6366F1]">
                  {c.company} · {c.industry}
                </p>
                <blockquote className="mt-3 text-lg leading-relaxed text-slate-200">
                  &ldquo;{c.quote}&rdquo;
                </blockquote>
                <p className="mt-4 text-sm text-slate-500">
                  — {c.author}，{c.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SaasShell>
  );
}

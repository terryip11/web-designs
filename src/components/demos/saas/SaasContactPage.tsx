import { Mail, MapPin, Phone } from "lucide-react";
import SaasShell from "@/components/demos/saas/SaasShell";
import { SAAS_BRAND } from "@/lib/demo-sites/saas-data";

export default function SaasContactPage({ basePath }: { basePath: string }) {
  return (
    <SaasShell basePath={basePath}>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold text-white">聯絡我們</h1>
            <p className="mt-4 text-slate-400">預約 Demo 或查詢 Enterprise 方案。表單為展示用。</p>
            <ul className="mt-10 space-y-4 text-slate-300">
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-[#6366F1]" />
                {SAAS_BRAND.phone}
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-[#6366F1]" />
                {SAAS_BRAND.email}
              </li>
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-[#6366F1]" />
                {SAAS_BRAND.address}
              </li>
            </ul>
          </div>
          <form className="rounded-xl border border-white/10 bg-white/5 p-8">
            <div className="space-y-5">
              <input
                type="text"
                placeholder="姓名"
                className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white outline-none focus:border-[#6366F1]"
              />
              <input
                type="text"
                placeholder="公司"
                className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white outline-none focus:border-[#6366F1]"
              />
              <select className="w-full rounded-lg border border-white/20 bg-[#0F172A] px-4 py-2.5 text-sm text-white outline-none focus:border-[#6366F1]">
                <option value="">感興趣的方案</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <textarea
                rows={4}
                placeholder="訊息"
                className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white outline-none focus:border-[#6366F1]"
              />
              <button
                type="button"
                className="w-full rounded-lg bg-[#6366F1] py-3 font-medium text-white hover:bg-indigo-500"
              >
                提交（展示用）
              </button>
            </div>
          </form>
        </div>
      </section>
    </SaasShell>
  );
}

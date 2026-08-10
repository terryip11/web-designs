import { Mail, Phone } from "lucide-react";
import EcommerceShell from "@/components/demos/ecommerce/EcommerceShell";
import { ECOMMERCE_BRAND } from "@/lib/demo-sites/ecommerce-data";

export default function EcommerceContactPage({ basePath }: { basePath: string }) {
  return (
    <EcommerceShell basePath={basePath}>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold text-white">聯絡我們</h1>
            <p className="mt-4 text-white/60">查詢商品、訂單或合作。表單為展示用。</p>
            <ul className="mt-10 space-y-4 text-white/70">
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-[#E94560]" />
                {ECOMMERCE_BRAND.phone}
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-[#E94560]" />
                {ECOMMERCE_BRAND.email}
              </li>
              <li>{ECOMMERCE_BRAND.address}</li>
            </ul>
          </div>
          <form className="rounded-xl border border-white/10 bg-white/5 p-8">
            <div className="space-y-5">
              <input
                type="text"
                placeholder="姓名"
                className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white outline-none focus:border-[#E94560]"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white outline-none focus:border-[#E94560]"
              />
              <textarea
                rows={4}
                placeholder="訊息"
                className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white outline-none focus:border-[#E94560]"
              />
              <button
                type="button"
                className="w-full rounded-full bg-[#E94560] py-3 font-medium text-white hover:bg-[#d63850]"
              >
                提交（展示用）
              </button>
            </div>
          </form>
        </div>
      </section>
    </EcommerceShell>
  );
}

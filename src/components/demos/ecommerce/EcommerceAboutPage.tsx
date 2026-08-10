import EcommerceShell from "@/components/demos/ecommerce/EcommerceShell";
import { ECOMMERCE_BRAND } from "@/lib/demo-sites/ecommerce-data";

export default function EcommerceAboutPage({ basePath }: { basePath: string }) {
  return (
    <EcommerceShell basePath={basePath}>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">關於 NOIR</h1>
        <p className="mt-6 leading-relaxed text-white/70">
          {ECOMMERCE_BRAND.name} 成立於香港，專注引入獨立設計師及小型工坊的優質單品。我們相信少而精的選品，比大量 SKU 更能傳達品牌質感。
        </p>
        <p className="mt-4 leading-relaxed text-white/70">
          實體店位於銅鑼灣 Fashion Walk，同時提供網上選購及門市取貨。所有商品均附正品保證及 14 天退換政策（展示文案）。
        </p>
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {[
            { value: "2019", label: "創立" },
            { value: "200+", label: "精選 SKU" },
            { value: "4.9", label: "顧客評分" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold text-[#E94560]">{s.value}</p>
              <p className="mt-1 text-xs text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </EcommerceShell>
  );
}

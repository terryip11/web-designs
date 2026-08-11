import Image from "next/image";
import { notFound } from "next/navigation";
import EcommerceAboutPage from "@/components/demos/ecommerce/EcommerceAboutPage";
import PropertyShell from "@/components/demos/property/PropertyShell";
import RestaurantAboutPage from "@/components/demos/restaurant/RestaurantAboutPage";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { PROPERTY_BRAND } from "@/lib/demo-sites/property-data";
import { RESTAURANT_BRAND } from "@/lib/demo-sites/restaurant-data";
import { ECOMMERCE_BRAND } from "@/lib/demo-sites/ecommerce-data";
import { demoImage } from "@/lib/images/url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved) return { title: "Demo — DesignPick" };
  if (resolved.variant === "restaurant") {
    return { title: `關於我們 — ${RESTAURANT_BRAND.name}` };
  }
  if (resolved.variant === "ecommerce") {
    return { title: `關於 — ${ECOMMERCE_BRAND.name}` };
  }
  if (resolved.variant !== "property") {
    return { title: "Demo — DesignPick" };
  }
  return { title: `關於我們 — ${PROPERTY_BRAND.name}` };
}

export default async function DemoAboutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved) notFound();

  const { basePath, variant } = resolved;

  if (variant === "restaurant") {
    return <RestaurantAboutPage basePath={basePath} />;
  }

  if (variant === "ecommerce") {
    return <EcommerceAboutPage basePath={basePath} />;
  }

  if (variant !== "property") notFound();

  return (
    <PropertyShell basePath={basePath}>
      <section className="relative overflow-hidden py-20">
        <Image
          src={demoImage("demos/shared/about-hero.jpg")}
          alt="辦公室"
          fill
          className="object-cover opacity-20"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-semibold text-[#1C1917]">關於麗致物業</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#57534E]">
            成立於香港，專注服務高端住宅及商業物業市場。我們相信每一次置業都應有清晰資訊、專業跟進同長遠信任。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">我們的理念</h2>
            <p className="mt-4 leading-relaxed text-[#57534E]">
              不追求放盤數量，而係為每位客戶配對最合適嘅物業。由初次睇樓到簽約，團隊提供透明報價、市場分析同法律流程支援。
            </p>
            <p className="mt-4 leading-relaxed text-[#57534E]">
              服務範圍涵蓋港島豪宅、九龍核心同新界優質屋苑，以及中環、金鐘甲級寫字樓租賃。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "15+", label: "年行業經驗" },
              { value: "800+", label: "成功成交" },
              { value: "98%", label: "客戶滿意度" },
              { value: "24h", label: "回覆承諾" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#92400E]/10 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-3xl font-bold text-[#92400E]">{stat.value}</p>
                <p className="mt-1 text-sm text-[#57534E]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PropertyShell>
  );
}

import Image from "next/image";
import { notFound } from "next/navigation";
import PropertyShell from "@/components/demos/property/PropertyShell";
import { getDemoByTemplateId } from "@/lib/demo-sites/registry";
import { PROPERTY_BRAND } from "@/lib/demo-sites/property-data";

const TEMPLATE_ID = "property-luxe-09";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (id !== TEMPLATE_ID) return { title: "Demo — DesignPick" };
  return { title: `關於我們 — ${PROPERTY_BRAND.name}` };
}

export default async function DemoAboutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const demo = getDemoByTemplateId(id);
  if (!demo || demo.status !== "live" || id !== TEMPLATE_ID) notFound();

  const basePath = `/demos/${id}`;

  return (
    <PropertyShell basePath={basePath}>
      <section className="relative overflow-hidden py-20">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80"
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

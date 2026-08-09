import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
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
  return { title: `聯絡我們 — ${PROPERTY_BRAND.name}` };
}

export default async function DemoContactPage({
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
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-[#1C1917]">聯絡我們</h1>
            <p className="mt-4 text-[#57534E]">
              留下查詢，我們會在 24 小時內回覆。此為 DesignPick 模板展示，表單不會提交真實資料。
            </p>
            <ul className="mt-10 space-y-6">
              <li className="flex gap-4">
                <Phone className="mt-0.5 h-5 w-5 text-[#92400E]" />
                <div>
                  <p className="font-medium text-[#1C1917]">電話</p>
                  <p className="text-sm text-[#57534E]">{PROPERTY_BRAND.phone}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Mail className="mt-0.5 h-5 w-5 text-[#92400E]" />
                <div>
                  <p className="font-medium text-[#1C1917]">Email</p>
                  <p className="text-sm text-[#57534E]">{PROPERTY_BRAND.email}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 text-[#92400E]" />
                <div>
                  <p className="font-medium text-[#1C1917]">地址</p>
                  <p className="text-sm text-[#57534E]">{PROPERTY_BRAND.address}</p>
                </div>
              </li>
            </ul>
          </div>

          <form className="rounded-2xl border border-[#92400E]/10 bg-white p-8 shadow-sm">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#1C1917]">姓名</label>
                <input
                  type="text"
                  placeholder="您的姓名"
                  className="mt-1.5 w-full rounded-lg border border-[#92400E]/20 px-4 py-2.5 text-sm outline-none focus:border-[#92400E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917]">電話</label>
                <input
                  type="tel"
                  placeholder="+852"
                  className="mt-1.5 w-full rounded-lg border border-[#92400E]/20 px-4 py-2.5 text-sm outline-none focus:border-[#92400E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1917]">查詢內容</label>
                <textarea
                  rows={4}
                  placeholder="想睇邊區？預算範圍？"
                  className="mt-1.5 w-full rounded-lg border border-[#92400E]/20 px-4 py-2.5 text-sm outline-none focus:border-[#92400E]"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-full bg-[#92400E] py-3 font-medium text-[#FFFBEB] hover:bg-[#78350F]"
              >
                提交查詢（展示用）
              </button>
            </div>
          </form>
        </div>
      </section>
    </PropertyShell>
  );
}

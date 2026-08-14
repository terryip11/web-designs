import Link from "next/link";
import { ExternalLink } from "lucide-react";
import DemosPageShowcase from "@/components/demos/DemosPageShowcase";
import { getTemplateById } from "@/lib/data";
import { DEMO_SITES } from "@/lib/demo-sites/registry";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "模板展示站",
  description: "desigpick-digital 完整網站 Demo，依行業瀏覽展示站，供客戶預覽交付品質。",
  path: "/demos",
});

export default function DemosIndexPage() {
  const comingSoon = DEMO_SITES.filter((d) => d.status === "coming-soon");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold text-white">模板展示站</h1>
        <p className="mt-3 text-zinc-400">
          完整可瀏覽的 Demo 網站，展示 desigpick-digital 模板的實際交付品質。精選模板可綁定獨立子網域，作為長期品牌展示。
        </p>
      </div>

      <section className="mb-14">
        <h2 className="mb-4 text-lg font-semibold text-white">已上線 Demo</h2>
        <DemosPageShowcase />
      </section>

      {comingSoon.length > 0 && (
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">即將推出</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoon.map((demo) => {
            const template = getTemplateById(demo.templateId);
            if (!template) return null;
            return (
              <div
                key={demo.templateId}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
              >
                <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-500">
                  製作中
                </span>
                <h3 className="mt-3 font-semibold text-zinc-300">{template.name}</h3>
                <p className="mt-2 text-sm text-zinc-500">{demo.tagline}</p>
                <Link
                  href={`/templates/${demo.templateId}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm text-violet-400 hover:underline"
                >
                  查看介面詳情
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
      )}
    </div>
  );
}

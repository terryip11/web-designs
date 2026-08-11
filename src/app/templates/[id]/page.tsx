import Link from "next/link";
import { notFound } from "next/navigation";
import TemplateDemoSection from "@/components/TemplateDemoSection";
import TemplateDetailActions from "@/components/TemplateDetailActions";
import { formatPrice, getTemplateById, templates } from "@/lib/data";
import { getDemoByTemplateId } from "@/lib/demo-sites/registry";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getEstimatedDeliveryWeeks } from "@/lib/template-meta";

export function generateStaticParams() {
  return templates.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = getTemplateById(id);
  if (!template) {
    return buildPageMetadata({
      title: "模板詳情",
      path: `/templates/${id}`,
    });
  }

  return buildPageMetadata({
    title: template.name,
    description: `${template.category} · ${template.style.join("、")} · 適合${template.suitableFor}`,
    path: `/templates/${id}`,
  });
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = getTemplateById(id);
  if (!template) notFound();

  const demo = getDemoByTemplateId(id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <TemplateDemoSection templateId={id} />
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
              {template.category}
            </span>
            {template.style.map((s) => (
              <span
                key={s}
                className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400"
              >
                {s}
              </span>
            ))}
            {demo?.status === "live" && (
              <span className="rounded-md bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-400">
                完整 Demo
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-white">{template.name}</h1>
          <p className="mt-2 text-zinc-400">適合：{template.suitableFor}</p>

          <p className="mt-6 text-2xl font-bold text-violet-400">
            {formatPrice(template.basePrice)}{" "}
            <span className="text-base font-normal text-zinc-500">起 · 香港參考價</span>
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            預估交付：{getEstimatedDeliveryWeeks(template)} 週（視素材準備進度）
          </p>

          <div className="mt-8">
            <h2 className="font-semibold text-white">包含頁面</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {template.includedPages.map((page) => (
                <li
                  key={page}
                  className="rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300"
                >
                  {page}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold text-white">配色</h2>
            <div className="mt-3 flex items-center gap-3">
              {template.colors.map((color) => (
                <div key={color} className="text-center">
                  <div
                    className="h-10 w-10 rounded-full ring-2 ring-zinc-700"
                    style={{ backgroundColor: color }}
                  />
                  <p className="mt-1 text-xs text-zinc-500">{color}</p>
                </div>
              ))}
            </div>
          </div>

          <TemplateDetailActions templateId={template.id} />

          <Link
            href="/templates"
            className="mt-6 inline-block text-sm text-zinc-500 hover:text-zinc-300"
          >
            ← 返回介面庫
          </Link>
        </div>
      </div>
    </div>
  );
}

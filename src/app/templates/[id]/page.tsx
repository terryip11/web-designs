import Link from "next/link";
import { notFound } from "next/navigation";
import { Monitor, Smartphone } from "lucide-react";
import DevicePreview from "@/components/DevicePreview";
import TemplateDetailActions from "@/components/TemplateDetailActions";
import { formatPrice, getTemplateById, templates } from "@/lib/data";
import { getEstimatedDeliveryWeeks } from "@/lib/template-meta";

export function generateStaticParams() {
  return templates.map((t) => ({ id: t.id }));
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = getTemplateById(id);
  if (!template) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Previews */}
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
              <Monitor className="h-4 w-4" />
              桌面版預覽
            </div>
            <DevicePreview template={template} device="desktop" catalogMode />
          </div>
          <div className="max-w-xs">
            <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
              <Smartphone className="h-4 w-4" />
              手機版預覽
            </div>
            <DevicePreview template={template} device="mobile" catalogMode />
          </div>
        </div>

        {/* Info */}
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

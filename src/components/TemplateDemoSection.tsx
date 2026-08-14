import Link from "next/link";
import { ExternalLink, Smartphone } from "lucide-react";
import DemoPreviewFrame from "@/components/demos/DemoPreviewFrame";
import { getDemoByTemplateId } from "@/lib/demo-sites/registry";
import { getDemoPath } from "@/lib/demo-sites/urls";

export default function TemplateDemoSection({
  templateId,
}: {
  templateId: string;
}) {
  const demo = getDemoByTemplateId(templateId);
  const demoPath = getDemoPath(templateId);

  if (!demo || demo.status !== "live" || !demoPath) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 p-8 text-center">
        <p className="text-zinc-400">完整 Demo 網站製作中</p>
        <Link href="/demos" className="mt-3 inline-block text-sm text-violet-400 hover:underline">
          查看已上線展示站 →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-emerald-400">完整 Demo 已上線</p>
          <p className="mt-1 text-sm text-zinc-500">
            {demo.brandName} · 可分享予客戶預覽交付品質
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={demoPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
          >
            開啟 Demo 網站
            <ExternalLink className="h-4 w-4" />
          </Link>
          <Link
            href={`${demoPath}?hidebar=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 hover:border-zinc-600"
          >
            全螢幕（無展示列）
          </Link>
        </div>
      </div>

      <DemoPreviewFrame
        src={`${demoPath}?embed=1`}
        title={`${demo.brandName} — desigpick-digital Demo`}
      />

      <p className="flex items-center gap-2 text-xs text-zinc-600">
        <Smartphone className="h-3.5 w-3.5" />
        手機版請用「開啟 Demo 網站」在新分頁瀏覽，或使用子網域分享予客戶。
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Pencil } from "lucide-react";
import { useConfiguratorStore } from "@/store/configurator-store";
import { useSketchStore } from "@/store/sketch-store";

export default function TemplateDetailActions({
  templateId,
}: {
  templateId: string;
}) {
  const router = useRouter();
  const setTemplate = useConfiguratorStore((s) => s.setTemplate);
  const applyTemplateToActivePage = useSketchStore((s) => s.applyTemplateToActivePage);
  const setLinkedTemplate = useSketchStore((s) => s.setLinkedTemplate);

  function handleSketchFromTemplate() {
    if (
      useSketchStore.getState().hasSketch() &&
      !confirm("將以這款介面的結構覆蓋目前作用中頁面的草圖。繼續？")
    ) {
      return;
    }
    if (applyTemplateToActivePage(templateId)) {
      setLinkedTemplate(templateId);
      router.push("/sketch");
    }
  }

  return (
    <div className="mt-10 space-y-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setTemplate(templateId);
            setLinkedTemplate(templateId);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-500"
        >
          選擇此介面
          <ArrowRight className="h-4 w-4" />
        </button>
        <Link
          href={`/configure?template=${templateId}`}
          onClick={() => {
            setTemplate(templateId);
            setLinkedTemplate(templateId);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
        >
          選擇並配置功能
        </Link>
        <button
          type="button"
          onClick={handleSketchFromTemplate}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3 font-medium text-emerald-300 transition-colors hover:border-emerald-500/60"
        >
          <Pencil className="h-4 w-4" />
          用此結構畫草圖
        </button>
      </div>
      <p className="text-xs text-zinc-600">
        「用此結構畫草圖」會依此模板的頁面架構生成 wireframe，再到草圖畫板微調。
      </p>
    </div>
  );
}

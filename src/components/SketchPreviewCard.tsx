"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, ExternalLink } from "lucide-react";
import { SKETCH_CANVAS } from "@/lib/sketch-blocks";
import { exportSketchPng } from "@/lib/sketch-canvas";
import { useSketchStore } from "@/store/sketch-store";

export default function SketchPreviewCard() {
  const title = useSketchStore((s) => s.title);
  const pages = useSketchStore((s) => s.pages);
  const updatedAt = useSketchStore((s) => s.updatedAt);
  const hasSketch = useSketchStore((s) => s.hasSketch());
  const [previews, setPreviews] = useState<
    { pageName: string; device: string; url: string }[]
  >([]);

  useEffect(() => {
    const items = pages
      .filter((p) => p.elements.length > 0)
      .map((page) => {
        const size = SKETCH_CANVAS[page.device];
        return {
          pageName: page.name,
          device: page.device,
          url: exportSketchPng(page.elements, size.width, size.height),
        };
      })
      .filter((p) => p.url);
    setPreviews(items);
  }, [pages]);

  if (!hasSketch) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 p-6">
        <div className="flex items-start gap-3">
          <Pencil className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
          <div>
            <h3 className="font-semibold text-white">介面草圖</h3>
            <p className="mt-1 text-sm text-zinc-500">
              還沒有草圖。可以先在{" "}
              <Link href="/sketch" className="text-violet-400 hover:underline">
                草圖畫板
              </Link>{" "}
              勾勒想法，再回來提交需求。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">介面草圖</h3>
          <p className="mt-1 text-sm text-zinc-400">{title}</p>
          <p className="mt-0.5 text-xs text-zinc-600">
            {previews.length} 頁草圖
            {updatedAt &&
              ` · 更新於 ${new Date(updatedAt).toLocaleString("zh-HK")}`}
          </p>
        </div>
        <Link
          href="/sketch"
          className="flex shrink-0 items-center gap-1 text-xs text-violet-400 hover:underline"
        >
          編輯 <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {previews.map((p) => (
          <div key={p.pageName}>
            <p className="mb-1 text-xs text-zinc-500">
              {p.pageName}（{p.device === "desktop" ? "桌面" : "手機"}）
            </p>
            <div className="overflow-hidden rounded-lg border border-zinc-700 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.pageName}
                className="max-h-48 w-full object-contain object-top"
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        提交需求時會自動上傳所有草圖頁面 PNG
      </p>
    </div>
  );
}

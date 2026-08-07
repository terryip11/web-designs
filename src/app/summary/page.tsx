"use client";

import Link from "next/link";
import { Copy, Check, Printer, Monitor, Smartphone } from "lucide-react";
import { useState } from "react";
import DevicePreview from "@/components/DevicePreview";
import SketchPreviewCard from "@/components/SketchPreviewCard";
import SaveConfigButton from "@/components/SaveConfigButton";
import RevealOnScroll from "@/components/RevealOnScroll";
import { formatPrice, getFeatureById, PRICE_DISCLAIMER } from "@/lib/data";
import {
  getDesignSelectionLabels,
  getSelectedDesignOptions,
} from "@/lib/design-options";
import { useConfiguratorStore } from "@/store/configurator-store";

export default function SummaryPage() {
  const template = useConfiguratorStore((s) => s.getTemplate());
  const selectedFeatureIds = useConfiguratorStore((s) => s.selectedFeatureIds);
  const designSelections = useConfiguratorStore((s) => s.designSelections);
  const totalPrice = useConfiguratorStore((s) => s.getTotalPrice());
  const [copied, setCopied] = useState(false);

  const selectedFeatures = selectedFeatureIds
    .map((id) => getFeatureById(id))
    .filter(Boolean);

  const design = getSelectedDesignOptions(designSelections);
  const designLabels = getDesignSelectionLabels(designSelections);

  async function copySummary() {
    if (!template) return;
    const text = [
      "【DesignPick 方案摘要】",
      "",
      `介面：${template.name}`,
      `行業：${template.category}`,
      `基礎價格（HKD）：${formatPrice(template.basePrice)}`,
      "",
      "設計細節：",
      `  • 版面：${designLabels.layout}`,
      `  • 導航：${designLabels.navigation.join("、")}`,
      `  • 動效：${designLabels.animationTier}`,
      `  • Hero：${designLabels.heroType}`,
      "",
      "功能模組：",
      ...selectedFeatures.map((f) =>
        f
          ? `  • ${f.name}${f.included ? "（已包含）" : f.price ? ` (+${formatPrice(f.price)})` : ""}`
          : ""
      ),
      "",
      `參考總價（HKD）：${formatPrice(totalPrice)}`,
      "",
      `* ${PRICE_DISCLAIMER}`,
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!template) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-white">尚無方案摘要</h1>
        <p className="mt-4 text-zinc-500">
          請先選擇介面、設計細節與功能，再查看完整摘要。
        </p>
        <Link
          href="/templates"
          className="mt-8 inline-block rounded-lg bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-500"
        >
          前往介面庫
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <RevealOnScroll>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">方案摘要</h1>
            <p className="mt-2 text-zinc-500">
              您的專屬方案，價格參考香港市場行情（HKD）
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copySummary}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "已複製" : "複製摘要"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white"
            >
              <Printer className="h-4 w-4" />
              列印
            </button>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.08}>
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
          <div className="border-b border-zinc-800 bg-violet-600/10 px-8 py-6">
            <p className="text-sm text-violet-400">DesignPick 方案摘要</p>
            <h2 className="mt-1 text-2xl font-bold text-white">{template.name}</h2>
            <p className="mt-1 text-zinc-400">{template.suitableFor}</p>
          </div>

          <div className="grid gap-8 p-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs text-zinc-500">
                  <Monitor className="h-3.5 w-3.5" />
                  桌面預覽
                </div>
                <DevicePreview
                  template={template}
                  device="desktop"
                  layoutId={designSelections.layoutId}
                  navigationIds={designSelections.navigationIds}
                  animationTierId={designSelections.animationTierId}
                  heroTypeId={designSelections.heroTypeId}
                  showAnimationDemo
                />
              </div>
              <div className="max-w-[160px]">
                <div className="mb-2 flex items-center gap-1.5 text-xs text-zinc-500">
                  <Smartphone className="h-3.5 w-3.5" />
                  手機預覽
                </div>
                <DevicePreview
                  template={template}
                  device="mobile"
                  layoutId={designSelections.layoutId}
                  navigationIds={designSelections.navigationIds}
                  animationTierId={designSelections.animationTierId}
                  heroTypeId={designSelections.heroTypeId}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-zinc-500">介面資訊</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-zinc-400">行業</dt>
                    <dd className="text-white">{template.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-400">風格</dt>
                    <dd className="text-white">{template.style.join("、")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-400">基礎價格（HKD）</dt>
                    <dd className="text-white">{formatPrice(template.basePrice)}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-500">設計細節</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-400">版面配置</dt>
                    <dd className="text-right text-white">
                      {design.layout?.name}
                      {design.layout && design.layout.price > 0 && (
                        <span className="ml-1 text-zinc-500">
                          (+{formatPrice(design.layout.price)})
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="shrink-0 text-zinc-400">導航設計</dt>
                    <dd className="text-right text-white">
                      {design.navigation.map((n) => n.name).join("、")}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-400">動效等級</dt>
                    <dd className="text-right text-white">
                      {design.animationTier?.name}
                      {design.animationTier && design.animationTier.price > 0 && (
                        <span className="ml-1 text-zinc-500">
                          (+{formatPrice(design.animationTier.price)})
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-400">Hero 區塊</dt>
                    <dd className="text-right text-white">
                      {design.heroType?.name}
                      {design.heroType && design.heroType.price > 0 && (
                        <span className="ml-1 text-zinc-500">
                          (+{formatPrice(design.heroType.price)})
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-500">包含頁面</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {template.includedPages.map((p) => (
                    <li
                      key={p}
                      className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-500">已選功能</h3>
                <ul className="mt-3 space-y-2">
                  {selectedFeatures.map((f) =>
                    f ? (
                      <li key={f.id} className="flex justify-between text-sm">
                        <span className="text-zinc-300">{f.name}</span>
                        <span className="text-zinc-500">
                          {f.included
                            ? "已包含"
                            : f.price === 0
                              ? "免費"
                              : `+${formatPrice(f.price)}`}
                        </span>
                      </li>
                    ) : null
                  )}
                </ul>
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">
                    參考總價（香港行情）
                  </span>
                  <span className="text-2xl font-bold text-violet-400">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-600">* {PRICE_DISCLAIMER}</p>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.12}>
        <div className="mt-8">
          <SketchPreviewCard />
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.15}>
        <div className="mt-8 flex flex-wrap gap-4">
          <SaveConfigButton />
          <Link
            href="/configure"
            className="rounded-lg border border-zinc-700 px-6 py-3 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white"
          >
            修改選配
          </Link>
          <Link
            href="/contact"
            className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500"
          >
            提交需求
          </Link>
        </div>
      </RevealOnScroll>
    </div>
  );
}

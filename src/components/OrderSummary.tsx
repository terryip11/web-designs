"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Feature, Template } from "@/types";
import { formatPrice, getFeatureById, PRICE_DISCLAIMER } from "@/lib/data";
import { getSelectedDesignOptions } from "@/lib/design-options";
import { useConfiguratorStore } from "@/store/configurator-store";

interface OrderSummaryProps {
  template?: Template | undefined;
  selectedFeatureIds?: string[];
  totalPrice?: number;
  showActions?: boolean;
}

export default function OrderSummary({
  template: templateProp,
  selectedFeatureIds: featureIdsProp,
  totalPrice: totalPriceProp,
  showActions = true,
}: OrderSummaryProps) {
  const storeTemplate = useConfiguratorStore((s) => s.getTemplate());
  const storeFeatureIds = useConfiguratorStore((s) => s.selectedFeatureIds);
  const designSelections = useConfiguratorStore((s) => s.designSelections);
  const storeTotalPrice = useConfiguratorStore((s) => s.getTotalPrice());

  const template = templateProp ?? storeTemplate;
  const selectedFeatureIds = featureIdsProp ?? storeFeatureIds;
  const totalPrice = totalPriceProp ?? storeTotalPrice;

  if (!template) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="font-semibold text-white">方案摘要</h3>
        <p className="mt-3 text-sm text-zinc-500">
          尚未選擇介面，請先從{" "}
          <Link href="/templates" className="text-violet-400 hover:underline">
            介面庫
          </Link>{" "}
          挑選一款。
        </p>
      </div>
    );
  }

  const selectedFeatures = selectedFeatureIds
    .map((id) => getFeatureById(id))
    .filter(Boolean) as Feature[];

  const design = getSelectedDesignOptions(designSelections);
  const designItems = [
    design.layout,
    ...design.navigation.filter((n) => !n.included || n.price > 0),
    design.animationTier,
    design.heroType,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 className="font-semibold text-white">方案摘要</h3>

      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <p className="text-sm text-zinc-500">選定介面</p>
            <p className="font-medium text-white">{template.name}</p>
          </div>
          <span className="text-sm text-zinc-400">
            {formatPrice(template.basePrice)}
          </span>
        </div>

        <div>
          <p className="mb-2 text-sm text-zinc-500">設計細節</p>
          <ul className="space-y-2">
            {design.layout && (
              <li className="flex justify-between text-sm">
                <span className="text-zinc-400">版面</span>
                <span className="text-zinc-300">{design.layout.name}</span>
              </li>
            )}
            {design.navigation.length > 0 && (
              <li className="flex justify-between text-sm">
                <span className="text-zinc-400">導航</span>
                <span className="max-w-[55%] text-right text-zinc-300">
                  {design.navigation.map((n) => n.name).join("、")}
                </span>
              </li>
            )}
            {design.animationTier && (
              <li className="flex justify-between text-sm">
                <span className="text-zinc-400">動效</span>
                <span className="text-zinc-300">{design.animationTier.name}</span>
              </li>
            )}
            {design.heroType && (
              <li className="flex justify-between text-sm">
                <span className="text-zinc-400">Hero</span>
                <span className="text-zinc-300">{design.heroType.name}</span>
              </li>
            )}
          </ul>
          {designItems.some((d) => d && !d.included && d.price > 0) && (
            <ul className="mt-2 space-y-1 border-t border-zinc-800/60 pt-2">
              {designItems
                .filter((d) => d && (!d.included || d.price > 0) && d.price > 0)
                .map((d) =>
                  d ? (
                    <li key={d.id} className="flex justify-between text-xs">
                      <span className="text-zinc-500">{d.name}</span>
                      <span className="text-zinc-500">+{formatPrice(d.price)}</span>
                    </li>
                  ) : null
                )}
            </ul>
          )}
        </div>

        {selectedFeatures.length > 0 && (
          <div>
            <p className="mb-2 text-sm text-zinc-500">功能模組</p>
            <ul className="space-y-2">
              {selectedFeatures.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-zinc-300">{f.name}</span>
                  <span className="text-zinc-500">
                    {f.included
                      ? "含"
                      : f.price === 0
                        ? "免費"
                        : `+${formatPrice(f.price)}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
          <span className="font-semibold text-white">參考總價（香港行情）</span>
          <span className="text-xl font-bold text-violet-400">
            {formatPrice(totalPrice)}
          </span>
        </div>

        <p className="text-xs text-zinc-600">* {PRICE_DISCLAIMER}</p>
      </div>

      {showActions && (
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/summary"
            className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
          >
            查看完整摘要
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
          >
            提交需求
          </Link>
        </div>
      )}
    </div>
  );
}

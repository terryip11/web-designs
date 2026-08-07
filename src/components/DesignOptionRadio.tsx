"use client";

import { Info } from "lucide-react";
import type { DesignOption } from "@/types";
import { formatPrice } from "@/lib/data";
import HoverTooltip from "@/components/HoverTooltip";

interface DesignOptionRadioProps {
  option: DesignOption;
  checked: boolean;
  onSelect: () => void;
  groupName: string;
  suggested?: boolean;
  /** 滑鼠移入 ℹ️ 圖示時顯示的詳細說明 */
  detailTooltip?: string[];
}

export default function DesignOptionRadio({
  option,
  checked,
  onSelect,
  groupName,
  suggested,
  detailTooltip,
}: DesignOptionRadioProps) {
  return (
    <label
      className={`group/option flex w-full cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all ${
        checked
          ? "border-violet-500/50 bg-violet-500/10"
          : suggested
            ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60"
            : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
      }`}
    >
      <input
        type="radio"
        name={groupName}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          checked
            ? "border-violet-500 bg-violet-600"
            : "border-zinc-600 bg-zinc-950"
        }`}
      >
        {checked && <div className="h-2 w-2 rounded-full bg-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-medium text-white">
            {option.name}
            {detailTooltip && detailTooltip.length > 0 && (
              <HoverTooltip
                content={
                  <span className="block space-y-1.5 text-xs leading-relaxed">
                    {detailTooltip.map((line, i) =>
                      line.startsWith("•") ? (
                        <span key={i} className="block text-zinc-400">
                          {line}
                        </span>
                      ) : line.endsWith("：") || line.includes("含") ? (
                        <span
                          key={i}
                          className={`block ${i === 0 ? "text-zinc-200" : "text-zinc-500"}`}
                        >
                          {line}
                        </span>
                      ) : (
                        <span key={i} className="block text-zinc-200">
                          {line}
                        </span>
                      )
                    )}
                  </span>
                }
              >
                <span
                  className="inline-flex rounded-full p-0.5 text-zinc-500 transition-colors hover:text-violet-400"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => e.preventDefault()}
                >
                  <Info className="h-3.5 w-3.5" aria-label="查看詳細說明" />
                </span>
              </HoverTooltip>
            )}
            {suggested && !checked && (
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-normal text-emerald-300">
                草圖建議
              </span>
            )}
          </span>
          <span className="shrink-0 text-sm text-violet-400">
            {option.included
              ? "已包含"
              : option.price === 0
                ? "免費"
                : `+${formatPrice(option.price)}`}
          </span>
        </div>
        <p className="mt-1 text-sm text-zinc-500">{option.description}</p>
      </div>
    </label>
  );
}

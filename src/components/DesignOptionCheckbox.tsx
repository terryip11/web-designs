"use client";

import { Check } from "lucide-react";
import type { DesignOption } from "@/types";
import { formatPrice } from "@/lib/data";

interface DesignOptionCheckboxProps {
  option: DesignOption;
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  suggested?: boolean;
}

export default function DesignOptionCheckbox({
  option,
  checked,
  disabled = false,
  onToggle,
  suggested,
}: DesignOptionCheckboxProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all ${
        checked
          ? "border-violet-500/50 bg-violet-500/10"
          : suggested
            ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60"
            : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
          checked
            ? "border-violet-500 bg-violet-600"
            : "border-zinc-600 bg-zinc-950"
        }`}
      >
        {checked && <Check className="h-3.5 w-3.5 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-white">
            {option.name}
            {suggested && !checked && (
              <span className="ml-2 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-normal text-emerald-300">
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
    </button>
  );
}

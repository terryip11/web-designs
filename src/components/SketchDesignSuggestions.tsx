"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, Check, X } from "lucide-react";
import {
  applyDesignSuggestions,
  getSuggestedOptionIds,
  suggestDesignFromSketch,
} from "@/lib/sketch-design-suggest";
import {
  analyzeSketch,
  formatSketchBlockSummary,
  hasSketchContent,
} from "@/lib/sketch-template-match";
import { useConfiguratorStore } from "@/store/configurator-store";
import { useSketchStore } from "@/store/sketch-store";

const SESSION_KEY = "desigpick-digital-sketch-suggestions-applied";

export function useSketchDesignSuggestions(onApplied?: () => void) {
  const pages = useSketchStore((s) => s.pages);
  const setLayout = useConfiguratorStore((s) => s.setLayout);
  const setHeroType = useConfiguratorStore((s) => s.setHeroType);
  const setAnimationTier = useConfiguratorStore((s) => s.setAnimationTier);
  const toggleNavigation = useConfiguratorStore((s) => s.toggleNavigation);
  const toggleFeature = useConfiguratorStore((s) => s.toggleFeature);

  const sketchSummary = useMemo(() => {
    if (!hasSketchContent(pages)) return null;
    const profile = analyzeSketch(pages);
    const blocks = formatSketchBlockSummary(profile.blockCounts);
    const anim =
      profile.animatedBlockCount > 0
        ? ` · ${profile.animatedBlockCount} 個進場特效`
        : "";
    return blocks ? `${blocks}${anim}` : null;
  }, [pages]);

  const suggestions = useMemo(
    () => suggestDesignFromSketch(pages),
    [pages]
  );
  const suggestedIds = useMemo(
    () => getSuggestedOptionIds(suggestions),
    [suggestions]
  );

  const [dismissed, setDismissed] = useState(false);
  const [applied, setApplied] = useState(false);

  function applyAll() {
    const state = useConfiguratorStore.getState();
    applyDesignSuggestions(suggestions, {
      setLayout,
      setHeroType,
      setAnimationTier,
      toggleNavigation,
      toggleFeature,
      designSelections: state.designSelections,
      selectedFeatureIds: state.selectedFeatureIds,
    });
    setApplied(true);
    onApplied?.();
  }

  useEffect(() => {
    if (!hasSketchContent(pages) || suggestions.length === 0) return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    applyAll();
    sessionStorage.setItem(SESSION_KEY, "1");
  }, [pages, suggestions]);

  const banner =
    !hasSketchContent(pages) || suggestions.length === 0 || dismissed ? null : (
      <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">草圖選配建議</span>
              {applied && (
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px]">
                  已自動套用
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              依你的 wireframe 結構，以下選項較吻合：
            </p>
            {sketchSummary && (
              <p className="mt-1 text-xs text-zinc-600">
                草圖元件：{sketchSummary}
              </p>
            )}
            <ul className="mt-3 space-y-1.5">
              {suggestions.map((s) => (
                <li
                  key={`${s.field}-${s.optionId}`}
                  className="text-xs text-zinc-500"
                >
                  <span className="text-emerald-300">{s.name}</span>
                  <span className="text-zinc-600"> — {s.reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                applyAll();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-500"
            >
              <Check className="h-3.5 w-3.5" /> 重新套用
            </button>
            <Link
              href="/sketch"
              className="text-center text-xs text-zinc-500 hover:text-zinc-300"
            >
              編輯草圖
            </Link>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="inline-flex items-center justify-center gap-1 text-xs text-zinc-600 hover:text-zinc-400"
            >
              <X className="h-3 w-3" /> 關閉
            </button>
          </div>
        </div>
      </div>
    );

  return { suggestedIds, banner };
}

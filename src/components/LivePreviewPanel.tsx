"use client";

import { Monitor, Smartphone, Sparkles } from "lucide-react";
import type { Template } from "@/types";
import type { DesignSelections } from "@/types";
import {
  getAnimationTierById,
  getHeroTypeById,
  getLayoutById,
} from "@/lib/design-options";
import DevicePreview from "./DevicePreview";

interface LivePreviewPanelProps {
  template: Template;
  designSelections: DesignSelections;
  showAnimationDemo: boolean;
  onTriggerAnimation: () => void;
  compact?: boolean;
}

export default function LivePreviewPanel({
  template,
  designSelections,
  showAnimationDemo,
  onTriggerAnimation,
  compact = false,
}: LivePreviewPanelProps) {
  const layout = getLayoutById(designSelections.layoutId);
  const hero = getHeroTypeById(designSelections.heroTypeId);
  const tier = getAnimationTierById(designSelections.animationTierId);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-white">即時預覽</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {layout?.name}
            {hero ? (
              <span className="text-violet-400"> · Hero：{hero.name}</span>
            ) : null}
            {tier && tier.id !== "standard" ? ` · ${tier.name}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onTriggerAnimation}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-violet-500/40 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300 hover:bg-violet-500/20"
        >
          <Sparkles className="h-3 w-3" />
          動效
        </button>
      </div>

      {compact ? (
        <DevicePreview
          template={template}
          device="desktop"
          layoutId={designSelections.layoutId}
          navigationIds={designSelections.navigationIds}
          animationTierId={designSelections.animationTierId}
          heroTypeId={designSelections.heroTypeId}
          showAnimationDemo={showAnimationDemo}
        />
      ) : (
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-1 text-[10px] text-zinc-500">
              <Monitor className="h-3 w-3" />
              桌面
            </div>
            <DevicePreview
              template={template}
              device="desktop"
              layoutId={designSelections.layoutId}
              navigationIds={designSelections.navigationIds}
              animationTierId={designSelections.animationTierId}
              heroTypeId={designSelections.heroTypeId}
              showAnimationDemo={showAnimationDemo}
            />
          </div>
          <div className="w-[88px] shrink-0">
            <div className="mb-1.5 flex items-center gap-1 text-[10px] text-zinc-500">
              <Smartphone className="h-3 w-3" />
              手機
            </div>
            <DevicePreview
              template={template}
              device="mobile"
              layoutId={designSelections.layoutId}
              navigationIds={designSelections.navigationIds}
              animationTierId={designSelections.animationTierId}
              heroTypeId={designSelections.heroTypeId}
              showAnimationDemo={showAnimationDemo}
            />
          </div>
        </div>
      )}
    </div>
  );
}

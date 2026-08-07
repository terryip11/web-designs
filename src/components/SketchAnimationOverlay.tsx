"use client";

import type { SketchBlock } from "@/types/sketch";
import {
  blockPreviewStyle,
  getAnimationClass,
  getBlockDisplayLabel,
  getPreviewDelay,
} from "@/lib/sketch-animations";

interface SketchAnimationOverlayProps {
  blocks: SketchBlock[];
  previewTick: number;
  playing: boolean;
  canvasHeight: number;
  staggerMs: number;
}

export default function SketchAnimationOverlay({
  blocks,
  previewTick,
  playing,
  canvasHeight,
  staggerMs,
}: SketchAnimationOverlayProps) {
  if (!playing) return null;

  const animated = blocks.filter((b) => b.animation && b.animation !== "none");
  if (animated.length === 0) return null;

  return (
    <div
      key={previewTick}
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
      aria-hidden
    >
      {animated.map((block, index) => {
        const animClass = getAnimationClass(block.animation);
        const label = getBlockDisplayLabel(block);
        const isButton = block.blockType === "button";
        const delay = getPreviewDelay(block, index, canvasHeight, staggerMs);

        return (
          <div
            key={block.id}
            className={`absolute flex items-center justify-center overflow-hidden rounded-sm px-2 text-center leading-tight shadow-md ${animClass}`}
            style={{
              left: block.x,
              top: block.y,
              width: block.w,
              height: block.h,
              animationDelay: `${delay}ms`,
              fontSize: Math.min(13, Math.max(9, block.h * 0.28)),
              ...blockPreviewStyle(block),
            }}
          >
            <span
              className={`line-clamp-3 ${isButton ? "font-medium text-white" : "text-zinc-600"}`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

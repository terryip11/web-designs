"use client";

import type { SketchBlock } from "@/types/sketch";
import {
  blockPreviewStyle,
  getBlockDisplayLabel,
  isHoverLiftBlock,
} from "@/lib/sketch-animations";

interface SketchHoverOverlayProps {
  block: SketchBlock | null;
}

export default function SketchHoverOverlay({ block }: SketchHoverOverlayProps) {
  if (!block || !isHoverLiftBlock(block)) return null;

  const label = getBlockDisplayLabel(block);
  const isButton = block.blockType === "button";

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
      aria-hidden
    >
      <div
        className="sketch-hover-lift-active absolute flex items-center justify-center overflow-hidden rounded-sm px-2 text-center leading-tight"
        style={{
          left: block.x,
          top: block.y,
          width: block.w,
          height: block.h,
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
    </div>
  );
}

import type { CSSProperties } from "react";
import type { SketchAnimation, SketchBlock, SketchBlockType } from "@/types/sketch";
import { BLOCK_META, getBlockDisplayLabel } from "@/lib/sketch-blocks";

export type StaggerSpeed = "fast" | "medium" | "slow";

export const STAGGER_MS: Record<StaggerSpeed, number> = {
  fast: 55,
  medium: 90,
  slow: 140,
};

export const STAGGER_OPTIONS: { value: StaggerSpeed; label: string }[] = [
  { value: "fast", label: "快" },
  { value: "medium", label: "中" },
  { value: "slow", label: "慢" },
];

export const ANIMATION_OPTIONS: {
  value: SketchAnimation;
  label: string;
  hint: string;
  group: "enter" | "interaction";
}[] = [
  { value: "none", label: "無", hint: "不套用特效", group: "enter" },
  { value: "fade-in", label: "淡入", hint: "透明度漸現", group: "enter" },
  { value: "slide-up", label: "由下飛入", hint: "自下方滑入", group: "enter" },
  { value: "slide-down", label: "由上飛入", hint: "自上方滑入", group: "enter" },
  { value: "slide-left", label: "由右飛入", hint: "自右側滑入", group: "enter" },
  { value: "slide-right", label: "由左飛入", hint: "自左側滑入", group: "enter" },
  { value: "zoom-in", label: "放大進入", hint: "由小變大", group: "enter" },
  { value: "bounce-in", label: "彈跳進入", hint: "彈性放大", group: "enter" },
  { value: "flip-in", label: "翻轉進入", hint: "3D 翻轉", group: "enter" },
  {
    value: "scroll-reveal",
    label: "捲動進場",
    hint: "模擬向下捲動時依序出現",
    group: "enter",
  },
  {
    value: "blur-in",
    label: "模糊淡入",
    hint: "由模糊到清晰",
    group: "enter",
  },
  {
    value: "rotate-in",
    label: "旋轉進入",
    hint: "旋轉並淡入",
    group: "enter",
  },
  {
    value: "hover-lift",
    label: "懸停上浮",
    hint: "滑鼠移過按鈕／卡片時上浮（預覽可見）",
    group: "interaction",
  },
];

const HOVER_LIFT_TYPES: SketchBlockType[] = ["button", "card"];

export function isHoverLiftBlock(block: SketchBlock): boolean {
  return (
    block.animation === "hover-lift" &&
    HOVER_LIFT_TYPES.includes(block.blockType)
  );
}

export function getAnimationClass(animation: SketchAnimation | undefined): string {
  if (!animation || animation === "none") return "";
  return `sketch-anim-${animation}`;
}

export function getStaggerDelay(index: number, staggerMs: number): number {
  return index * staggerMs;
}

export function getScrollRevealDelay(
  block: SketchBlock,
  canvasHeight: number,
  spreadMs = 950
): number {
  const maxY = Math.max(canvasHeight - block.h, 1);
  return (block.y / maxY) * spreadMs;
}

export function getPreviewDelay(
  block: SketchBlock,
  index: number,
  canvasHeight: number,
  staggerMs: number
): number {
  if (block.animation === "scroll-reveal") {
    return getScrollRevealDelay(block, canvasHeight);
  }
  return getStaggerDelay(index, staggerMs);
}

export function estimatePreviewDuration(
  blocks: SketchBlock[],
  canvasHeight: number,
  staggerMs = 90,
  animMs = 700
): number {
  const animated = blocks.filter((b) => b.animation && b.animation !== "none");
  if (animated.length === 0) return 0;

  let maxDelay = 0;
  animated.forEach((block, index) => {
    maxDelay = Math.max(
      maxDelay,
      getPreviewDelay(block, index, canvasHeight, staggerMs)
    );
  });
  return maxDelay + animMs + 250;
}

export function blockPreviewStyle(block: SketchBlock): CSSProperties {
  const meta = BLOCK_META[block.blockType];
  const isButton = block.blockType === "button";
  return {
    backgroundColor: meta.fill,
    color: isButton ? "#ffffff" : "#52525b",
    border: "1px solid #71717a",
  };
}

export { getBlockDisplayLabel };

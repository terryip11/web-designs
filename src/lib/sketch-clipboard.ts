import type { SketchAnimation, SketchElement } from "@/types/sketch";
import { clampBlock } from "@/lib/sketch-blocks";
import { cloneElements } from "@/lib/sketch-canvas";

const PASTE_OFFSET = 16;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** 右鍵選單快速特效 */
export const QUICK_ANIMATION_PRESETS: {
  value: SketchAnimation;
  label: string;
}[] = [
  { value: "none", label: "無" },
  { value: "fade-in", label: "淡入" },
  { value: "slide-up", label: "由下飛入" },
  { value: "scroll-reveal", label: "捲動進場" },
];

export function cloneElementWithNewId(
  element: SketchElement,
  canvasWidth: number,
  canvasHeight: number,
  at?: { x: number; y: number }
): SketchElement {
  const [cloned] = cloneElements([element]);
  const id = uid();

  if (cloned.type === "block") {
    let x = cloned.x + PASTE_OFFSET;
    let y = cloned.y + PASTE_OFFSET;
    if (at) {
      x = at.x - cloned.w / 2;
      y = at.y - cloned.h / 2;
    }
    const clamped = clampBlock({ x, y, w: cloned.w, h: cloned.h }, canvasWidth, canvasHeight);
    return { ...cloned, id, ...clamped };
  }

  const dx = at ? at.x - (cloned.points[0]?.x ?? 0) : PASTE_OFFSET;
  const dy = at ? at.y - (cloned.points[0]?.y ?? 0) : PASTE_OFFSET;
  return {
    ...cloned,
    id,
    points: cloned.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
  };
}

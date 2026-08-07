import type { AlignmentGuide, SketchBlock } from "@/types/sketch";

const SNAP_THRESHOLD = 6;

function blockEdges(block: SketchBlock) {
  return {
    left: block.x,
    right: block.x + block.w,
    centerX: block.x + block.w / 2,
    top: block.y,
    bottom: block.y + block.h,
    centerY: block.y + block.h / 2,
  };
}

export function snapBlockPosition(
  moving: SketchBlock,
  others: SketchBlock[],
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number; guides: AlignmentGuide[] } {
  let { x, y, w, h } = moving;
  const guides: AlignmentGuide[] = [];

  const xTargets: number[] = [];
  const yTargets: number[] = [];
  for (const other of others) {
    if (other.id === moving.id) continue;
    const e = blockEdges(other);
    xTargets.push(e.left, e.centerX, e.right);
    yTargets.push(e.top, e.centerY, e.bottom);
  }

  let bestDx = SNAP_THRESHOLD + 1;
  let bestDy = SNAP_THRESHOLD + 1;

  for (const target of xTargets) {
    for (const [edge, offset] of [
      [x, 0],
      [x + w / 2, -w / 2],
      [x + w, -w],
    ] as const) {
      const diff = target - edge;
      if (Math.abs(diff) <= SNAP_THRESHOLD && Math.abs(diff) < bestDx) {
        bestDx = Math.abs(diff);
        x = x + diff;
        guides.push({ orientation: "vertical", position: target });
      }
    }
  }

  for (const target of yTargets) {
    for (const [edge, offset] of [
      [y, 0],
      [y + h / 2, -h / 2],
      [y + h, -h],
    ] as const) {
      const diff = target - edge;
      if (Math.abs(diff) <= SNAP_THRESHOLD && Math.abs(diff) < bestDy) {
        bestDy = Math.abs(diff);
        y = y + diff;
        guides.push({ orientation: "horizontal", position: target });
      }
    }
  }

  x = Math.max(0, Math.min(x, canvasWidth - w));
  y = Math.max(0, Math.min(y, canvasHeight - h));

  return { x, y, guides };
}

export function dedupeGuides(guides: AlignmentGuide[]): AlignmentGuide[] {
  const seen = new Set<string>();
  return guides.filter((g) => {
    const key = `${g.orientation}:${Math.round(g.position)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

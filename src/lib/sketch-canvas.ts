import type { AlignmentGuide, SketchBlock, SketchElement, SketchStroke } from "@/types/sketch";
import { BLOCK_META, getBlockDisplayLabel, GRID_SIZE } from "@/lib/sketch-blocks";
import { ANIMATION_OPTIONS } from "@/lib/sketch-animations";

export type ResizeHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

const HANDLE_SIZE = 10;
const HANDLE_HIT = 14;

export function drawSketchCanvas(
  ctx: CanvasRenderingContext2D,
  elements: SketchElement[],
  selectedId: string | null,
  width: number,
  height: number,
  options?: {
    showGrid?: boolean;
    ghostBlock?: Pick<SketchBlock, "blockType" | "x" | "y" | "w" | "h" | "label"> | null;
    alignmentGuides?: AlignmentGuide[];
    hoverHandle?: ResizeHandle | null;
    /** 特效預覽播放中：隱藏已設特效的元件（由 HTML overlay 顯示） */
    animPreviewPlaying?: boolean;
    /** 懸停預覽中隱藏原元件 */
    hoverPreviewBlockId?: string | null;
  }
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  if (options?.showGrid) {
    drawGrid(ctx, width, height);
  }

  ctx.strokeStyle = "#e4e4e7";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
  ctx.setLineDash([]);

  for (const el of elements) {
    if (el.type === "block") {
      if (
        options?.animPreviewPlaying &&
        el.animation &&
        el.animation !== "none"
      ) {
        continue;
      }
      if (options?.hoverPreviewBlockId && el.id === options.hoverPreviewBlockId) {
        continue;
      }
      drawBlock(ctx, el, el.id === selectedId);
    } else drawStroke(ctx, el);
  }

  if (options?.ghostBlock) {
    drawBlock(ctx, { id: "ghost", type: "block", ...options.ghostBlock }, false, 0.45);
  }

  if (options?.alignmentGuides?.length) {
    drawAlignmentGuides(ctx, options.alignmentGuides, width, height);
  }

  if (selectedId) {
    const selected = elements.find((el) => el.id === selectedId && el.type === "block");
    if (selected && selected.type === "block") {
      drawResizeHandles(ctx, selected, options?.hoverHandle ?? null);
    }
  }
}

function drawAlignmentGuides(
  ctx: CanvasRenderingContext2D,
  guides: AlignmentGuide[],
  width: number,
  height: number
) {
  ctx.strokeStyle = "#ec4899";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 4]);
  for (const g of guides) {
    ctx.beginPath();
    if (g.orientation === "vertical") {
      ctx.moveTo(g.position + 0.5, 0);
      ctx.lineTo(g.position + 0.5, height);
    } else {
      ctx.moveTo(0, g.position + 0.5);
      ctx.lineTo(width, g.position + 0.5);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = "#f4f4f5";
  ctx.lineWidth = 1;
  for (let x = GRID_SIZE; x < width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }
  for (let y = GRID_SIZE; y < height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }
}

function drawBlock(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  selected: boolean,
  alpha = 1
) {
  const meta = BLOCK_META[block.blockType];
  const stroke = selected ? "#7c3aed" : alpha < 1 ? "#a78bfa" : "#71717a";

  ctx.globalAlpha = alpha;
  ctx.fillStyle = meta.fill;
  ctx.fillRect(block.x, block.y, block.w, block.h);

  ctx.strokeStyle = stroke;
  ctx.lineWidth = selected ? 2 : 1;

  switch (block.blockType) {
    case "divider":
      drawDividerBlock(ctx, block, stroke, alpha);
      break;
    case "input":
    case "search":
      ctx.setLineDash(alpha < 1 ? [6, 4] : [6, 4]);
      ctx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1);
      ctx.setLineDash([]);
      drawBlockLabel(ctx, block, { left: true, light: false, alpha });
      break;
    case "checkbox":
      drawCheckboxBlock(ctx, block, stroke, alpha);
      break;
    case "sidebar":
      drawSidebarBlock(ctx, block, stroke, alpha);
      break;
    case "tabs":
      drawTabsBlock(ctx, block, stroke, alpha);
      break;
    case "table":
      drawTableBlock(ctx, block, stroke, alpha);
      break;
    case "form":
      drawFormBlock(ctx, block, stroke, alpha);
      break;
    case "video":
      drawVideoBlock(ctx, block, stroke, alpha);
      break;
    case "pricing":
      drawPricingBlock(ctx, block, stroke, alpha);
      break;
    case "faq":
      drawFaqBlock(ctx, block, stroke, alpha);
      break;
    case "map":
      drawMapBlock(ctx, block, stroke, alpha);
      break;
    default:
      ctx.setLineDash(alpha < 1 ? [6, 4] : []);
      ctx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1);
      ctx.setLineDash([]);
      drawBlockLabel(ctx, block, {
        left: false,
        light: block.blockType === "button",
        alpha,
      });
  }

  if (alpha >= 1) drawAnimationBadge(ctx, block);
}

function drawAnimationBadge(ctx: CanvasRenderingContext2D, block: SketchBlock) {
  if (!block.animation || block.animation === "none") return;

  const tag =
    ANIMATION_OPTIONS.find((o) => o.value === block.animation)?.label ?? "FX";
  const badgeW = Math.min(52, Math.max(28, tag.length * 7 + 10));
  const badgeH = 14;
  const x = block.x + block.w - badgeW - 4;
  const y = block.y + 4;

  if (x < block.x || badgeW > block.w - 8) return;

  ctx.globalAlpha = 0.95;
  ctx.fillStyle = "#7c3aed";
  ctx.beginPath();
  ctx.roundRect(x, y, badgeW, badgeH, 3);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "9px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(tag.length > 4 ? "✦ FX" : tag, x + badgeW / 2, y + badgeH / 2 + 0.5);
  ctx.globalAlpha = 1;
}

function drawDividerBlock(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  stroke: string,
  alpha: number
) {
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1);
  ctx.setLineDash([]);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(block.x + 8, block.y + block.h / 2);
  ctx.lineTo(block.x + block.w - 8, block.y + block.h / 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawBlockLabel(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  options: { left: boolean; light: boolean; alpha: number }
) {
  const label = getBlockDisplayLabel(block);
  if (!label) {
    ctx.globalAlpha = 1;
    return;
  }

  ctx.globalAlpha = options.alpha;
  ctx.fillStyle = options.light ? "#ffffff" : "#52525b";
  ctx.font = `${Math.min(13, Math.max(10, block.h * 0.28))}px system-ui, sans-serif`;
  ctx.textAlign = options.left ? "left" : "center";
  ctx.textBaseline = "middle";
  wrapText(
    ctx,
    label,
    options.left ? block.x + 10 : block.x + block.w / 2,
    block.y + block.h / 2,
    block.w - (options.left ? 20 : 12),
    Math.min(16, Math.max(12, block.h * 0.32))
  );
  ctx.globalAlpha = 1;
}

function drawCheckboxBlock(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  stroke: string,
  alpha: number
) {
  ctx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1);
  const box = Math.min(14, block.h - 8);
  const bx = block.x + 8;
  const by = block.y + (block.h - box) / 2;
  ctx.strokeStyle = stroke;
  ctx.strokeRect(bx + 0.5, by + 0.5, box - 1, box - 1);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#52525b";
  ctx.font = `${Math.min(12, block.h * 0.4)}px system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const label = getBlockDisplayLabel(block);
  ctx.fillText(label, bx + box + 8, block.y + block.h / 2, block.w - box - 24);
  ctx.globalAlpha = 1;
}

function drawSidebarBlock(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  stroke: string,
  alpha: number
) {
  ctx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1);
  ctx.fillStyle = "#e4e4e7";
  ctx.fillRect(block.x, block.y, block.w, Math.min(36, block.h * 0.12));
  ctx.strokeStyle = "#d4d4d8";
  ctx.beginPath();
  ctx.moveTo(block.x + block.w - 0.5, block.y);
  ctx.lineTo(block.x + block.w - 0.5, block.y + block.h);
  ctx.stroke();
  ctx.strokeStyle = stroke;
  drawBlockLabel(ctx, block, { left: true, light: false, alpha });
}

function drawTabsBlock(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  stroke: string,
  alpha: number
) {
  ctx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1);
  const tabCount = 3;
  const tabW = block.w / tabCount;
  const tabH = Math.min(block.h * 0.65, 32);
  ctx.strokeStyle = "#d4d4d8";
  for (let i = 1; i < tabCount; i++) {
    ctx.beginPath();
    ctx.moveTo(block.x + tabW * i + 0.5, block.y);
    ctx.lineTo(block.x + tabW * i + 0.5, block.y + tabH);
    ctx.stroke();
  }
  ctx.fillStyle = "#f4f4f5";
  ctx.fillRect(block.x, block.y, tabW, tabH);
  ctx.strokeStyle = stroke;
  ctx.strokeRect(block.x + 0.5, block.y + 0.5, tabW - 1, tabH - 1);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#52525b";
  ctx.font = `${Math.min(11, tabH * 0.38)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const parts = getBlockDisplayLabel(block).split("·").map((s) => s.trim());
  for (let i = 0; i < tabCount; i++) {
    ctx.fillText(
      parts[i] ?? `Tab ${i + 1}`,
      block.x + tabW * i + tabW / 2,
      block.y + tabH / 2,
      tabW - 8
    );
  }
  ctx.globalAlpha = 1;
}

function drawTableBlock(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  stroke: string,
  alpha: number
) {
  ctx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1);
  const cols = 3;
  const rows = 4;
  const cellW = block.w / cols;
  const cellH = block.h / rows;
  ctx.strokeStyle = "#e4e4e7";
  for (let c = 1; c < cols; c++) {
    ctx.beginPath();
    ctx.moveTo(block.x + cellW * c + 0.5, block.y);
    ctx.lineTo(block.x + cellW * c + 0.5, block.y + block.h);
    ctx.stroke();
  }
  for (let r = 1; r < rows; r++) {
    ctx.beginPath();
    ctx.moveTo(block.x, block.y + cellH * r + 0.5);
    ctx.lineTo(block.x + block.w, block.y + cellH * r + 0.5);
    ctx.stroke();
  }
  ctx.fillStyle = "#f4f4f5";
  ctx.fillRect(block.x, block.y, block.w, cellH);
  ctx.strokeStyle = stroke;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#52525b";
  ctx.font = `${Math.min(11, cellH * 0.45)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const headers = getBlockDisplayLabel(block).split("·").map((s) => s.trim());
  for (let c = 0; c < cols; c++) {
    ctx.fillText(
      headers[c] ?? `Col ${c + 1}`,
      block.x + cellW * c + cellW / 2,
      block.y + cellH / 2,
      cellW - 6
    );
  }
  ctx.globalAlpha = 1;
}

function drawFormBlock(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  stroke: string,
  alpha: number
) {
  ctx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#52525b";
  ctx.font = `bold ${Math.min(13, block.h * 0.12)}px system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(getBlockDisplayLabel(block), block.x + 12, block.y + 10, block.w - 24);
  const fieldH = Math.max(24, Math.min(32, block.h * 0.14));
  const gap = 10;
  let fy = block.y + 36;
  ctx.strokeStyle = "#d4d4d8";
  ctx.setLineDash([4, 3]);
  for (let i = 0; i < 3 && fy + fieldH < block.y + block.h - 12; i++) {
    ctx.strokeRect(block.x + 12, fy, block.w - 24, fieldH);
    fy += fieldH + gap;
  }
  ctx.setLineDash([]);
  ctx.strokeStyle = stroke;
  ctx.globalAlpha = 1;
}

function drawVideoBlock(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  stroke: string,
  alpha: number
) {
  ctx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1);
  const cx = block.x + block.w / 2;
  const cy = block.y + block.h / 2;
  const r = Math.min(block.w, block.h) * 0.12;
  ctx.globalAlpha = alpha * 0.9;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.4, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx - r * 0.4, cy + r);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#e4e4e7";
  ctx.font = `${Math.min(11, block.h * 0.1)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(getBlockDisplayLabel(block), cx, block.y + block.h - 8, block.w - 16);
  ctx.strokeStyle = stroke;
  ctx.globalAlpha = 1;
}

function drawPricingBlock(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  stroke: string,
  alpha: number
) {
  ctx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1);
  const cols = 3;
  const colW = block.w / cols;
  ctx.strokeStyle = "#e4e4e7";
  for (let i = 1; i < cols; i++) {
    ctx.beginPath();
    ctx.moveTo(block.x + colW * i + 0.5, block.y);
    ctx.lineTo(block.x + colW * i + 0.5, block.y + block.h);
    ctx.stroke();
  }
  ctx.fillStyle = "#f4f4f5";
  ctx.fillRect(block.x + colW, block.y, colW, block.h);
  ctx.strokeStyle = stroke;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#52525b";
  ctx.font = `${Math.min(12, block.h * 0.14)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const plans = getBlockDisplayLabel(block).split("·").map((s) => s.trim());
  for (let i = 0; i < cols; i++) {
    ctx.fillText(
      plans[i] ?? `方案 ${i + 1}`,
      block.x + colW * i + colW / 2,
      block.y + block.h * 0.2,
      colW - 8
    );
    ctx.font = `${Math.min(18, block.h * 0.22)}px system-ui, sans-serif`;
    ctx.fillText("$--", block.x + colW * i + colW / 2, block.y + block.h * 0.55);
    ctx.font = `${Math.min(12, block.h * 0.14)}px system-ui, sans-serif`;
  }
  ctx.globalAlpha = 1;
}

function drawFaqBlock(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  stroke: string,
  alpha: number
) {
  ctx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1);
  const rows = 3;
  const rowH = block.h / rows;
  ctx.strokeStyle = "#e4e4e7";
  for (let r = 1; r < rows; r++) {
    ctx.beginPath();
    ctx.moveTo(block.x, block.y + rowH * r + 0.5);
    ctx.lineTo(block.x + block.w, block.y + rowH * r + 0.5);
    ctx.stroke();
  }
  ctx.strokeStyle = stroke;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#52525b";
  ctx.font = `${Math.min(11, rowH * 0.38)}px system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const items = getBlockDisplayLabel(block).split("·").map((s) => s.trim());
  for (let r = 0; r < rows; r++) {
    const y = block.y + rowH * r + rowH / 2;
    ctx.fillText(`▸ ${items[r] ?? `問題 ${r + 1}`}`, block.x + 12, y, block.w - 36);
  }
  ctx.globalAlpha = 1;
}

function drawMapBlock(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  stroke: string,
  alpha: number
) {
  ctx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1);
  ctx.strokeStyle = "#bef264";
  ctx.lineWidth = 1;
  const step = 32;
  for (let x = block.x + step; x < block.x + block.w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, block.y);
    ctx.lineTo(x + 0.5, block.y + block.h);
    ctx.stroke();
  }
  for (let y = block.y + step; y < block.y + block.h; y += step) {
    ctx.beginPath();
    ctx.moveTo(block.x, y + 0.5);
    ctx.lineTo(block.x + block.w, y + 0.5);
    ctx.stroke();
  }
  ctx.strokeStyle = stroke;
  drawBlockLabel(ctx, block, { left: false, light: false, alpha });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = words[0] ?? "";

  for (let i = 1; i < words.length; i++) {
    const next = `${current} ${words[i]}`;
    if (ctx.measureText(next).width <= maxWidth) current = next;
    else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);

  const displayLines =
    lines.length > 3 ? [...lines.slice(0, 2), `${lines[2]}…`] : lines.slice(0, 3);
  const startY = y - ((displayLines.length - 1) * lineHeight) / 2;
  displayLines.forEach((line, i) => ctx.fillText(line, x, startY + i * lineHeight));
}

function drawResizeHandles(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  hoverHandle: ResizeHandle | null
) {
  const points = getHandlePoints(block);

  if (hoverHandle) {
    drawHandleEdgeHighlight(ctx, block, hoverHandle);
  }

  for (const [handle, p] of Object.entries(points) as [
    ResizeHandle,
    { x: number; y: number },
  ][]) {
    const isHover = handle === hoverHandle;
    const size = isHover ? HANDLE_SIZE + 4 : HANDLE_SIZE;
    ctx.fillStyle = isHover ? "#7c3aed" : "#ffffff";
    ctx.strokeStyle = isHover ? "#4c1d95" : "#7c3aed";
    ctx.lineWidth = isHover ? 2 : 1.5;
    ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
    ctx.strokeRect(
      p.x - size / 2 + 0.5,
      p.y - size / 2 + 0.5,
      size - 1,
      size - 1
    );
  }
}

function drawHandleEdgeHighlight(
  ctx: CanvasRenderingContext2D,
  block: SketchBlock,
  handle: ResizeHandle
) {
  const { x, y, w, h } = block;
  ctx.strokeStyle = "rgba(124, 58, 237, 0.85)";
  ctx.lineWidth = 2;
  ctx.setLineDash([]);

  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];

  if (handle === "n" || handle === "nw" || handle === "ne") {
    edges.push({ x1: x, y1: y, x2: x + w, y2: y });
  }
  if (handle === "s" || handle === "sw" || handle === "se") {
    edges.push({ x1: x, y1: y + h, x2: x + w, y2: y + h });
  }
  if (handle === "w" || handle === "nw" || handle === "sw") {
    edges.push({ x1: x, y1: y, x2: x, y2: y + h });
  }
  if (handle === "e" || handle === "ne" || handle === "se") {
    edges.push({ x1: x + w, y1: y, x2: x + w, y2: y + h });
  }

  for (const e of edges) {
    ctx.beginPath();
    ctx.moveTo(e.x1 + 0.5, e.y1 + 0.5);
    ctx.lineTo(e.x2 + 0.5, e.y2 + 0.5);
    ctx.stroke();
  }
}

export function getCursorForResizeHandle(handle: ResizeHandle): string {
  switch (handle) {
    case "nw":
    case "se":
      return "nwse-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
    default:
      return "default";
  }
}

function getHandlePoints(block: SketchBlock): Record<ResizeHandle, { x: number; y: number }> {
  const { x, y, w, h } = block;
  const cx = x + w / 2;
  const cy = y + h / 2;
  return {
    nw: { x, y },
    ne: { x: x + w, y },
    sw: { x, y: y + h },
    se: { x: x + w, y: y + h },
    n: { x: cx, y },
    s: { x: cx, y: y + h },
    e: { x: x + w, y: cy },
    w: { x, y: cy },
  };
}

export function hitTestResizeHandle(
  block: SketchBlock,
  x: number,
  y: number
): ResizeHandle | null {
  const points = getHandlePoints(block);
  let best: { handle: ResizeHandle; dist: number } | null = null;

  for (const [handle, p] of Object.entries(points) as [
    ResizeHandle,
    { x: number; y: number },
  ][]) {
    const dist = Math.hypot(x - p.x, y - p.y);
    if (dist <= HANDLE_HIT && (!best || dist < best.dist)) {
      best = { handle, dist };
    }
  }

  return best?.handle ?? null;
}

/** 從按下當下的原始尺寸縮放，避免每幀累積誤差造成跳動 */
export function resizeBlockFromStart(
  start: SketchBlock,
  handle: ResizeHandle,
  pointerX: number,
  pointerY: number,
  canvasWidth: number,
  canvasHeight: number
): Pick<SketchBlock, "x" | "y" | "w" | "h"> {
  const min = 24;
  const anchorRight = start.x + start.w;
  const anchorBottom = start.y + start.h;
  let x = start.x;
  let y = start.y;
  let w = start.w;
  let h = start.h;

  switch (handle) {
    case "se":
      w = Math.max(min, pointerX - start.x);
      h = Math.max(min, pointerY - start.y);
      break;
    case "sw":
      x = Math.max(0, Math.min(pointerX, anchorRight - min));
      w = anchorRight - x;
      h = Math.max(min, pointerY - start.y);
      break;
    case "ne":
      w = Math.max(min, pointerX - start.x);
      y = Math.max(0, Math.min(pointerY, anchorBottom - min));
      h = anchorBottom - y;
      break;
    case "nw":
      x = Math.max(0, Math.min(pointerX, anchorRight - min));
      w = anchorRight - x;
      y = Math.max(0, Math.min(pointerY, anchorBottom - min));
      h = anchorBottom - y;
      break;
    case "e":
      w = Math.max(min, pointerX - start.x);
      break;
    case "w":
      x = Math.max(0, Math.min(pointerX, anchorRight - min));
      w = anchorRight - x;
      break;
    case "s":
      h = Math.max(min, pointerY - start.y);
      break;
    case "n":
      y = Math.max(0, Math.min(pointerY, anchorBottom - min));
      h = anchorBottom - y;
      break;
  }

  w = Math.min(w, canvasWidth - x);
  h = Math.min(h, canvasHeight - y);
  w = Math.max(min, w);
  h = Math.max(min, h);

  return { x, y, w, h };
}

/** @deprecated 使用 resizeBlockFromStart */
export function resizeBlock(
  block: SketchBlock,
  handle: ResizeHandle,
  pointerX: number,
  pointerY: number,
  canvasWidth: number,
  canvasHeight: number
): Pick<SketchBlock, "x" | "y" | "w" | "h"> {
  return resizeBlockFromStart(
    block,
    handle,
    pointerX,
    pointerY,
    canvasWidth,
    canvasHeight
  );
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: SketchStroke) {
  if (stroke.points.length < 2) return;
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length; i++) {
    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  }
  ctx.stroke();
}

export function hitTestBlock(x: number, y: number, block: SketchBlock): boolean {
  return (
    x >= block.x &&
    x <= block.x + block.w &&
    y >= block.y &&
    y <= block.y + block.h
  );
}

export function findBlockAt(
  elements: SketchElement[],
  x: number,
  y: number
): SketchBlock | null {
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    if (el.type === "block" && hitTestBlock(x, y, el)) return el;
  }
  return null;
}

export function findStrokeAt(
  elements: SketchElement[],
  x: number,
  y: number,
  radius = 14
) {
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    if (el.type !== "stroke") continue;
    if (
      el.points.some(
        (p) => (p.x - x) ** 2 + (p.y - y) ** 2 <= radius ** 2
      )
    ) {
      return el;
    }
  }
  return null;
}

export function eraseStrokesAt(
  elements: SketchElement[],
  x: number,
  y: number,
  radius: number
): SketchElement[] {
  return elements.filter((el) => {
    if (el.type !== "stroke") return true;
    return !el.points.some(
      (p) => (p.x - x) ** 2 + (p.y - y) ** 2 <= radius ** 2
    );
  });
}

export function cloneElements(elements: SketchElement[]): SketchElement[] {
  return elements.map((el) =>
    el.type === "stroke"
      ? { ...el, points: el.points.map((p) => ({ ...p })) }
      : { ...el }
  );
}

export function exportSketchPng(
  elements: SketchElement[],
  width: number,
  height: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  drawSketchCanvas(ctx, elements, null, width, height);
  return canvas.toDataURL("image/png");
}

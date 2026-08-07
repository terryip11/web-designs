import type { SketchBlockType, SketchDevice, SketchElement } from "@/types/sketch";
import type { Template } from "@/types";
import { SKETCH_CANVAS } from "@/lib/sketch-blocks";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** 依介面模板結構生成可編輯的 wireframe 草圖 */
export function buildSketchFromTemplate(
  template: Template,
  device: SketchDevice = "desktop"
): SketchElement[] {
  const canvas = SKETCH_CANVAS[device];
  const margin = device === "mobile" ? 12 : 20;
  const fullW = canvas.width - margin * 2;
  let y = margin;
  const elements: SketchElement[] = [];

  function addBlock(
    blockType: SketchBlockType,
    label: string,
    h: number,
    x = margin,
    w = fullW
  ) {
    elements.push({
      id: uid(),
      type: "block",
      blockType,
      x,
      y,
      w,
      h,
      label,
    });
    y += h + (device === "mobile" ? 8 : 12);
  }

  addBlock("header", `${template.name} · Logo`, device === "mobile" ? 48 : 56);
  addBlock(
    "nav",
    template.includedPages.slice(0, device === "mobile" ? 4 : 5).join(" · "),
    device === "mobile" ? 40 : 48
  );
  addBlock("hero", template.suitableFor, device === "mobile" ? 140 : 180);

  const sections = template.includedPages.slice(0, device === "mobile" ? 2 : 3);
  for (const page of sections) {
    addBlock("section", page, device === "mobile" ? 90 : 110);
  }

  const cardPages = template.includedPages.slice(sections.length, sections.length + 3);
  if (cardPages.length > 0 && y < canvas.height - 120) {
    const cols = device === "mobile" ? 1 : Math.min(cardPages.length, 3);
    const gap = device === "mobile" ? 8 : 12;
    const cardW = cols === 1 ? fullW : (fullW - gap * (cols - 1)) / cols;
    const cardH = device === "mobile" ? 80 : 96;
    const rowY = y;

    cardPages.forEach((page, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      elements.push({
        id: uid(),
        type: "block",
        blockType: "card",
        x: margin + col * (cardW + gap),
        y: rowY + row * (cardH + gap),
        w: cardW,
        h: cardH,
        label: page,
      });
    });
    y = rowY + Math.ceil(cardPages.length / cols) * (cardH + gap);
  }

  addBlock("button", "主要行動按鈕", device === "mobile" ? 32 : 36);
  addBlock(
    "footer",
    `© ${template.category} · ${template.includedPages.length} 頁結構`,
    device === "mobile" ? 56 : 64
  );

  return elements;
}

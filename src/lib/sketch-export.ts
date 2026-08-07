import type { SketchPage, SketchPageExport } from "@/types/sketch";
import { SKETCH_CANVAS } from "@/lib/sketch-blocks";
import { exportSketchPng } from "@/lib/sketch-canvas";

export function exportAllSketchPages(pages: SketchPage[]): SketchPageExport[] {
  return pages
    .filter((p) => p.elements.length > 0)
    .map((page) => {
      const size = SKETCH_CANVAS[page.device];
      return {
        pageId: page.id,
        pageName: page.name,
        device: page.device,
        dataUrl: exportSketchPng(page.elements, size.width, size.height),
      };
    })
    .filter((p) => p.dataUrl);
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

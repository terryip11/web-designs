import { buildUploadKey, uploadToR2 } from "@/lib/r2/upload";
import { isR2Configured } from "@/lib/r2/env";

const MAX_SKETCH_BYTES = 5 * 1024 * 1024;

export interface SketchUploadInput {
  pageName: string;
  device: string;
  dataUrl: string;
}

export interface SketchUploadResult {
  pageName: string;
  device: string;
  url: string;
}

export async function uploadSketchPages(
  sketchPages: SketchUploadInput[]
): Promise<SketchUploadResult[]> {
  if (!isR2Configured() || sketchPages.length === 0) return [];

  const results: SketchUploadResult[] = [];

  for (const page of sketchPages) {
    const base64 = page.dataUrl.split(",")[1];
    if (!base64) continue;

    const buffer = Buffer.from(base64, "base64");
    if (buffer.byteLength > MAX_SKETCH_BYTES) {
      console.warn("Sketch page exceeds size limit:", page.pageName);
      continue;
    }

    if (!page.dataUrl.startsWith("data:image/png")) {
      console.warn("Sketch page invalid mime:", page.pageName);
      continue;
    }

    const safeName = page.pageName.replace(/[^\w\u4e00-\u9fff-]+/g, "-").slice(0, 40);
    const key = buildUploadKey(
      "uploads/sketches",
      `${safeName || "sketch"}.png`
    );

    const url = await uploadToR2({
      key,
      body: buffer,
      contentType: "image/png",
    });

    if (!url) continue;

    results.push({
      pageName: page.pageName,
      device: page.device,
      url,
    });
  }

  return results;
}

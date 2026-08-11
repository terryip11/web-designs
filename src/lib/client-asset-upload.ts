import type { ClientAssetInput } from "@/lib/client-asset-types";
import { isR2Configured } from "@/lib/r2/env";
import { buildUploadKey, uploadToR2 } from "@/lib/r2/upload";

const MAX_ASSET_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export async function uploadClientAssets(
  assets: ClientAssetInput[]
): Promise<string[]> {
  if (!isR2Configured() || assets.length === 0) return [];

  const urls: string[] = [];

  for (const asset of assets.slice(0, 5)) {
    const match = asset.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) continue;

    const mime = match[1];
    const base64 = match[2];
    if (!ALLOWED_MIME.includes(mime)) continue;

    const buffer = Buffer.from(base64, "base64");
    if (buffer.byteLength > MAX_ASSET_BYTES) continue;

    const ext =
      mime === "image/png"
        ? "png"
        : mime === "image/jpeg"
          ? "jpg"
          : mime === "image/webp"
            ? "webp"
            : "svg";
    const safeName = asset.fileName.replace(/[^\w.\u4e00-\u9fff-]+/g, "-").slice(0, 40);
    const key = buildUploadKey(
      "uploads/client-assets",
      `${safeName || "asset"}.${ext}`
    );

    const url = await uploadToR2({
      key,
      body: buffer,
      contentType: mime,
    });

    if (url) urls.push(url);
  }

  return urls;
}

import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ClientAssetInput } from "@/lib/client-asset-types";

const MAX_ASSET_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export async function uploadClientAssets(
  assets: ClientAssetInput[]
): Promise<string[]> {
  if (!isSupabaseConfigured() || assets.length === 0) return [];

  const supabase = createServerClient();
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
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}/${safeName || "asset"}.${ext}`;

    const { error } = await supabase.storage.from("client-assets").upload(path, buffer, {
      contentType: mime,
      upsert: false,
    });

    if (error) {
      console.error("Client asset upload error:", error);
      continue;
    }

    const { data } = supabase.storage.from("client-assets").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}

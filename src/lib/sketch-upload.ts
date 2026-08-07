import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

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
  if (!isSupabaseConfigured() || sketchPages.length === 0) return [];

  const supabase = createServerClient();
  const results: SketchUploadResult[] = [];

  for (const page of sketchPages) {
    const base64 = page.dataUrl.split(",")[1];
    if (!base64) continue;

    const buffer = Buffer.from(base64, "base64");
    const safeName = page.pageName.replace(/[^\w\u4e00-\u9fff-]+/g, "-").slice(0, 40);
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}/${safeName || "sketch"}.png`;

    const { error } = await supabase.storage.from("sketches").upload(path, buffer, {
      contentType: "image/png",
      upsert: false,
    });

    if (error) {
      console.error("Sketch upload error:", error);
      continue;
    }

    const { data } = supabase.storage.from("sketches").getPublicUrl(path);
    results.push({
      pageName: page.pageName,
      device: page.device,
      url: data.publicUrl,
    });
  }

  return results;
}

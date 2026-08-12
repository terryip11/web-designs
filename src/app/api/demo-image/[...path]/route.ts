import demoImageManifest from "@/lib/images/demo-image-manifest.json";
import { getR2PublicBaseUrl } from "@/lib/r2/env";

const fallbackByKey = Object.fromEntries(
  demoImageManifest.map((entry) => [entry.key, entry.source])
);

export const dynamic = "force-dynamic";

async function fetchImage(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const body = await res.arrayBuffer();
    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const key = path.join("/");

  if (!fallbackByKey[key] && !key.startsWith("demos/")) {
    return new Response("Not found", { status: 404 });
  }

  const r2Base = getR2PublicBaseUrl();
  if (r2Base) {
    const fromR2 = await fetchImage(`${r2Base}/${key}`);
    if (fromR2) return fromR2;
  }

  const fallback = fallbackByKey[key];
  if (fallback) {
    const fromFallback = await fetchImage(fallback);
    if (fromFallback) return fromFallback;
  }

  return new Response("Not found", { status: 404 });
}

import demoImageManifest from "@/lib/images/demo-image-manifest.json";
import { getR2PublicBaseUrl } from "@/lib/r2/env";

const fallbackByKey = Object.fromEntries(
  demoImageManifest.map((entry) => [entry.key, entry.source])
);

/** Public URL for a stored object key (R2) or Unsplash fallback from the demo manifest. */
export function publicImageUrl(key: string): string {
  const normalized = key.replace(/^\//, "");
  const fallback = fallbackByKey[normalized];
  const r2Base = getR2PublicBaseUrl();

  if (r2Base) {
    return `${r2Base}/${normalized}`;
  }

  return fallback ?? "";
}

/**
 * Demo site images: served via `/api/demo-image/` so the server can read R2
 * and fall back to Unsplash without relying on client DNS for the R2 subdomain.
 */
export function demoImage(key: string): string {
  const normalized = key.replace(/^\//, "");
  if (fallbackByKey[normalized]) {
    return `/api/demo-image/${normalized}`;
  }
  return publicImageUrl(normalized);
}

import demoImageManifest from "@/lib/images/demo-image-manifest.json";
import { getR2PublicBaseUrl } from "@/lib/r2/env";

const fallbackByKey = Object.fromEntries(
  demoImageManifest.map((entry) => [entry.key, entry.source])
);

/** Public URL for a stored object key (R2) or Unsplash fallback when R2 URL is not configured. */
export function publicImageUrl(key: string): string {
  const normalized = key.replace(/^\//, "");
  const r2Base = getR2PublicBaseUrl();

  if (r2Base) {
    return `${r2Base}/${normalized}`;
  }

  return fallbackByKey[normalized] ?? "";
}

/** Shorthand for demo site images stored under `demos/`. */
export function demoImage(key: string): string {
  return publicImageUrl(key);
}

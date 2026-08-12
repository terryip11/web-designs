import demoImageManifest from "@/lib/images/demo-image-manifest.json";
import { getR2PublicBaseUrl } from "@/lib/r2/env";

const fallbackByKey = Object.fromEntries(
  demoImageManifest.map((entry) => [entry.key, entry.source])
);

/**
 * Public URL for a stored object key (R2) or Unsplash fallback from the demo manifest.
 * Demo keys in the manifest use Unsplash until `NEXT_PUBLIC_USE_R2_DEMO_IMAGES=true`
 * (after running `npm run sync-demo-images`).
 */
export function publicImageUrl(key: string): string {
  const normalized = key.replace(/^\//, "");
  const fallback = fallbackByKey[normalized];
  const r2Base = getR2PublicBaseUrl();
  const useR2DemoImages = process.env.NEXT_PUBLIC_USE_R2_DEMO_IMAGES === "true";

  if (fallback && !useR2DemoImages) {
    return fallback;
  }

  if (r2Base) {
    return `${r2Base}/${normalized}`;
  }

  return fallback ?? "";
}

/** Shorthand for demo site images stored under `demos/`. */
export function demoImage(key: string): string {
  return publicImageUrl(key);
}

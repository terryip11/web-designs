/**
 * One-time script: download demo images and upload to Cloudflare R2.
 *
 * Usage (from project root, with .env.local loaded):
 *   node --env-file=.env.local scripts/sync-demo-images-to-r2.mjs
 *
 * Requires: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifestPath = join(
  __dirname,
  "../src/lib/images/demo-image-manifest.json"
);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
  console.error(
    "Missing R2 env vars. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME"
  );
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

async function uploadEntry({ key, source }) {
  const res = await fetch(source);
  if (!res.ok) {
    throw new Error(`Failed to download ${source}: ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") ?? "image/jpeg";

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  console.log(`Uploaded ${key}`);
}

let failed = 0;

for (const entry of manifest) {
  try {
    await uploadEntry(entry);
  } catch (error) {
    failed += 1;
    console.error(`Failed ${entry.key}:`, error.message);
  }
}

console.log(
  `\nDone. ${manifest.length - failed}/${manifest.length} uploaded to bucket "${bucket}".`
);

if (failed > 0) process.exit(1);

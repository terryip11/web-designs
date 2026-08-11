import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2PublicBaseUrl } from "@/lib/r2/env";
import { getR2Client } from "@/lib/r2/client";

export interface R2UploadInput {
  key: string;
  body: Buffer;
  contentType: string;
}

export async function uploadToR2({
  key,
  body,
  contentType,
}: R2UploadInput): Promise<string | null> {
  const client = getR2Client();
  const publicBase = getR2PublicBaseUrl();

  if (!client || !publicBase) {
    console.warn("[R2] Missing credentials or NEXT_PUBLIC_R2_PUBLIC_URL");
    return null;
  }

  const normalizedKey = key.replace(/^\//, "");

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: normalizedKey,
        Body: body,
        ContentType: contentType,
      })
    );

    return `${publicBase}/${normalizedKey}`;
  } catch (error) {
    console.error("[R2] upload failed:", normalizedKey, error);
    return null;
  }
}

export function buildUploadKey(prefix: string, fileName: string): string {
  const folder = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}/${folder}/${fileName}`;
}

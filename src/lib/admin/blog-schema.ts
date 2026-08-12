import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const adminBlogWriteSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(slugRegex, "Slug 只能用小寫英文、數字同連字號"),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(500),
  content: z.array(z.string().trim().min(1)).min(1),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
  reading_minutes: z.number().int().min(1).max(120).optional(),
  published: z.boolean().optional(),
});

export type AdminBlogWriteInput = z.infer<typeof adminBlogWriteSchema>;

export function slugifyTitle(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);

  if (slug.length >= 2) return slug;
  return `article-${Date.now().toString(36)}`;
}

export function parseTagsInput(text: string): string[] {
  return text
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function formatTagsInput(tags: string[] | null | undefined): string {
  return (tags ?? []).join(", ");
}

export function parseContentInput(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export function formatContentInput(content: string[] | null | undefined): string {
  return (content ?? []).join("\n\n");
}

export function estimateReadingMinutes(content: string[]): number {
  const chars = content.join("").length;
  return Math.max(1, Math.min(120, Math.ceil(chars / 400)));
}

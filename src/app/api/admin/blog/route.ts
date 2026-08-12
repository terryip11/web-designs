import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  adminBlogWriteSchema,
  estimateReadingMinutes,
} from "@/lib/admin/blog-schema";
import { requireAdminApi } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

function buildPublishedAt(published: boolean, existing: string | null) {
  if (!published) return null;
  return existing ?? new Date().toISOString();
}

export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { data, error } = await admin.adminClient
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: data ?? [] });
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = adminBlogWriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "資料格式不正確" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const published = data.published ?? false;
  const now = new Date().toISOString();
  const readingMinutes =
    data.reading_minutes ?? estimateReadingMinutes(data.content);

  const { data: created, error } = await admin.adminClient
    .from("blog_posts")
    .insert({
      slug: data.slug,
      title: data.title,
      description: data.description,
      content: data.content,
      tags: data.tags ?? [],
      reading_minutes: readingMinutes,
      published,
      published_at: buildPublishedAt(published, null),
      updated_at: now,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Admin blog create:", error);
    return NextResponse.json(
      { error: error.message.includes("unique") ? "Slug 已存在" : "建立失敗" },
      { status: 400 }
    );
  }

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ success: true, id: created.id });
}

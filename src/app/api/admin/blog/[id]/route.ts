import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  adminBlogWriteSchema,
  estimateReadingMinutes,
} from "@/lib/admin/blog-schema";
import { requireAdminApi } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id } = await params;
  const { data, error } = await admin.adminClient
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "找不到文章" }, { status: 404 });
  }

  return NextResponse.json({ post: data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = adminBlogWriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "資料格式不正確" },
      { status: 400 }
    );
  }

  const { data: existing, error: fetchError } = await admin.adminClient
    .from("blog_posts")
    .select("slug, published_at")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "找不到文章" }, { status: 404 });
  }

  const data = parsed.data;
  const published = data.published ?? false;
  const readingMinutes =
    data.reading_minutes ?? estimateReadingMinutes(data.content);

  const { error } = await admin.adminClient
    .from("blog_posts")
    .update({
      slug: data.slug,
      title: data.title,
      description: data.description,
      content: data.content,
      tags: data.tags ?? [],
      reading_minutes: readingMinutes,
      published,
      published_at: published
        ? existing.published_at ?? new Date().toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Admin blog update:", error);
    return NextResponse.json(
      { error: error.message.includes("unique") ? "Slug 已存在" : "更新失敗" },
      { status: 400 }
    );
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id } = await params;
  const { data: existing } = await admin.adminClient
    .from("blog_posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await admin.adminClient.from("blog_posts").delete().eq("id", id);

  if (error) {
    console.error("Admin blog delete:", error);
    return NextResponse.json({ error: "刪除失敗" }, { status: 500 });
  }

  revalidatePath("/blog");
  if (existing?.slug) {
    revalidatePath(`/blog/${existing.slug}`);
  }
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ success: true });
}

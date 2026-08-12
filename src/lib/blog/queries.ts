import type { SupabaseClient } from "@supabase/supabase-js";
import type { BlogPost } from "@/lib/blog/types";
import { BLOG_POSTS_FALLBACK } from "@/lib/blog/fallback-posts";

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string[] | null;
  tags: string[] | null;
  reading_minutes: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: BlogPostRow): BlogPost {
  const content = Array.isArray(row.content) ? row.content : [];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content,
    tags: row.tags ?? [],
    readingMinutes: row.reading_minutes,
    published: row.published,
    publishedAt: row.published_at ?? row.created_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapFallback(): BlogPost[] {
  return BLOG_POSTS_FALLBACK.map((post) => ({
    id: post.slug,
    slug: post.slug,
    title: post.title,
    description: post.description,
    content: [...post.content],
    tags: [...post.tags],
    readingMinutes: post.readingMinutes,
    published: true,
    publishedAt: post.publishedAt,
    createdAt: post.publishedAt,
    updatedAt: post.publishedAt,
  }));
}

export async function getPublishedBlogPosts(
  client: SupabaseClient
): Promise<BlogPost[]> {
  const { data, error } = await client
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    if (error.message.includes("blog_posts")) {
      return mapFallback();
    }
    console.error("getPublishedBlogPosts:", error);
    return mapFallback();
  }

  if (!data?.length) {
    return mapFallback();
  }

  return (data as BlogPostRow[]).map(mapRow);
}

export async function getPublishedBlogPostBySlug(
  client: SupabaseClient,
  slug: string
): Promise<BlogPost | null> {
  const { data, error } = await client
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    if (error.message.includes("blog_posts")) {
      const fallback = mapFallback().find((p) => p.slug === slug);
      return fallback ?? null;
    }
    console.error("getPublishedBlogPostBySlug:", error);
    return null;
  }

  if (!data) {
    const fallback = mapFallback().find((p) => p.slug === slug);
    return fallback ?? null;
  }

  return mapRow(data as BlogPostRow);
}

export async function getPublishedBlogSlugs(
  client: SupabaseClient
): Promise<string[]> {
  const posts = await getPublishedBlogPosts(client);
  return posts.map((p) => p.slug);
}

export async function getAdminBlogPosts(
  adminClient: SupabaseClient
): Promise<{ rows: BlogPost[]; error: string | null }> {
  const { data, error } = await adminClient
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("getAdminBlogPosts:", error);
    if (error.message.includes("blog_posts")) {
      return {
        rows: mapFallback(),
        error: "請在 Supabase 執行 migration 016_blog_posts.sql",
      };
    }
    return { rows: [], error: error.message };
  }

  return { rows: (data as BlogPostRow[]).map(mapRow), error: null };
}

export async function getAdminBlogPostById(
  adminClient: SupabaseClient,
  id: string
): Promise<{ row: BlogPost | null; error: string | null }> {
  const { data, error } = await adminClient
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { row: null, error: error.message };
  }
  if (!data) {
    return { row: null, error: null };
  }
  return { row: mapRow(data as BlogPostRow), error: null };
}

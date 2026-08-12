import Link from "next/link";
import { notFound } from "next/navigation";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getPublishedBlogPostBySlug } from "@/lib/blog/queries";
import { renderBlogParagraph } from "@/lib/blog/render";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServerClient();
  const post = await getPublishedBlogPostBySlug(supabase, slug);
  if (!post) return { title: "文章 — DesignPick" };

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("zh-HK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServerClient();
  const post = await getPublishedBlogPostBySlug(supabase, slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <RevealOnScroll>
        <Link href="/blog" className="text-sm text-violet-400 hover:underline">
          ← 返回文章列表
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span>·</span>
          <span>{post.readingMinutes} 分鐘閱讀</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-zinc-400">{post.description}</p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.05}>
        <div className="prose prose-invert mt-10 max-w-none space-y-5 text-base leading-relaxed text-zinc-300">
          {post.content.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{renderBlogParagraph(paragraph)}</p>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <p className="font-medium text-white">想估算你的網站方案？</p>
          <p className="mt-2 text-sm text-zinc-400">
            瀏覽介面庫、選配功能，一分鐘提交詢價。
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/templates"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
            >
              瀏覽介面庫
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              聯絡詢價
            </Link>
          </div>
        </div>
      </RevealOnScroll>
    </article>
  );
}

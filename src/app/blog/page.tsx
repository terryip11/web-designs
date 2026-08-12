import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getBlogPosts } from "@/lib/blog/posts";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "網站設計資訊",
  description:
    "香港中小企網站設計、報價、SEO 與詢價實用文章 — DesignPick 官方資訊。",
  path: "/blog",
});

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("zh-HK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getBlogPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <RevealOnScroll>
        <p className="text-xs font-medium uppercase tracking-wide text-violet-400">
          Blog
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          網站設計資訊
        </h1>
        <p className="mt-4 text-zinc-400">
          香港中小企做網站、SEO 同詢價轉換的實用指南。
        </p>
      </RevealOnScroll>

      <div className="mt-10 space-y-6">
        {posts.map((post, index) => (
          <RevealOnScroll key={post.slug} delay={index * 0.03}>
            <article className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-violet-500/30">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span>·</span>
                <span>{post.readingMinutes} 分鐘閱讀</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-white">
                <Link href={`/blog/${post.slug}`} className="hover:text-violet-300">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {post.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}

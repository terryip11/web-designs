import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import { GEO_FAQ_HOME_PREVIEW_IDS, GEO_FAQ_ITEMS } from "@/lib/seo/geo/faq";

/** 首頁 GEO 摘要 — 3 題最常見問題 */
export default function HomeFaqPreview() {
  const items = GEO_FAQ_HOME_PREVIEW_IDS.map((id) =>
    GEO_FAQ_ITEMS.find((item) => item.id === id)
  ).filter(Boolean);

  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-violet-400">
                FAQ
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                香港做網站常見問題
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                快速了解 DesignPick 服務、參考報價與詢價方式
              </p>
            </div>
            <Link
              href="/faq"
              className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
            >
              查看全部問題
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </RevealOnScroll>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {items.map((item, index) =>
            item ? (
              <RevealOnScroll key={item.id} delay={index * 0.05}>
                <article className="flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                  <h3 className="font-semibold text-white">{item.question}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400 line-clamp-4">
                    {item.answer}
                  </p>
                  <Link
                    href={`/faq#${item.id}`}
                    className="mt-4 text-sm text-violet-400 hover:text-violet-300"
                  >
                    閱讀完整解答 →
                  </Link>
                </article>
              </RevealOnScroll>
            ) : null
          )}
        </div>

        <RevealOnScroll delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              閱讀資訊文章
            </Link>
            <Link
              href="/configure"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
            >
              開始選配方案
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

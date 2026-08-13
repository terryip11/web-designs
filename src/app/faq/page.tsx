import Link from "next/link";
import JsonLdScript from "@/components/JsonLdScript";
import RevealOnScroll from "@/components/RevealOnScroll";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { GEO_FAQ_ITEMS } from "@/lib/seo/geo/faq";
import { buildFaqPageGraph } from "@/lib/seo/geo/json-ld";

export const metadata = buildPageMetadata({
  title: "常見問題",
  description:
    "DesignPick 香港網站設計平台常見問題：報價、流程、行業模板、Demo 預覽與詢價方式。",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLdScript data={buildFaqPageGraph()} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <p className="text-xs font-medium uppercase tracking-wide text-violet-400">
            FAQ
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            常見問題
          </h1>
          <p className="mt-4 text-zinc-400">
            關於 DesignPick 服務、香港網站設計參考報價與詢價流程的解答。
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.05}>
          <div className="mt-10 space-y-8">
            {GEO_FAQ_ITEMS.map((item) => (
              <section
                key={item.id}
                id={item.id}
                className="scroll-mt-24 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
              >
                <h2 className="text-lg font-semibold text-white">
                  {item.question}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {item.answer}
                </p>
              </section>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08}>
          <div className="mt-12 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
            <p className="font-medium text-white">準備好估算方案？</p>
            <p className="mt-2 text-sm text-zinc-400">
              瀏覽模板、選配功能，一分鐘提交詢價。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/configure"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
              >
                開始選配
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                提交需求
              </Link>
              <Link
                href="/blog"
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                閱讀資訊文章
              </Link>
            </div>
          </div>

          <p className="mt-8 text-sm text-zinc-500">
            <Link href="/" className="text-violet-400 hover:underline">
              ← 返回首頁
            </Link>
          </p>
        </RevealOnScroll>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Palette, Settings, Columns3, Navigation, Zap, Pencil } from "lucide-react";
import TemplateCard from "@/components/TemplateCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import type { Template } from "@/types";

const steps = [
  {
    icon: Pencil,
    title: "畫草圖",
    description: "用線框勾勒版面，或從模板生成結構再改",
  },
  {
    icon: Palette,
    title: "瀏覽介面",
    description: "依行業、風格篩選，找到最適合的設計方向",
  },
  {
    icon: Columns3,
    title: "設計細節",
    description: "選擇雙欄版面、導航樣式、飛入飛出動效等",
  },
  {
    icon: Settings,
    title: "功能模組",
    description: "勾選預約、CMS、電商等，即時查看香港參考報價",
  },
  {
    icon: Layers,
    title: "確認方案",
    description: "產生完整摘要，一鍵提交需求與我們聯繫",
  },
];

interface HomeContentProps {
  featured: Template[];
}

export default function HomeContent({ featured }: HomeContentProps) {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <RevealOnScroll>
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-widest text-violet-400">
                網站設計選配平台
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                選介面、配設計
                <br />
                <span className="text-violet-400">組出你的專屬方案</span>
              </h1>
              <p className="mt-6 text-lg text-zinc-400">
                介面、雙欄版面、導航、飛入動效、功能模組 — 像選配一樣簡單，
                即時產生方案摘要與香港市場參考報價（HKD）。
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/sketch"
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-500"
                >
                  先畫草圖
                  <Pencil className="h-4 w-4" />
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
                >
                  瀏覽介面庫
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/configure"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
                >
                  開始選配
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-y border-zinc-800/80 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <h2 className="text-center text-2xl font-bold text-white">
              四步完成專業選配
            </h2>
          </RevealOnScroll>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <RevealOnScroll key={step.title} delay={i * 0.08}>
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400"
                  >
                    <step.icon className="h-6 w-6" />
                  </motion.div>
                  <p className="mt-2 text-xs font-medium text-violet-400">
                    STEP {i + 1}
                  </p>
                  <h3 className="mt-1 font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-zinc-500">{step.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">精選介面</h2>
              <p className="mt-2 text-zinc-500">最受歡迎的設計風格</p>
            </div>
            <Link
              href="/templates"
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              查看全部 →
            </Link>
          </div>
        </RevealOnScroll>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((t, i) => (
            <RevealOnScroll key={t.id} delay={i * 0.06}>
              <TemplateCard template={t} />
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800/80 bg-zinc-900/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: Columns3, label: "9 種版面", sub: "雙欄、瀑布流、邊欄等" },
                { icon: Navigation, label: "11 種導航", sub: "Mega Menu、搜尋列等" },
                { icon: Zap, label: "12 種 Hero", sub: "視差、漸層、表單、統計等" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center"
                >
                  <item.icon className="mx-auto h-8 w-8 text-violet-400" />
                  <p className="mt-3 font-semibold text-white">{item.label}</p>
                  <p className="mt-1 text-sm text-zinc-500">{item.sub}</p>
                </motion.div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}

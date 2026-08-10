"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DemoShowcaseExplorer from "@/components/demos/DemoShowcaseExplorer";

export default function HomeDemoShowcase() {
  return (
    <section className="border-y border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-400">
              完整展示站
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              給客戶看的真實網站 Demo
            </h2>
            <p className="mt-3 text-zinc-400">
              依行業篩選，右側即時預覽完整展示站 — 可直接分享予客戶查看交付品質。
            </p>
          </div>
          <Link
            href="/demos"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            全部展示站
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <DemoShowcaseExplorer />
      </div>
    </section>
  );
}

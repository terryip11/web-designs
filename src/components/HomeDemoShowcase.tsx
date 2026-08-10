"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Monitor } from "lucide-react";
import { getTemplateById } from "@/lib/data";
import { getLiveDemos } from "@/lib/demo-sites/registry";
import { getDemoPath } from "@/lib/demo-sites/urls";

const DEMO_COVER: Record<string, string> = {
  "property-luxe-09":
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
  "medical-trust-05":
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&q=80",
};

export default function HomeDemoShowcase() {
  const liveDemos = getLiveDemos();

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
              不只是 wireframe 縮圖 — 以下為可全屏瀏覽的完整展示站，展示 DesignPick
              模板的實際交付品質。
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

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {liveDemos.map((demo) => {
            const template = getTemplateById(demo.templateId);
            const path = getDemoPath(demo.templateId);
            if (!template || !path) return null;

            const cover =
              DEMO_COVER[demo.templateId] ??
              "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&q=80";

            return (
              <article
                key={demo.templateId}
                className="group overflow-hidden rounded-2xl border border-emerald-500/20 bg-zinc-900/50 transition hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={cover}
                    alt={demo.brandName}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-medium text-white">
                    <Monitor className="h-3.5 w-3.5" />
                    已上線 Demo
                  </span>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-lg font-semibold text-white">{demo.brandName}</p>
                    <p className="text-sm text-zinc-300">{template.name}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <p className="text-sm text-zinc-500">{demo.tagline}</p>
                  <div className="flex gap-2">
                    <Link
                      href={path}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                    >
                      開啟 Demo
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href={`/templates/${demo.templateId}`}
                      className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:border-zinc-600 hover:text-white"
                    >
                      介面詳情
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

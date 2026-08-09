"use client";

import { useEffect, useMemo, useState } from "react";
import TemplateCard from "@/components/TemplateCard";
import FilterBar from "@/components/FilterBar";
import DesignFlowBanner from "@/components/DesignFlowBanner";
import RevealOnScroll from "@/components/RevealOnScroll";
import { filterTemplates, getCategories, getStyles, templates } from "@/lib/data";
import { inferCategoryFromSketch } from "@/lib/sketch-template-match";
import { useSketchStore } from "@/store/sketch-store";

export default function TemplatesPage() {
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState("");
  const [search, setSearch] = useState("");
  const [autoCategory, setAutoCategory] = useState<string | null>(null);
  const [autoFilterDismissed, setAutoFilterDismissed] = useState(false);
  const pages = useSketchStore((s) => s.pages);

  const inferredCategory = useMemo(
    () => inferCategoryFromSketch(pages),
    [pages]
  );

  useEffect(() => {
    setAutoFilterDismissed(false);
  }, [inferredCategory]);

  useEffect(() => {
    if (
      inferredCategory &&
      !autoFilterDismissed &&
      category === "" &&
      style === "" &&
      search === ""
    ) {
      setCategory(inferredCategory);
      setAutoCategory(inferredCategory);
    }
  }, [inferredCategory, category, style, search, autoFilterDismissed]);

  const filtered = useMemo(
    () =>
      filterTemplates({
        category: category || undefined,
        style: style || undefined,
        search: search || undefined,
      }),
    [category, style, search]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <RevealOnScroll>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">介面庫</h1>
          <p className="mt-2 text-zinc-500">
            共 {templates.length} 款介面 · {getCategories().length} 個行業 ·{" "}
            {getStyles().length} 種風格 · 價格參考香港市場行情（HKD）
          </p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.03}>
        <DesignFlowBanner current="templates" />
      </RevealOnScroll>

      {autoCategory && category === autoCategory && (
        <RevealOnScroll delay={0.05} className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm">
            <p className="text-emerald-300">
              已依草圖文字自動篩選行業：<strong>{autoCategory}</strong>
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory("");
                setAutoCategory(null);
                setAutoFilterDismissed(true);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              清除自動篩選
            </button>
          </div>
        </RevealOnScroll>
      )}

      <RevealOnScroll delay={0.08} className="mt-8">
        <FilterBar
          categories={getCategories()}
          styles={getStyles()}
          selectedCategory={category}
          selectedStyle={style}
          search={search}
          onCategoryChange={setCategory}
          onStyleChange={setStyle}
          onSearchChange={setSearch}
        />
      </RevealOnScroll>

      {filtered.length === 0 ? (
        <RevealOnScroll>
          <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-12 text-center">
            <p className="text-zinc-300">找不到符合條件的介面</p>
            <p className="mt-2 text-sm text-zinc-500">
              {category || style
                ? "此篩選組合暫無對應設計，請試試其他行業或風格，或清除篩選查看全部"
                : "請調整搜尋關鍵字或篩選條件"}
            </p>
            {(category || style || search) && (
              <button
                type="button"
                onClick={() => {
                  setCategory("");
                  setStyle("");
                  setSearch("");
                }}
                className="mt-6 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white"
              >
                清除所有篩選
              </button>
            )}
          </div>
        </RevealOnScroll>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => (
            <RevealOnScroll key={t.id} delay={Math.min(i * 0.04, 0.3)}>
              <TemplateCard template={t} />
            </RevealOnScroll>
          ))}
        </div>
      )}
    </div>
  );
}


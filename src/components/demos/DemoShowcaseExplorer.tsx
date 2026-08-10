"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Smartphone } from "lucide-react";
import DemoPreviewFrame from "@/components/demos/DemoPreviewFrame";
import { getTemplateById } from "@/lib/data";
import { getLiveDemos, type DemoSiteConfig } from "@/lib/demo-sites/registry";
import { getDemoPath } from "@/lib/demo-sites/urls";

const CATEGORY_ORDER = [
  "餐飲",
  "醫療",
  "地產",
  "企業",
  "電商",
  "科技",
  "酒店",
  "美容",
  "健身",
  "教育",
  "個人品牌",
  "活動婚禮",
  "非牟利",
];

type LiveDemoEntry = DemoSiteConfig & {
  category: string;
  templateName: string;
  path: string;
};

function buildLiveDemoEntries(): LiveDemoEntry[] {
  return getLiveDemos()
    .map((demo) => {
      const template = getTemplateById(demo.templateId);
      const path = getDemoPath(demo.templateId);
      if (!template || !path) return null;
      return {
        ...demo,
        category: template.category,
        templateName: template.name,
        path,
      };
    })
    .filter((d): d is LiveDemoEntry => d !== null);
}

function sortCategories(categories: string[]) {
  return [...categories].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b, "zh-Hant");
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export default function DemoShowcaseExplorer({ compact = false }: { compact?: boolean }) {
  const entries = useMemo(() => buildLiveDemoEntries(), []);
  const categories = useMemo(() => {
    const unique = [...new Set(entries.map((e) => e.category))];
    return sortCategories(unique);
  }, [entries]);

  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [selectedId, setSelectedId] = useState(entries[0]?.templateId ?? "");

  const filtered = useMemo(
    () =>
      activeCategory === "全部"
        ? entries
        : entries.filter((e) => e.category === activeCategory),
    [entries, activeCategory],
  );

  const selected =
    filtered.find((e) => e.templateId === selectedId) ?? filtered[0] ?? entries[0];

  function selectCategory(category: string) {
    setActiveCategory(category);
    const next =
      category === "全部"
        ? entries
        : entries.filter((e) => e.category === category);
    if (next.length > 0 && !next.some((e) => e.templateId === selectedId)) {
      setSelectedId(next[0].templateId);
    }
  }

  if (entries.length === 0) return null;

  const embedSrc = `${selected.path}?embed=1`;

  return (
    <div className={compact ? "space-y-5" : "mt-10 space-y-6"}>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <CategoryTab
          label="全部"
          active={activeCategory === "全部"}
          onClick={() => selectCategory("全部")}
        />
        {categories.map((cat) => (
          <CategoryTab
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onClick={() => selectCategory(cat)}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-8">
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible lg:pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filtered.map((demo) => {
            const isActive = demo.templateId === selected.templateId;
            return (
              <button
                key={demo.templateId}
                type="button"
                onClick={() => setSelectedId(demo.templateId)}
                className={`shrink-0 rounded-xl border px-4 py-3 text-left transition lg:w-full ${
                  isActive
                    ? "border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
                }`}
              >
                <p className={`text-sm font-semibold ${isActive ? "text-emerald-200" : "text-white"}`}>
                  {demo.brandName}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">{demo.templateName}</p>
                <p className="mt-1 hidden text-xs text-zinc-600 lg:block">{demo.tagline}</p>
              </button>
            );
          })}
        </div>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-white">{selected.brandName}</p>
              <p className="mt-1 text-sm text-zinc-400">
                {selected.category} · {selected.templateName}
              </p>
              <p className="mt-1 text-sm text-zinc-500">{selected.tagline}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={selected.path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                開啟 Demo
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`${selected.path}?hidebar=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white"
              >
                全螢幕
              </Link>
              <Link
                href={`/templates/${selected.templateId}`}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:border-zinc-600 hover:text-white"
              >
                介面詳情
              </Link>
            </div>
          </div>

          <DemoPreviewFrame
            src={embedSrc}
            title={`${selected.brandName} — DesignPick Demo`}
          />

          <p className="flex items-center gap-2 text-xs text-zinc-600">
            <Smartphone className="h-3.5 w-3.5 shrink-0" />
            以上為即時嵌入預覽；手機版建議用「開啟 Demo」在新分頁瀏覽。
          </p>
        </div>
      </div>
    </div>
  );
}

function CategoryTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-emerald-600 text-white"
          : "border border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

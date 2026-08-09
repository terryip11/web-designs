"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FolderOpen, Link2, Loader2, Trash2 } from "lucide-react";
import { useConfiguratorStore } from "@/store/configurator-store";
import { useSketchStore } from "@/store/sketch-store";
import { formatPrice } from "@/lib/data";
import { buildConfigureShareUrl } from "@/lib/template-meta";
import type { SavedConfig } from "@/types";

export default function SavedConfigsPanel({
  initialConfigs,
}: {
  initialConfigs: SavedConfig[];
}) {
  const router = useRouter();
  const [configs, setConfigs] = useState(initialConfigs);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const loadConfiguration = useConfiguratorStore((s) => s.loadConfiguration);
  const importSketchSnapshot = useSketchStore((s) => s.importSnapshot);

  async function handleDelete(id: string) {
    if (!confirm("確定刪除此方案？")) return;
    setLoadingId(id);
    const res = await fetch(`/api/saved-configs/${id}`, { method: "DELETE" });
    setLoadingId(null);
    if (res.ok) setConfigs((c) => c.filter((x) => x.id !== id));
  }

  async function handleRename(id: string, currentName: string) {
    const next = window.prompt("重新命名方案", currentName);
    if (!next?.trim() || next.trim() === currentName) return;
    setLoadingId(id);
    const res = await fetch(`/api/saved-configs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: next.trim() }),
    });
    setLoadingId(null);
    if (res.ok) {
      setConfigs((c) =>
        c.map((x) => (x.id === id ? { ...x, name: next.trim() } : x))
      );
    }
  }

  async function handleShare(config: SavedConfig) {
    if (!config.template_id) return;
    const url = buildConfigureShareUrl(window.location.origin, {
      selectedTemplateId: config.template_id,
      selectedFeatureIds: config.selected_features,
      designSelections: config.design_selections,
    });
    await navigator.clipboard.writeText(url);
  }

  function handleLoad(config: SavedConfig) {
    loadConfiguration({
      selectedTemplateId: config.template_id,
      selectedFeatureIds: config.selected_features,
      designSelections: config.design_selections,
    });
    if (config.sketch_snapshot) {
      importSketchSnapshot(config.sketch_snapshot);
    }
    router.push("/summary");
  }

  if (configs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center text-sm text-zinc-500">
        尚未儲存任何方案。{" "}
        <Link href="/configure" className="text-violet-400 hover:underline">
          前往選配
        </Link>{" "}
        後可點「儲存方案」。
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {configs.map((config) => (
        <li
          key={config.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
        >
          <div>
            <p className="font-medium text-white">{config.name}</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {config.template_id ?? "未選介面"} ·{" "}
              {formatPrice(config.total_price)} ·{" "}
              {new Date(config.updated_at).toLocaleDateString("zh-HK")}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleShare(config)}
              disabled={!config.template_id}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-white disabled:opacity-50"
            >
              <Link2 className="h-3.5 w-3.5" />
              分享
            </button>
            <button
              type="button"
              onClick={() => handleLoad(config)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300 hover:bg-violet-500/20"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              載入
            </button>
            <button
              type="button"
              onClick={() => handleRename(config.id, config.name)}
              disabled={loadingId === config.id}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-white disabled:opacity-50"
            >
              重新命名
            </button>
            <button
              type="button"
              onClick={() => handleDelete(config.id)}
              disabled={loadingId === config.id}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
            >
              {loadingId === config.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              刪除
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

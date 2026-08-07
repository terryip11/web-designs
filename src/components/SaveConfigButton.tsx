"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookmarkPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useConfiguratorStore } from "@/store/configurator-store";
import { useSketchStore } from "@/store/sketch-store";
import { createBrowserClient } from "@/lib/supabase/client";

interface SaveConfigButtonProps {
  className?: string;
  compact?: boolean;
}

export default function SaveConfigButton({
  className = "",
  compact = false,
}: SaveConfigButtonProps) {
  const router = useRouter();
  const template = useConfiguratorStore((s) => s.getTemplate());
  const exportConfiguration = useConfiguratorStore((s) => s.exportConfiguration);
  const exportSketchSnapshot = useSketchStore((s) => s.exportSnapshot);
  const getTotalPrice = useConfiguratorStore((s) => s.getTotalPrice);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  async function checkAuth() {
    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setLoggedIn(Boolean(user));
    if (!user) {
      router.push("/login?next=/summary");
      return false;
    }
    return true;
  }

  async function handleOpen() {
    const ok = loggedIn ?? (await checkAuth());
    if (!ok) return;
    setName(template?.name ? `${template.name} 方案` : "我的方案");
    setOpen(true);
    setError(null);
  }

  async function handleSave() {
    if (!name.trim()) {
      setError("請輸入方案名稱");
      return;
    }
    setLoading(true);
    setError(null);

    const config = exportConfiguration();
    const sketch = exportSketchSnapshot();

    const res = await fetch("/api/saved-configs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        template_id: config.selectedTemplateId,
        selected_features: config.selectedFeatureIds,
        design_selections: config.designSelections,
        sketch_snapshot: sketch.pages.some((p) => p.elements.length > 0)
          ? sketch
          : null,
        total_price: getTotalPrice(),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "儲存失敗");
      return;
    }

    setOpen(false);
    router.push("/account?tab=saved");
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={
          className ||
          `inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-violet-500 hover:text-white ${compact ? "px-3 py-1.5 text-xs" : ""}`
        }
      >
        <BookmarkPlus className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        儲存方案
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">儲存目前方案</h3>
            <p className="mt-1 text-sm text-zinc-500">
              含選配與草圖，可於{" "}
              <Link href="/account" className="text-violet-400 hover:underline">
                會員中心
              </Link>{" "}
              載入
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="mt-4 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none"
              placeholder="方案名稱"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                確認儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

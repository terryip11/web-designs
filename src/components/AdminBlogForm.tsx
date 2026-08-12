"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  adminBlogWriteSchema,
  estimateReadingMinutes,
  formatContentInput,
  formatTagsInput,
  parseContentInput,
  parseTagsInput,
  slugifyTitle,
  type AdminBlogWriteInput,
} from "@/lib/admin/blog-schema";
import type { BlogPost } from "@/lib/blog/types";

type FormMode = "create" | "edit";

interface AdminBlogFormProps {
  mode: FormMode;
  post?: BlogPost | null;
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  tagsText: "",
  contentText: "",
  readingMinutes: 5,
  published: false,
};

export default function AdminBlogForm({
  mode,
  post,
  onClose,
  onSaved,
}: AdminBlogFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && post) {
      setForm({
        title: post.title,
        slug: post.slug,
        description: post.description,
        tagsText: formatTagsInput(post.tags),
        contentText: formatContentInput(post.content),
        readingMinutes: post.readingMinutes,
        published: post.published,
      });
      setSlugTouched(true);
    } else {
      setForm(emptyForm);
      setSlugTouched(false);
    }
  }, [mode, post]);

  function updateTitle(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugifyTitle(title),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const content = parseContentInput(form.contentText);
    const payload: AdminBlogWriteInput = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      content,
      tags: parseTagsInput(form.tagsText),
      reading_minutes: form.readingMinutes || estimateReadingMinutes(content),
      published: form.published,
    };

    const validated = adminBlogWriteSchema.safeParse(payload);
    if (!validated.success) {
      setError(validated.error.issues[0]?.message ?? "資料格式不正確");
      setLoading(false);
      return;
    }

    const url =
      mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${post?.id}`;
    const res = await fetch(url, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated.data),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "儲存失敗");
      setLoading(false);
      return;
    }

    setLoading(false);
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {mode === "create" ? "新增文章" : "編輯文章"}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              內文以空行分段；用 **文字** 表示粗體
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="text-zinc-400">標題 *</span>
            <input
              required
              value={form.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </label>

          <label className="block text-sm">
            <span className="text-zinc-400">Slug（網址）*</span>
            <input
              required
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm({ ...form, slug: e.target.value });
              }}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-white focus:border-violet-500 focus:outline-none"
            />
            <span className="mt-1 block text-xs text-zinc-600">
              /blog/{form.slug || "your-slug"}
            </span>
          </label>

          <label className="block text-sm">
            <span className="text-zinc-400">摘要（SEO description）*</span>
            <textarea
              required
              rows={2}
              maxLength={500}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-zinc-400">標籤（逗號分隔）</span>
              <input
                value={form.tagsText}
                onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
                placeholder="SEO, 報價, 香港"
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">閱讀分鐘</span>
              <input
                type="number"
                min={1}
                max={120}
                value={form.readingMinutes}
                onChange={(e) =>
                  setForm({ ...form, readingMinutes: Number(e.target.value) || 1 })
                }
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="text-zinc-400">內文 *</span>
            <textarea
              required
              rows={12}
              value={form.contentText}
              onChange={(e) => setForm({ ...form, contentText: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm leading-relaxed text-white focus:border-violet-500 focus:outline-none"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="rounded border-zinc-600 bg-zinc-950 text-violet-600"
            />
            發布至前台（/blog）
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {form.published ? "儲存並發布" : "儲存草稿"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

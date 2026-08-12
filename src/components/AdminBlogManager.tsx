"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import AdminBlogForm from "@/components/AdminBlogForm";
import type { BlogPost } from "@/lib/blog/types";

function formatDate(value: string) {
  return new Date(value).toLocaleString("zh-HK", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminBlogManager({
  rows,
  migrationHint,
}: {
  rows: BlogPost[];
  migrationHint?: string | null;
}) {
  const router = useRouter();
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function refresh() {
    router.refresh();
  }

  async function deletePost(post: BlogPost) {
    if (!confirm(`確定刪除「${post.title}」？`)) return;
    setBusyId(post.id);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "刪除失敗");
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "刪除失敗");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      {migrationHint && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {migrationHint} — 請在 Supabase SQL Editor 執行{" "}
          <code className="text-amber-100">016_blog_posts.sql</code>
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditingPost(null);
            setFormMode("create");
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          <Plus className="h-4 w-4" />
          新增文章
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-500">
          尚無文章，點「新增文章」開始撰寫
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-white">{post.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        post.published
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-zinc-700 text-zinc-400"
                      }`}
                    >
                      {post.published ? "已發布" : "草稿"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">/blog/{post.slug}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                    {post.description}
                  </p>
                  <p className="mt-2 text-xs text-zinc-600">
                    更新 {formatDate(post.updatedAt)} · {post.readingMinutes} 分鐘
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {post.published && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title="預覽"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                  <button
                    type="button"
                    disabled={busyId === post.id}
                    onClick={() => {
                      setEditingPost(post);
                      setFormMode("edit");
                    }}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                    title="編輯"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={busyId === post.id}
                    onClick={() => deletePost(post)}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    title="刪除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {formMode && (
        <AdminBlogForm
          mode={formMode}
          post={editingPost}
          onClose={() => {
            setFormMode(null);
            setEditingPost(null);
          }}
          onSaved={refresh}
        />
      )}
    </>
  );
}

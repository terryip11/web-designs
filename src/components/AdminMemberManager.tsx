"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Pencil,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import AdminMemberForm from "@/components/AdminMemberForm";
import type { AdminMemberRow } from "@/lib/admin/members";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("zh-HK", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMemberManager({ rows }: { rows: AdminMemberRow[] }) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingRow, setEditingRow] = useState<AdminMemberRow | null>(null);

  function refresh() {
    router.refresh();
  }

  async function deleteMember(row: AdminMemberRow) {
    if (
      !confirm(
        `確定刪除會員「${row.display_name || row.email}」？\n\n已儲存方案將一併刪除，詢價紀錄會保留但不再關聯此會員。`
      )
    ) {
      return;
    }

    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/members/${row.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "刪除失敗");
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "刪除失敗，請稍後再試");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditingRow(null);
            setFormMode("create");
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          <Plus className="h-4 w-4" />
          新增會員
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-500">
          找不到符合條件的會員
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const expanded = expandedId === row.id;
            const label = row.display_name || row.email.split("@")[0];

            return (
              <article
                key={row.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-medium text-white">
                        {label}
                      </h3>
                      {row.is_admin && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                          <Shield className="h-3 w-3" />
                          管理員
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs text-zinc-500">{row.email}</p>
                    <p className="mt-2 text-xs text-zinc-400">
                      詢價 {row.inquiry_count} · 已儲存方案 {row.saved_config_count} ·
                      註冊 {formatDate(row.created_at)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => {
                        setEditingRow(row);
                        setFormMode("edit");
                      }}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                      title="編輯"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => deleteMember(row)}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                      title="刪除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : row.id)}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      title={expanded ? "收合" : "展開"}
                    >
                      {expanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-zinc-800 px-4 py-4 text-sm">
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-zinc-500">電話</dt>
                        <dd className="mt-1 text-zinc-200">{row.phone || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-zinc-500">公司</dt>
                        <dd className="mt-1 text-zinc-200">{row.company || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-zinc-500">最後登入</dt>
                        <dd className="mt-1 text-zinc-200">
                          {formatDate(row.last_sign_in_at)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-zinc-500">會員 ID</dt>
                        <dd className="mt-1 break-all font-mono text-xs text-zinc-400">
                          {row.id}
                        </dd>
                      </div>
                    </dl>

                    {row.inquiry_count > 0 && (
                      <Link
                        href={`/admin/inquiries?q=${encodeURIComponent(row.email)}`}
                        className="mt-4 inline-flex items-center gap-2 text-xs text-violet-400 hover:underline"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        查看此會員的詢價紀錄
                      </Link>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {formMode && (
        <AdminMemberForm
          mode={formMode}
          member={editingRow}
          onClose={() => {
            setFormMode(null);
            setEditingRow(null);
          }}
          onSaved={refresh}
        />
      )}
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ClipboardCopy,
  Download,
  MessageCircle,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import AdminInquiryForm from "@/components/AdminInquiryForm";
import { formatPrice } from "@/lib/data";
import {
  INQUIRY_STATUS_LABELS,
  INQUIRY_STATUS_OPTIONS,
  type InquiryStatus,
} from "@/lib/inquiry-status";
import { getWhatsAppUrl } from "@/lib/site-contact";

export interface AdminInquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  template_name: string;
  total_price: number;
  currency: string;
  created_at: string;
  selected_features: string[] | null;
  sketch_urls: unknown;
  message: string | null;
  status: InquiryStatus;
  email_customer_sent: boolean;
  email_notify_sent: boolean;
  admin_notes?: string | null;
  template_id?: string | null;
  design_selections?: unknown;
  asset_urls?: unknown;
}

function buildWhatsAppReply(row: AdminInquiryRow) {
  return getWhatsAppUrl(
    `你好 ${row.name}，我是 DesignPick 的 Terry，收到你對「${row.template_name}」方案的詢價，想進一步了解你的需求。`
  );
}

export default function AdminInquiryManager({ rows }: { rows: AdminInquiryRow[] }) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingRow, setEditingRow] = useState<AdminInquiryRow | null>(null);
  const [copiedSpecId, setCopiedSpecId] = useState<string | null>(null);

  function refresh() {
    router.refresh();
  }

  async function updateStatus(id: string, status: InquiryStatus) {
    setBusyId(id);
    try {
      const row = rows.find((r) => r.id === id);
      if (!row) return;

      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: row.name,
          email: row.email,
          phone: row.phone,
          company: row.company,
          message: row.message,
          template_name: row.template_name,
          selected_features: row.selected_features ?? [],
          total_price: row.total_price,
          currency: row.currency,
          status,
          admin_notes: row.admin_notes ?? null,
        }),
      });
      if (!res.ok) throw new Error("更新失敗");
      refresh();
    } catch {
      alert("狀態更新失敗，請稍後再試");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteInquiry(row: AdminInquiryRow) {
    if (
      !confirm(`確定刪除「${row.name}」的詢價紀錄？此操作無法復原。`)
    ) {
      return;
    }

    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/inquiries/${row.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("刪除失敗");
      refresh();
    } catch {
      alert("刪除失敗，請稍後再試");
    } finally {
      setBusyId(null);
    }
  }

  async function copyProductionSpec(id: string) {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}/spec`);
      if (!res.ok) throw new Error("匯出失敗");
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedSpecId(id);
      setTimeout(() => setCopiedSpecId(null), 2000);
    } catch {
      alert("複製製作規格失敗");
    }
  }

  function downloadProductionSpec(id: string) {
    window.open(`/api/admin/inquiries/${id}/spec`, "_blank");
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
          新增詢價
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full min-w-[1024px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 text-xs text-zinc-500">
              <th className="px-4 py-3 font-medium">時間</th>
              <th className="px-4 py-3 font-medium">客戶</th>
              <th className="px-4 py-3 font-medium">介面</th>
              <th className="px-4 py-3 font-medium">參考價</th>
              <th className="px-4 py-3 font-medium">狀態</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-zinc-500"
                >
                  尚無詢價紀錄，可點「新增詢價」建立
                </td>
              </tr>
            ) : (
              rows.map((row) => {
              const expanded = expandedId === row.id;
              const sketchUrls = Array.isArray(row.sketch_urls)
                ? (row.sketch_urls as string[])
                : [];
              const assetUrls = Array.isArray(row.asset_urls)
                ? (row.asset_urls as string[])
                : [];
              const disabled = busyId === row.id;

              return (
                <tr
                  key={row.id}
                  className="border-b border-zinc-800/80 align-top"
                >
                  <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleString("zh-HK")}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{row.name}</p>
                    <p className="text-xs text-zinc-500">{row.email}</p>
                    {row.phone && (
                      <p className="text-xs text-zinc-600">{row.phone}</p>
                    )}
                    {row.company && (
                      <p className="text-xs text-zinc-600">{row.company}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{row.template_name}</td>
                  <td className="px-4 py-3 text-violet-400 whitespace-nowrap">
                    {formatPrice(row.total_price)} {row.currency}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.status ?? "new"}
                      disabled={disabled}
                      onChange={(e) =>
                        updateStatus(row.id, e.target.value as InquiryStatus)
                      }
                      className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200"
                    >
                      {INQUIRY_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <p
                      className={
                        row.email_customer_sent
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }
                    >
                      客戶 {row.email_customer_sent ? "✓" : "✗"}
                    </p>
                    <p
                      className={
                        row.email_notify_sent
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }
                    >
                      通知 {row.email_notify_sent ? "✓" : "✗"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setExpandedId(expanded ? null : row.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:text-white disabled:opacity-50"
                      >
                        {expanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                        詳情
                      </button>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setEditingRow(row);
                          setFormMode("edit");
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:text-white disabled:opacity-50"
                      >
                        <Pencil className="h-3 w-3" />
                        編輯
                      </button>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => copyProductionSpec(row.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 px-2 py-1 text-xs text-amber-400 hover:bg-amber-500/10 disabled:opacity-50"
                      >
                        <ClipboardCopy className="h-3 w-3" />
                        {copiedSpecId === row.id ? "已複製" : "規格"}
                      </button>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => downloadProductionSpec(row.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 px-2 py-1 text-xs text-amber-400 hover:bg-amber-500/10 disabled:opacity-50"
                      >
                        <Download className="h-3 w-3" />
                        .md
                      </button>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => deleteInquiry(row)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        刪除
                      </button>
                      <a
                        href={buildWhatsAppReply(row)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <MessageCircle className="h-3 w-3" />
                        WhatsApp
                      </a>
                    </div>
                    {expanded && (
                      <div className="mt-3 space-y-2 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-xs text-zinc-400">
                        {row.message && (
                          <p>
                            <span className="text-zinc-500">留言：</span>
                            {row.message}
                          </p>
                        )}
                        {row.admin_notes && (
                          <p>
                            <span className="text-zinc-500">內部備註：</span>
                            {row.admin_notes}
                          </p>
                        )}
                        {Array.isArray(row.selected_features) &&
                          row.selected_features.length > 0 && (
                            <p>
                              <span className="text-zinc-500">功能：</span>
                              {row.selected_features.join("、")}
                            </p>
                          )}
                        {sketchUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {sketchUrls.map((url, i) => (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:underline"
                              >
                                草圖 {i + 1}
                              </a>
                            ))}
                          </div>
                        )}
                        {assetUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {assetUrls.map((url, i) => (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-400 hover:underline"
                              >
                                素材 {i + 1}
                              </a>
                            ))}
                          </div>
                        )}
                        <p className="text-zinc-600">
                          狀態：{INQUIRY_STATUS_LABELS[row.status ?? "new"]}
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
            )}
          </tbody>
        </table>
      </div>

      {formMode && (
        <AdminInquiryForm
          mode={formMode}
          inquiry={editingRow}
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

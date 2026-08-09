"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
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
}

function buildWhatsAppReply(row: AdminInquiryRow) {
  return getWhatsAppUrl(
    `你好 ${row.name}，我是 DesignPick 的 Terry，收到你對「${row.template_name}」方案的詢價，想進一步了解你的需求。`
  );
}

export default function AdminInquiryTable({ rows }: { rows: AdminInquiryRow[] }) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: InquiryStatus) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("更新失敗");
      router.refresh();
    } catch {
      alert("狀態更新失敗，請稍後再試");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full min-w-[960px] text-left text-sm">
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
          {rows.map((row) => {
            const expanded = expandedId === row.id;
            const sketchUrls = Array.isArray(row.sketch_urls)
              ? (row.sketch_urls as string[])
              : [];

            return (
              <tr key={row.id} className="border-b border-zinc-800/80 align-top">
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
                    disabled={updatingId === row.id}
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
                  <p className={row.email_customer_sent ? "text-emerald-400" : "text-amber-400"}>
                    客戶 {row.email_customer_sent ? "✓" : "✗"}
                  </p>
                  <p className={row.email_notify_sent ? "text-emerald-400" : "text-amber-400"}>
                    通知 {row.email_notify_sent ? "✓" : "✗"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : row.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:text-white"
                    >
                      {expanded ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                      詳情
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
                      <p className="text-zinc-600">
                        狀態：{INQUIRY_STATUS_LABELS[row.status ?? "new"]}
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  adminInquiryWriteSchema,
  formatFeatureLines,
  parseFeatureLines,
  type AdminInquiryWriteInput,
} from "@/lib/admin-inquiry-schema";
import { CURRENCY_CODE } from "@/lib/currency";
import { INQUIRY_STATUS_OPTIONS, type InquiryStatus } from "@/lib/inquiry-status";
import type { AdminInquiryRow } from "@/components/AdminInquiryManager";

type FormMode = "create" | "edit";

interface AdminInquiryFormProps {
  mode: FormMode;
  inquiry?: AdminInquiryRow | null;
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
  template_id: "manual",
  template_name: "",
  featuresText: "",
  total_price: 0,
  currency: CURRENCY_CODE,
  status: "new" as InquiryStatus,
  admin_notes: "",
};

export default function AdminInquiryForm({
  mode,
  inquiry,
  onClose,
  onSaved,
}: AdminInquiryFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && inquiry) {
      setForm({
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone ?? "",
        company: inquiry.company ?? "",
        message: inquiry.message ?? "",
        template_id: "manual",
        template_name: inquiry.template_name,
        featuresText: formatFeatureLines(inquiry.selected_features),
        total_price: inquiry.total_price ?? 0,
        currency: inquiry.currency ?? CURRENCY_CODE,
        status: inquiry.status ?? "new",
        admin_notes: inquiry.admin_notes ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [mode, inquiry]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: AdminInquiryWriteInput = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      company: form.company || null,
      message: form.message || null,
      template_id: form.template_id,
      template_name: form.template_name,
      selected_features: parseFeatureLines(form.featuresText),
      total_price: Number(form.total_price) || 0,
      currency: form.currency,
      status: form.status,
      admin_notes: form.admin_notes || null,
    };

    const validated = adminInquiryWriteSchema.safeParse(payload);
    if (!validated.success) {
      setError(validated.error.issues[0]?.message ?? "資料格式不正確");
      setLoading(false);
      return;
    }

    const url =
      mode === "create"
        ? "/api/admin/inquiries"
        : `/api/admin/inquiries/${inquiry?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "儲存失敗");
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存失敗");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {mode === "create" ? "新增詢價紀錄" : "編輯詢價紀錄"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-zinc-400">姓名 *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">電話</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">公司</label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-400">介面名稱 *</label>
            <input
              required
              value={form.template_name}
              onChange={(e) =>
                setForm({ ...form, template_name: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="mb-1 block text-xs text-zinc-400">參考價 (HKD)</label>
              <input
                type="number"
                min={0}
                value={form.total_price}
                onChange={(e) =>
                  setForm({ ...form, total_price: Number(e.target.value) })
                }
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-zinc-400">狀態</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as InquiryStatus })
                }
                className={inputClass}
              >
                {INQUIRY_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-400">客戶留言</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-400">
              功能模組（每行一項）
            </label>
            <textarea
              rows={3}
              value={form.featuresText}
              onChange={(e) =>
                setForm({ ...form, featuresText: e.target.value })
              }
              className={inputClass}
              placeholder="SEO 優化&#10;WhatsApp 按鈕"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-400">內部備註</label>
            <textarea
              rows={2}
              value={form.admin_notes}
              onChange={(e) =>
                setForm({ ...form, admin_notes: e.target.value })
              }
              className={inputClass}
              placeholder="僅管理員可見"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-white"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "create" ? "新增" : "儲存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  adminMemberCreateSchema,
  adminMemberUpdateSchema,
  type AdminMemberCreateInput,
  type AdminMemberUpdateInput,
} from "@/lib/admin/member-schema";
import type { AdminMemberRow } from "@/lib/admin/members";

type FormMode = "create" | "edit";

interface AdminMemberFormProps {
  mode: FormMode;
  member?: AdminMemberRow | null;
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm = {
  email: "",
  password: "",
  display_name: "",
  phone: "",
  company: "",
  is_admin: false,
};

export default function AdminMemberForm({
  mode,
  member,
  onClose,
  onSaved,
}: AdminMemberFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && member) {
      setForm({
        email: member.email,
        password: "",
        display_name: member.display_name ?? "",
        phone: member.phone ?? "",
        company: member.company ?? "",
        is_admin: member.is_admin,
      });
    } else {
      setForm(emptyForm);
    }
  }, [mode, member]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "create") {
      const payload: AdminMemberCreateInput = {
        email: form.email,
        password: form.password,
        display_name: form.display_name || null,
        phone: form.phone || null,
        company: form.company || null,
        is_admin: form.is_admin,
      };
      const validated = adminMemberCreateSchema.safeParse(payload);
      if (!validated.success) {
        setError(validated.error.issues[0]?.message ?? "資料格式不正確");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "建立失敗");
        setLoading(false);
        return;
      }
    } else if (member) {
      const payload: AdminMemberUpdateInput = {
        email: form.email !== member.email ? form.email : undefined,
        password: form.password || null,
        display_name: form.display_name || null,
        phone: form.phone || null,
        company: form.company || null,
        is_admin: form.is_admin,
      };
      const validated = adminMemberUpdateSchema.safeParse(payload);
      if (!validated.success) {
        setError(validated.error.issues[0]?.message ?? "資料格式不正確");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/admin/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "更新失敗");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {mode === "create" ? "新增會員" : "編輯會員"}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              {mode === "create"
                ? "建立後會員可立即以 Email 登入"
                : "留空密碼表示不變更"}
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
            <span className="text-zinc-400">Email *</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </label>

          <label className="block text-sm">
            <span className="text-zinc-400">
              {mode === "create" ? "密碼 *" : "新密碼（選填）"}
            </span>
            <input
              required={mode === "create"}
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </label>

          <label className="block text-sm">
            <span className="text-zinc-400">顯示名稱</span>
            <input
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-zinc-400">電話</span>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-400">公司</span>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white focus:border-violet-500 focus:outline-none"
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.is_admin}
              onChange={(e) => setForm({ ...form, is_admin: e.target.checked })}
              className="rounded border-zinc-600 bg-zinc-950 text-violet-600 focus:ring-violet-500"
            />
            設為管理員
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "create" ? "建立" : "儲存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { updateProfile } from "@/lib/auth/actions";
import type { UserProfile } from "@/types";

export default function AccountProfileForm({
  profile,
  email,
}: {
  profile: UserProfile | null;
  email: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    setError(null);
    const result = await updateProfile(formData);
    setLoading(false);
    if (result?.error) setError(result.error);
    else setMessage("個人資料已更新");
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm text-zinc-400">Email</label>
        <input
          value={email}
          disabled
          className="w-full cursor-not-allowed rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-zinc-500"
        />
      </div>
      <div>
        <label htmlFor="displayName" className="mb-1.5 block text-sm text-zinc-400">
          顯示名稱
        </label>
        <input
          id="displayName"
          name="displayName"
          defaultValue={profile?.display_name ?? ""}
          maxLength={50}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm text-zinc-400">
            電話
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={profile?.phone ?? ""}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm text-zinc-400">
            公司 / 品牌
          </label>
          <input
            id="company"
            name="company"
            defaultValue={profile?.company ?? ""}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
      </div>

      {message && <p className="text-sm text-emerald-400">{message}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        儲存變更
      </button>
    </form>
  );
}

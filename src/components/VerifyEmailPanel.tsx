"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { resendVerificationEmail } from "@/lib/auth/actions";

export default function VerifyEmailPanel({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    setLoading(true);
    setError(null);
    const result = await resendVerificationEmail(email);
    setLoading(false);
    if (result?.error) setError(result.error);
    else setSent(true);
  }

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
        <Mail className="h-6 w-6 text-emerald-400" />
      </div>
      <h2 className="text-lg font-semibold text-emerald-300">請驗證您的 Email</h2>
      <p className="mt-2 text-sm text-zinc-400">
        我們已寄送驗證信至 <span className="text-white">{email}</span>
        ，請點擊信內連結完成註冊。
      </p>
      <p className="mt-1 text-xs text-zinc-600">
        驗證成功後將自動登入並前往會員中心。
      </p>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={handleResend}
          disabled={loading || sent}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {sent ? "已重新發送" : "重新發送驗證信"}
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <p>
          <Link href="/login" className="text-sm text-violet-400 hover:underline">
            返回登入
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { requestPasswordReset } from "@/lib/auth/actions";

type ResetResult = { error?: string; success?: boolean; email?: string } | null;

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: ResetResult, formData: FormData): Promise<ResetResult> => {
      return (await requestPasswordReset(formData)) ?? null;
    },
    null
  );

  if (state?.success) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-200">
        若 <strong>{state.email}</strong> 已註冊，重設密碼連結已寄出，請查收 Email（含垃圾郵件匣）。
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm">
        <span className="text-zinc-400">Email *</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-white focus:border-violet-500 focus:outline-none"
        />
      </label>

      {state?.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        寄送重設連結
      </button>
    </form>
  );
}

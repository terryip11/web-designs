"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updatePassword } from "@/lib/auth/actions";

type ResetResult = { error?: string } | null;

export default function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: ResetResult, formData: FormData): Promise<ResetResult> => {
      return (await updatePassword(formData)) ?? null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm">
        <span className="text-zinc-400">新密碼 *</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-white focus:border-violet-500 focus:outline-none"
        />
      </label>

      <label className="block text-sm">
        <span className="text-zinc-400">確認新密碼 *</span>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-white focus:border-violet-500 focus:outline-none"
        />
      </label>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        更新密碼
      </button>
    </form>
  );
}

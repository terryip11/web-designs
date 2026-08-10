"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { signIn, signUp } from "@/lib/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
  next?: string;
}

type AuthResult = {
  error?: string;
  needsVerification?: boolean;
  email?: string;
} | null;

export default function AuthForm({ mode, next = "/account" }: AuthFormProps) {
  const router = useRouter();
  const isLogin = mode === "login";
  const safeNext = next.startsWith("/") ? next : "/account";
  const action = isLogin ? signIn : signUp;

  const [state, formAction, pending] = useActionState(
    async (_prev: AuthResult, formData: FormData): Promise<AuthResult> => {
      formData.set("next", safeNext);
      const result = await action(formData);
      return result ?? null;
    },
    null
  );

  useEffect(() => {
    if (state?.needsVerification && state.email) {
      router.push(`/verify-email?email=${encodeURIComponent(state.email)}`);
    }
  }, [state, router]);

  if (!isSupabaseConfigured()) {
    return (
      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        Supabase 尚未設定。請在 `.env.local` 填入{" "}
        <code className="text-amber-100">NEXT_PUBLIC_SUPABASE_URL</code> 與{" "}
        <code className="text-amber-100">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>，然後重新啟動{" "}
        <code className="text-amber-100">npm run dev</code>。
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <GoogleSignInButton next={safeNext} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-zinc-900/50 px-2 text-zinc-600">或使用 Email</span>
        </div>
      </div>

      <form action={formAction} className="space-y-5">
        {!isLogin && (
          <div>
            <label htmlFor="displayName" className="mb-1.5 block text-sm text-zinc-400">
              顯示名稱
            </label>
            <input
              id="displayName"
              name="displayName"
              maxLength={50}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="如何稱呼您"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-zinc-400">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-zinc-400">
            密碼 <span className="text-red-400">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={isLogin ? "current-password" : "new-password"}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          {!isLogin && (
            <p className="mt-1 text-xs text-zinc-600">
              至少 6 個字元 · 若 Supabase 開啟 Email 驗證，註冊後需確認信箱
            </p>
          )}
        </div>

        {state?.error && (
          <div className="space-y-2">
            <p className="text-sm text-red-400">{state.error}</p>
            {state.error.includes("驗證") && (
              <Link href="/verify-email" className="text-xs text-violet-400 hover:underline">
                前往驗證說明
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 font-medium text-white hover:bg-violet-500 disabled:opacity-60"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLogin ? "登入" : "註冊"}
        </button>

        <p className="text-center text-sm text-zinc-500">
          {isLogin ? (
            <>
              還沒有帳號？{" "}
              <Link
                href={`/signup${safeNext !== "/account" ? `?next=${encodeURIComponent(safeNext)}` : ""}`}
                className="text-violet-400 hover:underline"
              >
                立即註冊
              </Link>
            </>
          ) : (
            <>
              已有帳號？{" "}
              <Link
                href={`/login${safeNext !== "/account" ? `?next=${encodeURIComponent(safeNext)}` : ""}`}
                className="text-violet-400 hover:underline"
              >
                登入
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}

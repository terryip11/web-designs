"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { getAuthCallbackUrl } from "@/lib/auth/site-url";
import { createBrowserClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
  next?: string;
}

export default function AuthForm({ mode, next = "/account" }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";
  const safeNext = next.startsWith("/") ? next : "/account";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const displayName = String(formData.get("displayName") ?? "").trim();

    if (!email || !password) {
      setError("請填寫 Email 與密碼");
      setLoading(false);
      return;
    }

    const supabase = createBrowserClient();

    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.toLowerCase().includes("email not confirmed")) {
          setError("請先至 Email 信箱點擊驗證連結");
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } else {
          setError("Email 或密碼不正確");
        }
        setLoading(false);
        return;
      }

      router.refresh();
      window.location.href = safeNext;
      return;
    }

    if (password.length < 6) {
      setError("密碼至少 6 個字元");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || undefined },
        emailRedirectTo: getAuthCallbackUrl(safeNext),
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      return;
    }

    router.refresh();
    window.location.href = safeNext;
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

      <form onSubmit={handleSubmit} className="space-y-5">
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

        {error && (
          <div className="space-y-2">
            <p className="text-sm text-red-400">{error}</p>
            {error.includes("驗證") && (
              <Link href="/verify-email" className="text-xs text-violet-400 hover:underline">
                前往驗證說明
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 font-medium text-white hover:bg-violet-500 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
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

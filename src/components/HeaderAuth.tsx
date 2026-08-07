"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Shield, User } from "lucide-react";
import { signOut } from "@/lib/auth/actions";

export default function HeaderAuth() {
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setEmail(data.user?.email ?? null);
        setIsAdmin(Boolean(data.isAdmin));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-9 w-20 animate-pulse rounded-lg bg-zinc-800" />;
  }

  if (!email) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          登入
        </Link>
        <Link
          href="/signup"
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-violet-500 hover:text-white"
        >
          註冊
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-amber-400/90 transition-colors hover:bg-amber-500/10"
        >
          <Shield className="h-4 w-4" />
          後台
        </Link>
      )}
      <Link
        href="/account"
        className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-white sm:inline-flex"
      >
        <User className="h-4 w-4" />
        會員中心
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          title={email}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">登出</span>
        </button>
      </form>
    </div>
  );
}

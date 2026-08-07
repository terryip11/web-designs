import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import RevealOnScroll from "@/components/RevealOnScroll";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <RevealOnScroll>
        <h1 className="text-2xl font-bold text-white">會員登入</h1>
        <p className="mt-2 text-sm text-zinc-500">
          登入後可儲存方案、查看詢價紀錄
        </p>
        {error === "auth" && (
          <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            登入驗證失敗。Google 登入請確認 Supabase 已設定 Google Provider，並在
            Redirect URLs 加入{" "}
            <code className="text-red-200">http://localhost:3000/auth/callback</code>
          </p>
        )}
      </RevealOnScroll>

      <RevealOnScroll delay={0.05}>
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <AuthForm mode="login" next={next ?? "/account"} />
        </div>
        <p className="mt-4 text-center text-xs text-zinc-600">
          <Link href="/" className="hover:text-zinc-400">
            ← 返回首頁
          </Link>
        </p>
      </RevealOnScroll>
    </div>
  );
}

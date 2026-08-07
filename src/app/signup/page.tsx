import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import RevealOnScroll from "@/components/RevealOnScroll";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <RevealOnScroll>
        <h1 className="text-2xl font-bold text-white">註冊會員</h1>
        <p className="mt-2 text-sm text-zinc-500">
          免費註冊，儲存您的選配方案與草圖
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.05}>
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <AuthForm mode="signup" next={next ?? "/account"} />
        </div>
        <p className="mt-4 text-center text-xs text-zinc-600">
          註冊即表示同意{" "}
          <Link href="/privacy" className="text-violet-400 hover:underline">
            私隱政策
          </Link>
        </p>
      </RevealOnScroll>
    </div>
  );
}

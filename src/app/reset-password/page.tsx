import Link from "next/link";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <RevealOnScroll>
        <h1 className="text-2xl font-bold text-white">重設密碼</h1>
        <p className="mt-2 text-sm text-zinc-500">請設定新的登入密碼</p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.05}>
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <ResetPasswordForm />
        </div>
        <p className="mt-4 text-center text-sm text-zinc-500">
          <Link href="/forgot-password" className="text-violet-400 hover:underline">
            重新寄送連結
          </Link>
          {" · "}
          <Link href="/login" className="text-violet-400 hover:underline">
            返回登入
          </Link>
        </p>
      </RevealOnScroll>
    </div>
  );
}

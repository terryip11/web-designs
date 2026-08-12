import Link from "next/link";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <RevealOnScroll>
        <h1 className="text-2xl font-bold text-white">忘記密碼</h1>
        <p className="mt-2 text-sm text-zinc-500">
          輸入註冊 Email，我們會寄送重設密碼連結
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.05}>
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <ForgotPasswordForm />
        </div>
        <p className="mt-4 text-center text-sm text-zinc-500">
          <Link href="/login" className="text-violet-400 hover:underline">
            ← 返回登入
          </Link>
        </p>
      </RevealOnScroll>
    </div>
  );
}

import Link from "next/link";
import VerifyEmailPanel from "@/components/VerifyEmailPanel";
import RevealOnScroll from "@/components/RevealOnScroll";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  if (!email) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-zinc-500">缺少 Email 參數。</p>
        <Link href="/signup" className="mt-4 inline-block text-violet-400 hover:underline">
          返回註冊
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <RevealOnScroll>
        <VerifyEmailPanel email={email} />
      </RevealOnScroll>
    </div>
  );
}

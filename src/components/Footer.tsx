import Link from "next/link";
import WhatsAppContactLink from "@/components/WhatsAppContactLink";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} desigpick-digital — 網站設計選配平台 · 價格參考香港市場行情（HKD）
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
          <Link href="/templates" className="hover:text-zinc-300">
            介面庫
          </Link>
          <Link href="/demos" className="hover:text-zinc-300">
            展示站
          </Link>
          <Link href="/contact" className="hover:text-zinc-300">
            聯絡我們
          </Link>
          <Link href="/blog" className="hover:text-zinc-300">
            資訊文章
          </Link>
          <Link href="/faq" className="hover:text-zinc-300">
            常見問題
          </Link>
          <Link href="/privacy" className="hover:text-zinc-300">
            私隱政策
          </Link>
          <WhatsAppContactLink className="inline-flex items-center gap-1.5 text-emerald-500/80 hover:text-emerald-400" />
        </div>
      </div>
    </footer>
  );
}

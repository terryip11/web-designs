import Link from "next/link";
import { Layers } from "lucide-react";
import HeaderAuth from "@/components/HeaderAuth";
import { DesktopNav, MobileNav } from "@/components/HeaderNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 transition-colors group-hover:bg-violet-500">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Design<span className="text-violet-400">Pick</span>
          </span>
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-1 sm:gap-2">
          <HeaderAuth />
          <Link
            href="/templates"
            className="hidden rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 sm:inline-block"
          >
            開始選配
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

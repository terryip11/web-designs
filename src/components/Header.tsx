import Link from "next/link";

import { Layers } from "lucide-react";

import HeaderAuth from "@/components/HeaderAuth";



const navItems = [

  { href: "/templates", label: "介面庫" },

  { href: "/sketch", label: "介面草圖" },

  { href: "/configure", label: "方案選配" },

  { href: "/summary", label: "方案摘要" },

  { href: "/contact", label: "聯絡我們" },

];



export default function Header() {

  return (

    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        <Link href="/" className="flex shrink-0 items-center gap-2.5 group">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 transition-colors group-hover:bg-violet-500">

            <Layers className="h-5 w-5 text-white" />

          </div>

          <span className="text-lg font-semibold tracking-tight text-white">

            Design<span className="text-violet-400">Pick</span>

          </span>

        </Link>



        <nav className="hidden items-center gap-1 lg:flex">

          {navItems.map((item) => (

            <Link

              key={item.href}

              href={item.href}

              className="rounded-lg px-3.5 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-white"

            >

              {item.label}

            </Link>

          ))}

        </nav>



        <div className="flex items-center gap-2 sm:gap-3">

          <HeaderAuth />

          <Link

            href="/templates"

            className="hidden rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 sm:inline-block"

          >

            開始選配

          </Link>

        </div>

      </div>
    </header>

  );

}


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export const headerNavItems = [
  { href: "/templates", label: "介面庫" },
  { href: "/demos", label: "展示站" },
  { href: "/sketch", label: "介面草圖" },
  { href: "/configure", label: "方案選配" },
  { href: "/summary", label: "方案摘要" },
  { href: "/blog", label: "資訊" },
  { href: "/contact", label: "聯絡我們" },
] as const;

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {headerNavItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3.5 py-2 text-sm transition-colors ${
              active
                ? "bg-zinc-800/80 text-white"
                : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-white"
        aria-expanded={open}
        aria-label={open ? "關閉選單" : "開啟選單"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-sm"
            aria-label="關閉選單"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed left-0 right-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-zinc-800 bg-zinc-950/98 px-4 py-4 shadow-xl">
            <ul className="space-y-1">
              {headerNavItems.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex rounded-xl px-4 py-3 text-base transition-colors ${
                        active
                          ? "bg-violet-600/15 font-medium text-violet-300"
                          : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/templates"
              onClick={() => setOpen(false)}
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-500"
            >
              開始選配
            </Link>
          </nav>
        </>
      )}
    </div>
  );
}

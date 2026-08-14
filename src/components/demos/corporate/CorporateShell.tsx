"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { CORPORATE_BRAND } from "@/lib/demo-sites/corporate-data";

const NAV = [
  { href: "", label: "首頁" },
  { href: "/services", label: "服務" },
  { href: "/team", label: "團隊" },
  { href: "/cases", label: "案例" },
  { href: "/contact", label: "聯絡" },
];

export default function CorporateShell({
  children,
  basePath,
}: {
  children: React.ReactNode;
  basePath: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function href(path: string) {
    return `${basePath}${path}`;
  }

  function isActive(path: string) {
    const full = href(path);
    if (path === "") return pathname === basePath || pathname === `${basePath}/`;
    return pathname.startsWith(full);
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href={href("")} className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB] text-sm font-bold text-white">
              SA
            </div>
            <div>
              <p className="font-semibold text-[#1E293B] group-hover:text-[#2563EB]">
                {CORPORATE_BRAND.name}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[#2563EB]/80">
                {CORPORATE_BRAND.englishName}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={href(item.href)}
                className={`text-sm transition-colors ${
                  isActive(item.href)
                    ? "font-semibold text-[#2563EB]"
                    : "text-slate-600 hover:text-[#2563EB]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href={href("/contact")}
            className="hidden items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 md:inline-flex"
          >
            預約諮詢
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="選單"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-slate-200 px-4 py-4 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={href(item.href)}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-slate-600 hover:text-[#2563EB]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {children}

      <footer className="border-t border-slate-200 bg-[#1E293B] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <p className="text-lg font-semibold">{CORPORATE_BRAND.name}</p>
            <p className="mt-2 text-sm text-white/60">{CORPORATE_BRAND.englishName}</p>
            <p className="mt-4 text-sm text-white/70">{CORPORATE_BRAND.tagline}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">聯絡</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>{CORPORATE_BRAND.phone}</li>
              <li>{CORPORATE_BRAND.email}</li>
              <li>{CORPORATE_BRAND.address}</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">服務範圍</p>
            <p className="mt-4 text-sm text-white/80">
              策略顧問 · 營運優化 · 數碼轉型 · 合規與風險
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
          © 2026 {CORPORATE_BRAND.name} · desigpick-digital 模板展示
        </div>
      </footer>
    </div>
  );
}

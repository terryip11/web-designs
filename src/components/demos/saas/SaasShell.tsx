"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SAAS_BRAND } from "@/lib/demo-sites/saas-data";

const NAV = [
  { href: "", label: "首頁" },
  { href: "/features", label: "功能" },
  { href: "/pricing", label: "定價" },
  { href: "/customers", label: "客戶案例" },
  { href: "/contact", label: "聯絡" },
];

export default function SaasShell({
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
    <div className="min-h-screen bg-[#0F172A] text-[#E2E8F0]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href={href("")} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6366F1] text-sm font-bold text-white">
              FS
            </div>
            <span className="text-lg font-bold text-white">{SAAS_BRAND.name}</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={href(item.href)}
                className={`text-sm transition-colors ${
                  isActive(item.href)
                    ? "font-semibold text-[#6366F1]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href={href("/contact")}
            className="hidden rounded-lg bg-[#6366F1] px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 md:inline-flex"
          >
            免費試用
          </Link>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="選單"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-white/10 px-4 py-4 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={href(item.href)}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-slate-400 hover:text-[#6366F1]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {children}

      <footer className="border-t border-white/10 bg-[#0a0f1a]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="font-bold text-white">{SAAS_BRAND.name}</p>
          <p className="mt-2 text-sm text-slate-500">{SAAS_BRAND.tagline}</p>
          <p className="mt-4 text-sm text-slate-600">
            {SAAS_BRAND.email} · {SAAS_BRAND.address}
          </p>
          <p className="mt-8 text-center text-xs text-slate-600">
            © 2026 {SAAS_BRAND.name} · desigpick-digital 模板展示
          </p>
        </div>
      </footer>
    </div>
  );
}

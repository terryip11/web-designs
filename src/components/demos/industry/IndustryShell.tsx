"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import type { IndustryBrand } from "@/lib/demo-sites/industry-brands";

const NAV = [
  { href: "", label: "首頁" },
  { href: "/about", label: "關於" },
  { href: "/services", label: "服務" },
  { href: "/contact", label: "聯絡" },
];

export default function IndustryShell({
  brand,
  basePath,
  children,
}: {
  brand: IndustryBrand;
  basePath: string;
  children: React.ReactNode;
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
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href={href("")} className="group flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {brand.initials}
            </div>
            <div>
              <p className="font-semibold" style={{ color: brand.textColor }}>
                {brand.name}
              </p>
              <p className="text-[10px] uppercase tracking-wider opacity-70">
                {brand.englishName}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={href(item.href)}
                className={`text-sm transition-colors ${
                  isActive(item.href) ? "font-semibold" : "text-slate-600 hover:opacity-80"
                }`}
                style={isActive(item.href) ? { color: brand.primaryColor } : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href={href("/contact")}
            className="hidden items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white md:inline-flex"
            style={{ backgroundColor: brand.primaryColor }}
          >
            {brand.ctaLabel}
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
                className="block py-2 text-sm text-slate-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {children}

      <footer className="text-white" style={{ backgroundColor: brand.textColor }}>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <p className="text-lg font-semibold">{brand.name}</p>
            <p className="mt-2 text-sm text-white/60">{brand.englishName}</p>
            <p className="mt-4 text-sm text-white/70">{brand.tagline}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">聯絡</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>{brand.phone}</li>
              <li>{brand.email}</li>
              <li>{brand.address}</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">DesignPick 展示</p>
            <p className="mt-4 text-sm text-white/80">
              此為 DesignPick 模板展示站，供客戶預覽網站設計風格同功能。
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
          © 2026 {brand.name} · DesignPick 模板展示
        </div>
      </footer>
    </div>
  );
}

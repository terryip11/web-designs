"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { PROPERTY_BRAND } from "@/lib/demo-sites/property-data";

const NAV = [
  { href: "", label: "首頁" },
  { href: "/listings", label: "樓盤搜尋" },
  { href: "/about", label: "關於我們" },
  { href: "/contact", label: "聯絡" },
];

export default function PropertyShell({
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
    <div className="min-h-screen bg-[#FFFBEB] text-[#1C1917]">
      <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#FFFBEB] shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href={href("")} className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#92400E] text-sm font-bold text-[#FFFBEB]">
              LR
            </div>
            <div>
              <p className="font-serif text-lg font-semibold tracking-wide text-[#1C1917] group-hover:text-[#92400E]">
                {PROPERTY_BRAND.name}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#92400E]/70">
                {PROPERTY_BRAND.englishName}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={href(item.href)}
                className={`text-sm transition-colors ${
                  isActive(item.href)
                    ? "font-semibold text-[#92400E]"
                    : "text-[#57534E] hover:text-[#92400E]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`tel:${PROPERTY_BRAND.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 text-sm text-[#57534E] hover:text-[#92400E]"
            >
              <Phone className="h-4 w-4" />
              {PROPERTY_BRAND.phone}
            </a>
            <Link
              href={href("/contact")}
              className="rounded-full bg-[#92400E] px-5 py-2.5 text-sm font-medium text-[#FFFBEB] transition hover:bg-[#78350F]"
            >
              預約睇樓
            </Link>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-[#57534E] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="選單"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-[#92400E]/10 px-4 py-4 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={href(item.href)}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-[#57534E] hover:text-[#92400E]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {children}

      <footer className="border-t border-[#92400E]/10 bg-[#1C1917] text-[#FFFBEB]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <p className="font-serif text-xl font-semibold">{PROPERTY_BRAND.name}</p>
            <p className="mt-2 text-sm text-[#FFFBEB]/60">{PROPERTY_BRAND.englishName}</p>
            <p className="mt-4 text-sm leading-relaxed text-[#FFFBEB]/70">
              專注香港高端住宅及商業物業，為買家、租客及業主提供一對一顧問服務。
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#FFFBEB]/50">
              聯絡
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#FFFBEB]/80">
              <li>{PROPERTY_BRAND.phone}</li>
              <li>{PROPERTY_BRAND.email}</li>
              <li>{PROPERTY_BRAND.address}</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#FFFBEB]/50">
              快速連結
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={href(item.href)}
                    className="text-[#FFFBEB]/80 hover:text-[#FFFBEB]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-[#FFFBEB]/40">
          © 2026 {PROPERTY_BRAND.name} · 此為 DesignPick 模板展示，非真實地產公司
        </div>
      </footer>
    </div>
  );
}

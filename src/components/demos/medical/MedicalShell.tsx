"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Calendar, Menu, Phone, Shield, X } from "lucide-react";
import { MEDICAL_BRAND } from "@/lib/demo-sites/medical-data";

const NAV = [
  { href: "", label: "首頁" },
  { href: "/services", label: "服務項目" },
  { href: "/doctors", label: "醫師團隊" },
  { href: "/booking", label: "預約" },
  { href: "/contact", label: "聯絡" },
];

export default function MedicalShell({
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
    <div className="min-h-screen bg-[#F0FDFA] text-[#334155]">
      <header className="sticky top-0 z-50 border-b border-[#0EA5E9]/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href={href("")} className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0EA5E9] text-sm font-bold text-white">
              TM
            </div>
            <div>
              <p className="font-semibold text-[#334155] group-hover:text-[#0EA5E9]">
                {MEDICAL_BRAND.name}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[#0EA5E9]/80">
                {MEDICAL_BRAND.englishName}
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
                    ? "font-semibold text-[#0EA5E9]"
                    : "text-[#64748B] hover:text-[#0EA5E9]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={href("/booking")}
              className="inline-flex items-center gap-2 rounded-full bg-[#0EA5E9] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0284C7]"
            >
              <Calendar className="h-4 w-4" />
              網上預約
            </Link>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-[#64748B] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="選單"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-[#0EA5E9]/10 px-4 py-4 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={href(item.href)}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-[#64748B] hover:text-[#0EA5E9]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {children}

      <footer className="border-t border-[#0EA5E9]/10 bg-[#334155] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <p className="text-lg font-semibold">{MEDICAL_BRAND.name}</p>
            <p className="mt-2 text-sm text-white/60">{MEDICAL_BRAND.englishName}</p>
            <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-white/70">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#0EA5E9]" />
              網站內容符合香港醫療廣告相關規定，此為 DesignPick 模板展示。
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
              聯絡
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#0EA5E9]" />
                {MEDICAL_BRAND.phone}
              </li>
              <li>{MEDICAL_BRAND.email}</li>
              <li>{MEDICAL_BRAND.address}</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
              診症時間
            </p>
            <p className="mt-4 text-sm text-white/80">{MEDICAL_BRAND.hours}</p>
            <Link
              href={href("/booking")}
              className="mt-6 inline-flex rounded-full bg-[#0EA5E9] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0284C7]"
            >
              立即預約
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
          © 2026 {MEDICAL_BRAND.name} · DesignPick 模板展示，非真實醫療機構
        </div>
      </footer>
    </div>
  );
}

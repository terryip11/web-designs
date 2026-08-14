"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Calendar, MapPin, Menu, Phone, X } from "lucide-react";
import { RESTAURANT_BRAND } from "@/lib/demo-sites/restaurant-data";

const NAV = [
  { href: "", label: "首頁" },
  { href: "/menu", label: "菜單" },
  { href: "/about", label: "關於" },
  { href: "/reservations", label: "訂位" },
  { href: "/contact", label: "聯絡" },
];

export default function RestaurantShell({
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
    <div className="min-h-screen bg-[#FDF6EC] text-[#2D3436]">
      <header className="sticky top-0 z-50 border-b border-[#E8A87C]/20 bg-[#FDF6EC] shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href={href("")} className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8A87C] text-sm font-bold text-white">
              WT
            </div>
            <div>
              <p className="font-serif font-semibold text-[#2D3436] group-hover:text-[#E8A87C]">
                {RESTAURANT_BRAND.name}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[#E8A87C]">
                {RESTAURANT_BRAND.englishName}
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
                    ? "font-semibold text-[#E8A87C]"
                    : "text-[#636E72] hover:text-[#E8A87C]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={href("/reservations")}
              className="inline-flex items-center gap-2 rounded-full bg-[#E8A87C] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#d4956a]"
            >
              <Calendar className="h-4 w-4" />
              網上訂位
            </Link>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-[#636E72] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="選單"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-[#E8A87C]/15 px-4 py-4 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={href(item.href)}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-[#636E72] hover:text-[#E8A87C]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={href("/reservations")}
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#E8A87C] px-5 py-2.5 text-sm font-medium text-white"
            >
              <Calendar className="h-4 w-4" />
              網上訂位
            </Link>
          </nav>
        )}
      </header>

      {children}

      <footer className="border-t border-[#E8A87C]/20 bg-[#2D3436] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <p className="font-serif text-lg font-semibold">{RESTAURANT_BRAND.name}</p>
            <p className="mt-2 text-sm text-white/60">{RESTAURANT_BRAND.englishName}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{RESTAURANT_BRAND.tagline}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">聯絡</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#E8A87C]" />
                {RESTAURANT_BRAND.phone}
              </li>
              <li>{RESTAURANT_BRAND.email}</li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E8A87C]" />
                {RESTAURANT_BRAND.address}
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">營業時間</p>
            <p className="mt-4 text-sm text-white/80">{RESTAURANT_BRAND.hours}</p>
            <Link
              href={href("/reservations")}
              className="mt-6 inline-flex rounded-full bg-[#E8A87C] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#d4956a]"
            >
              立即訂位
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
          © 2026 {RESTAURANT_BRAND.name} · desigpick-digital 模板展示，非真實餐廳
        </div>
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { ECOMMERCE_BRAND } from "@/lib/demo-sites/ecommerce-data";

const NAV = [
  { href: "", label: "首頁" },
  { href: "/products", label: "商品" },
  { href: "/about", label: "關於" },
  { href: "/contact", label: "聯絡" },
];

export default function EcommerceShell({
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
    <div className="min-h-screen bg-[#1A1A2E] text-[#F5F5F5]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1A1A2E]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href={href("")} className="group">
            <p className="text-lg font-bold tracking-wider text-white group-hover:text-[#E94560]">
              {ECOMMERCE_BRAND.name}
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
              {ECOMMERCE_BRAND.englishName}
            </p>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={href(item.href)}
                className={`text-sm transition-colors ${
                  isActive(item.href)
                    ? "font-semibold text-[#E94560]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href={href("/cart")}
            className="hidden items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-[#E94560] hover:text-[#E94560] md:inline-flex"
          >
            <ShoppingBag className="h-4 w-4" />
            購物車
          </Link>

          <button
            type="button"
            className="rounded-lg p-2 text-white/70 md:hidden"
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
                className="block py-2 text-sm text-white/70 hover:text-[#E94560]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={href("/cart")}
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center gap-2 text-sm text-[#E94560]"
            >
              <ShoppingBag className="h-4 w-4" />
              購物車
            </Link>
          </nav>
        )}
      </header>

      {children}

      <footer className="border-t border-white/10 bg-[#12121f]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-lg font-bold text-white">{ECOMMERCE_BRAND.name}</p>
          <p className="mt-2 text-sm text-white/50">{ECOMMERCE_BRAND.tagline}</p>
          <p className="mt-4 text-sm text-white/40">
            {ECOMMERCE_BRAND.email} · {ECOMMERCE_BRAND.phone}
          </p>
          <p className="mt-8 text-center text-xs text-white/30">
            © 2026 {ECOMMERCE_BRAND.name} · desigpick-digital 模板展示
          </p>
        </div>
      </footer>
    </div>
  );
}

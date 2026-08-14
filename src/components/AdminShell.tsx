"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  ExternalLink,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Newspaper,
  User,
  UserCog,
  X,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "營運",
    items: [
      { href: "/admin", label: "總覽", icon: LayoutDashboard, exact: true },
      {
        href: "/admin/inquiries",
        label: "客戶詢價",
        icon: MessageSquare,
        exact: false,
      },
      {
        href: "/admin/members",
        label: "會員管理",
        icon: UserCog,
        exact: false,
      },
    ],
  },
  {
    label: "數據",
    items: [
      {
        href: "/admin/analytics",
        label: "網站瀏覽",
        icon: BarChart3,
        exact: false,
      },
    ],
  },
  {
    label: "內容",
    items: [
      {
        href: "/admin/blog",
        label: "Blog 文章",
        icon: Newspaper,
        exact: false,
      },
    ],
  },
] as const;

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-6 px-3 py-4">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            {section.label}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const active = isActive(pathname, item.href, item.exact);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-violet-600/15 text-violet-300 ring-1 ring-violet-500/30"
                        : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div>
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          快捷
        </p>
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/80 hover:text-white"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              返回網站
            </Link>
          </li>
          <li>
            <Link
              href="/account"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/80 hover:text-white"
            >
              <User className="h-4 w-4 shrink-0" />
              會員中心
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function SidebarBrand() {
  return (
    <div className="border-b border-zinc-800 px-5 py-5">
      <Link href="/admin" className="block">
        <p className="text-xs font-medium uppercase tracking-wide text-amber-400/80">
          desigpick-digital
        </p>
        <p className="mt-1 text-lg font-semibold text-white">管理後台</p>
      </Link>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {mobileOpen && (
        <button
          type="button"
          aria-label="關閉選單"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-zinc-900/95 backdrop-blur transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between lg:block">
          <SidebarBrand />
          <button
            type="button"
            aria-label="關閉選單"
            className="m-4 rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-zinc-800 bg-zinc-950/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            aria-label="開啟選單"
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-sm font-medium text-white">管理後台</p>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

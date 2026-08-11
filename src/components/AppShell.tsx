"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function isDemoPath(pathname: string) {
  return /^\/demos\/[^/]+/.test(pathname);
}

function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin");
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  if (isDemoPath(pathname) || isAdminPath(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="designpick-app flex min-h-full flex-1 flex-col bg-zinc-950 text-zinc-100">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

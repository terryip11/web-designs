"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function isStandaloneDemoRoute(pathname: string): boolean {
  return /^\/demos\/[^/]+/.test(pathname);
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const standaloneDemo = isStandaloneDemoRoute(pathname);

  if (standaloneDemo) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

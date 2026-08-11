"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AppShell({
  children,
  isDemoRoute = false,
  isAdminRoute = false,
}: {
  children: React.ReactNode;
  isDemoRoute?: boolean;
  isAdminRoute?: boolean;
}) {
  if (isDemoRoute || isAdminRoute) {
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

import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import AppShell from "@/components/AppShell";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import SeoJsonLd from "@/components/SeoJsonLd";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { getRootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = getRootMetadata();

export const viewport: Viewport = {
  themeColor: "#7c3aed",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-next-pathname") ?? "";
  const isDemoRoute = /^\/demos\/[^/]+/.test(pathname);
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SeoJsonLd />
        <GoogleAnalytics enabled={!isAdminRoute} />
        <ServiceWorkerRegister />
        <AppShell isDemoRoute={isDemoRoute} isAdminRoute={isAdminRoute}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}

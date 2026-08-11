import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "介面庫",
  description: "瀏覽各行業網站介面模板，依類別與風格篩選，找到最適合的設計方向。",
  path: "/templates",
});

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "方案摘要",
  description: "確認已選介面、設計細節與功能模組，產生完整方案摘要並提交需求。",
  path: "/summary",
});

export default function SummaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

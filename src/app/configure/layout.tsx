import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "方案選配",
  description: "選擇雙欄版面、導航樣式、飛入動效與功能模組，即時查看香港參考報價。",
  path: "/configure",
});

export default function ConfigureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

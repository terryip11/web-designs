import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "重設密碼",
  description: "設定新的 DesignPick 會員密碼。",
  path: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

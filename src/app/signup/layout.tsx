import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "註冊",
  description: "建立 DesignPick 會員帳戶。",
  path: "/signup",
  noIndex: true,
});

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

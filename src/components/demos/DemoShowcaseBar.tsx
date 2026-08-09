"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ExternalLink, Layers, X } from "lucide-react";
import { getDemoByTemplateId } from "@/lib/demo-sites/registry";
import { getDemoPath } from "@/lib/demo-sites/urls";

export default function DemoShowcaseBar({
  templateId,
}: {
  templateId: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const demo = getDemoByTemplateId(templateId);
  const embed = searchParams.get("embed") === "1";
  const dismissed = searchParams.get("hidebar") === "1";

  if (!demo || embed || dismissed) return null;

  const demoRoot = getDemoPath(templateId) ?? `/demos/${templateId}`;

  function hideBarHref() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("hidebar", "1");
    const q = params.toString();
    return q ? `${pathname}?${q}` : `${pathname}?hidebar=1`;
  }

  return (
    <div className="sticky top-0 z-[100] border-b border-violet-500/30 bg-violet-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2 text-sm text-violet-100">
          <Layers className="h-4 w-4 shrink-0 text-violet-300" />
          <span>
            DesignPick 模板展示 · <strong>{demo.brandName}</strong>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/templates/${templateId}`}
            className="rounded-lg border border-violet-400/40 px-3 py-1.5 text-xs text-violet-100 hover:bg-violet-500/20"
          >
            返回介面詳情
          </Link>
          <Link
            href={`${demoRoot}?hidebar=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500"
          >
            全螢幕預覽
            <ExternalLink className="h-3 w-3" />
          </Link>
          <Link
            href={hideBarHref()}
            className="rounded-lg p-1.5 text-violet-300 hover:bg-violet-500/20"
            aria-label="隱藏展示列"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

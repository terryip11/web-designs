"use client";

import Link from "next/link";
import { ArrowRight, Check, Pencil, Layers, Settings, FileText, Send } from "lucide-react";

const steps = [
  { href: "/sketch", label: "畫草圖", icon: Pencil, key: "sketch" },
  { href: "/templates", label: "選介面", icon: Layers, key: "templates" },
  { href: "/configure", label: "方案選配", icon: Settings, key: "configure" },
  { href: "/summary", label: "方案摘要", icon: FileText, key: "summary" },
  { href: "/contact", label: "提交需求", icon: Send, key: "contact" },
] as const;

export default function DesignFlowBanner({
  current,
}: {
  current: (typeof steps)[number]["key"];
}) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <nav
      aria-label="設計流程"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
        建議流程 · 草圖與介面庫可互相搭配
      </p>
      <ol className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isCurrent = step.key === current;
          const isDone = i < currentIndex;

          return (
            <li key={step.key} className="flex items-center gap-2">
              {i > 0 && (
                <ArrowRight className="hidden h-3 w-3 shrink-0 text-zinc-700 sm:block" />
              )}
              <Link
                href={step.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  isCurrent
                    ? "bg-violet-600 text-white"
                    : isDone
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white"
                }`}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
                {step.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

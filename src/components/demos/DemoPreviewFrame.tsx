"use client";

import { Monitor } from "lucide-react";

export default function DemoPreviewFrame({
  src,
  title,
  className = "",
}: {
  src: string;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900 shadow-2xl ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4 py-2.5">
        <div className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" aria-hidden />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 text-xs text-zinc-500">
          <Monitor className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{title}</span>
        </div>
      </div>
      <div className="relative aspect-[16/10] w-full bg-white">
        <iframe
          key={src}
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}

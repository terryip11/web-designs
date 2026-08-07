"use client";

import type { ComponentType } from "react";
import type { PreviewVariant } from "@/lib/template-preview-variants";

interface VariantProps {
  primary: string;
  secondary: string;
  accent: string;
  isMobile: boolean;
}

function Chrome({
  bg,
  isMobile,
  dark = false,
}: {
  bg: string;
  isMobile: boolean;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5" style={{ backgroundColor: bg }}>
      {!isMobile && (
        <>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-white/25" : "bg-black/15"}`}
              />
            ))}
          </div>
          <div className={`ml-2 h-1 flex-1 rounded ${dark ? "bg-white/15" : "bg-black/8"}`} />
        </>
      )}
      {isMobile && <div className="mx-auto h-0.5 w-5 rounded-full bg-white/30" />}
    </div>
  );
}

function Restaurant({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <Chrome bg={primary} isMobile={isMobile} dark />
      <div style={{ backgroundColor: secondary }} className="p-2">
        <div
          className="rounded-lg py-4 text-center"
          style={{ backgroundColor: primary }}
        >
          <div className="mx-auto h-1.5 w-2/3 rounded bg-white/50" />
          <div className="mx-auto mt-1.5 h-1 w-1/2 rounded bg-white/30" />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {["前菜", "主餐", "甜品", "飲品"].map((label) => (
            <div
              key={label}
              className="rounded-md p-2"
              style={{ backgroundColor: `${accent}18` }}
            >
              <div className="mb-1 h-6 rounded-sm" style={{ backgroundColor: primary, opacity: 0.35 }} />
              <div className="h-0.5 w-2/3 rounded" style={{ backgroundColor: accent, opacity: 0.5 }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Ecommerce({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <Chrome bg={primary} isMobile={isMobile} dark />
      <div style={{ backgroundColor: primary }} className="px-2 py-2">
        <div className="mb-2 h-1 w-1/2 rounded bg-white/20" />
        <div className={`grid gap-1.5 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-md bg-white/10">
              <div className="aspect-square bg-white/5" />
              <div className="p-1">
                <div className="h-0.5 w-full rounded bg-white/20" />
                <div className="mt-0.5 text-[6px] font-bold" style={{ color: accent }}>
                  HK$999
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Corporate({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <div className="flex items-center justify-between px-3 py-2" style={{ backgroundColor: primary }}>
        <div className="h-2 w-8 rounded bg-white/40" />
        {!isMobile && (
          <div className="flex gap-2">
            {["服務", "團隊", "案例"].map((t) => (
              <span key={t} className="text-[6px] text-white/60">{t}</span>
            ))}
          </div>
        )}
      </div>
      <div style={{ backgroundColor: secondary }} className="p-2">
        <div className="mb-2 flex gap-2">
          <div className="flex-1 space-y-1">
            <div className="h-2 w-4/5 rounded" style={{ backgroundColor: accent, opacity: 0.8 }} />
            <div className="h-1 w-3/5 rounded bg-zinc-200" />
          </div>
          {!isMobile && (
            <div className="w-1/3 rounded-md" style={{ backgroundColor: `${primary}20` }} />
          )}
        </div>
        <div className={`grid gap-1 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded border border-zinc-100 p-1.5">
              <div className="mb-1 h-3 rounded-sm" style={{ backgroundColor: primary, opacity: 0.15 }} />
              <div className="h-0.5 w-full rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Portfolio({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <Chrome bg={secondary} isMobile={isMobile} dark />
      <div style={{ backgroundColor: secondary }} className="p-2">
        <div className="mb-2">
          <div className="h-2.5 w-3/4 rounded" style={{ backgroundColor: accent }} />
          <div className="mt-1 h-1 w-1/2 rounded bg-white/20" />
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div className="col-span-2 row-span-2 rounded-md" style={{ backgroundColor: primary, minHeight: 28 }} />
          <div className="rounded-md" style={{ backgroundColor: accent, opacity: 0.6 }} />
          <div className="rounded-md bg-white/10" />
          <div className="rounded-md" style={{ backgroundColor: accent, opacity: 0.3 }} />
          <div className="rounded-md bg-white/10" />
        </div>
      </div>
    </>
  );
}

function Medical({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: primary }}>
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-[6px] text-white">+</div>
        {!isMobile && <div className="flex-1" />}
        <div className="rounded-full bg-white/90 px-2 py-0.5 text-[6px] font-medium" style={{ color: primary }}>
          預約
        </div>
      </div>
      <div style={{ backgroundColor: secondary }} className="p-2 space-y-2">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 rounded-lg bg-white p-1.5 text-center shadow-sm">
              <div className="mx-auto mb-1 h-4 w-4 rounded-full" style={{ backgroundColor: `${primary}30` }} />
              <div className="h-0.5 w-full rounded bg-zinc-200" />
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-white p-2">
          <div className="h-0.5 w-2/3 rounded" style={{ backgroundColor: accent, opacity: 0.4 }} />
          <div className="mt-1 h-0.5 w-full rounded bg-zinc-100" />
        </div>
      </div>
    </>
  );
}

function Education({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <Chrome bg={primary} isMobile={isMobile} dark />
      <div style={{ backgroundColor: secondary }} className="p-2">
        <div className="mb-2 rounded-lg p-2" style={{ backgroundColor: `${primary}25` }}>
          <div className="h-1.5 w-3/4 rounded" style={{ backgroundColor: accent, opacity: 0.7 }} />
          <div className="mt-1 h-1 w-1/2 rounded bg-black/10" />
        </div>
        <div className="space-y-1">
          {["英文班", "數學班", "藝術班"].map((c) => (
            <div key={c} className="flex items-center gap-2 rounded-md bg-white p-1.5">
              <div className="h-4 w-4 rounded" style={{ backgroundColor: primary, opacity: 0.5 }} />
              <div className="flex-1">
                <div className="h-0.5 w-full rounded bg-black/15" />
              </div>
              <div className="text-[5px] font-bold" style={{ color: primary }}>報名</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Beauty({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <div className="px-3 py-2 text-center" style={{ backgroundColor: secondary }}>
        <div className="mx-auto h-1.5 w-1/3 rounded" style={{ backgroundColor: primary, opacity: 0.6 }} />
      </div>
      <div className="relative" style={{ backgroundColor: secondary }}>
        <div className="mx-2 h-16 rounded-t-xl" style={{ backgroundColor: `${primary}35` }} />
        <div className="space-y-1 p-2 pt-1">
          {["剪髮", "染髮", "護理"].map((s) => (
            <div key={s} className="flex items-center justify-between border-b border-pink-100 pb-1">
              <div className="h-0.5 w-1/3 rounded" style={{ backgroundColor: accent, opacity: 0.4 }} />
              <div className="text-[5px]" style={{ color: primary }}>HK$</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Fitness({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <div className="px-3 py-2" style={{ backgroundColor: secondary }}>
        <div className="h-2 w-1/2 rounded font-bold" style={{ backgroundColor: primary, opacity: 0.9, height: 6 }} />
      </div>
      <div style={{ backgroundColor: secondary }} className="p-2">
        <div className="mb-2 h-10 rounded-lg bg-gradient-to-r from-green-900/50 to-transparent p-2" style={{ borderLeft: `2px solid ${primary}` }}>
          <div className="h-1 w-2/3 rounded bg-white/30" />
          <div className="mt-1 h-0.5 w-1/2 rounded bg-white/15" />
        </div>
        <div className="grid grid-cols-3 gap-1">
          {["MON", "WED", "FRI"].map((d) => (
            <div key={d} className="rounded bg-white/5 p-1 text-center">
              <div className="text-[5px] text-white/40">{d}</div>
              <div className="mx-auto mt-0.5 h-2 w-2 rounded-sm" style={{ backgroundColor: primary }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Property({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <Chrome bg={accent} isMobile={isMobile} dark />
      <div style={{ backgroundColor: secondary }} className="space-y-1.5 p-2">
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-2 overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="w-1/3 shrink-0" style={{ backgroundColor: `${primary}40`, minHeight: 24 }} />
            <div className="flex flex-1 flex-col justify-center gap-1 py-1">
              <div className="h-0.5 w-3/4 rounded" style={{ backgroundColor: accent, opacity: 0.6 }} />
              <div className="h-0.5 w-1/2 rounded bg-zinc-200" />
              <div className="text-[5px] font-bold" style={{ color: primary }}>HK$8.8M</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Hotel({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <div className="relative py-5" style={{ backgroundColor: primary }}>
        <div className="px-3">
          <div className="h-1.5 w-2/3 rounded bg-white/50" />
          <div className="mt-1 h-1 w-1/3 rounded bg-white/25" />
        </div>
        <div className="absolute bottom-2 right-2 rounded px-2 py-0.5 text-[5px] text-white" style={{ backgroundColor: accent }}>
          訂房
        </div>
      </div>
      <div style={{ backgroundColor: secondary }} className="grid grid-cols-2 gap-1.5 p-2">
        {["標準房", "海景房"].map((room) => (
          <div key={room} className="overflow-hidden rounded-md bg-white">
            <div className="h-8" style={{ backgroundColor: `${primary}30` }} />
            <div className="p-1">
              <div className="h-0.5 w-2/3 rounded bg-zinc-200" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Wedding({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <div className="py-3 text-center" style={{ backgroundColor: secondary }}>
        <div className="mx-auto h-1 w-1/2 rounded-full" style={{ backgroundColor: `${primary}50` }} />
        <div className="mx-auto mt-2 h-1.5 w-2/3 rounded" style={{ backgroundColor: primary, opacity: 0.4 }} />
      </div>
      <div style={{ backgroundColor: secondary }} className="p-2">
        <div className="grid grid-cols-3 gap-1">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-full"
              style={{ backgroundColor: i % 2 === 0 ? `${primary}${i === 0 ? "60" : "25"}` : `${accent}20` }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function Tech({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <div className="px-3 py-2" style={{ backgroundColor: secondary }}>
        <div className="flex items-center justify-between">
          <div className="h-2 w-6 rounded" style={{ backgroundColor: primary }} />
          {!isMobile && (
            <div className="rounded-full px-2 py-0.5 text-[5px] text-white" style={{ backgroundColor: primary }}>
              免費試用
            </div>
          )}
        </div>
      </div>
      <div style={{ backgroundColor: secondary }} className="p-2">
        <div className="mb-2 text-center">
          <div className="mx-auto h-2 w-3/4 rounded bg-gradient-to-r from-indigo-400/40 to-purple-400/40" />
          <div className="mx-auto mt-1 h-1 w-1/2 rounded bg-white/10" />
        </div>
        <div className={`grid gap-1 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-white/10 p-1.5">
              <div className="mb-1 h-3 w-3 rounded" style={{ backgroundColor: primary, opacity: 0.7 }} />
              <div className="h-0.5 w-full rounded bg-white/15" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Ngo({ primary, secondary, accent, isMobile }: VariantProps) {
  return (
    <>
      <Chrome bg={primary} isMobile={isMobile} dark />
      <div style={{ backgroundColor: secondary }} className="p-2">
        <div className="mb-2 rounded-lg p-2 text-center" style={{ backgroundColor: `${primary}15` }}>
          <div className="mx-auto h-1.5 w-2/3 rounded" style={{ backgroundColor: primary, opacity: 0.5 }} />
          <div
            className="mx-auto mt-2 w-fit rounded-full px-3 py-1 text-[6px] font-medium text-white"
            style={{ backgroundColor: primary }}
          >
            立即捐款
          </div>
        </div>
        <div className="flex justify-around">
          {[["128", "人"], ["45", "活動"], ["12", "年"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-[8px] font-bold" style={{ color: primary }}>{num}</div>
              <div className="text-[5px] opacity-50">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const VARIANTS: Record<PreviewVariant, ComponentType<VariantProps>> = {
  restaurant: Restaurant,
  ecommerce: Ecommerce,
  corporate: Corporate,
  portfolio: Portfolio,
  medical: Medical,
  education: Education,
  beauty: Beauty,
  fitness: Fitness,
  property: Property,
  hotel: Hotel,
  wedding: Wedding,
  tech: Tech,
  ngo: Ngo,
};

export default function TemplateCatalogPreview({
  variant,
  primary,
  secondary,
  accent,
  isMobile,
}: VariantProps & { variant: PreviewVariant }) {
  const Component = VARIANTS[variant] ?? Corporate;
  return <Component primary={primary} secondary={secondary} accent={accent} isMobile={isMobile} />;
}

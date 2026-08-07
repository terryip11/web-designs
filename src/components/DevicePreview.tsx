"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Menu, Play, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Template } from "@/types";
import { getAnimationTierById, getHeroTypeById } from "@/lib/design-options";
import { getPreviewVariant } from "@/lib/template-preview-variants";
import TemplateCatalogPreview from "./TemplateCatalogPreview";

interface DevicePreviewProps {
  template: Template;
  device?: "desktop" | "mobile";
  className?: string;
  layoutId?: string;
  navigationIds?: string[];
  animationTierId?: string;
  heroTypeId?: string;
  showAnimationDemo?: boolean;
  catalogMode?: boolean;
}

function NavBar({
  primary,
  secondary,
  isMobile,
  navigationIds = [],
  transparent,
}: {
  primary: string;
  secondary: string;
  isMobile: boolean;
  navigationIds?: string[];
  transparent?: boolean;
}) {
  const hasMega = navigationIds.includes("mega-menu");
  const hasHamburger = isMobile || navigationIds.includes("hamburger-mobile");
  const hasBreadcrumb = navigationIds.includes("breadcrumb");
  const hasSearch = navigationIds.includes("search-nav");
  const hasLang = navigationIds.includes("language-switcher");

  return (
    <div>
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{
          backgroundColor: transparent ? `${primary}99` : primary,
        }}
      >
        {!isMobile && (
          <>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-white/30" />
              ))}
            </div>
            <div className="ml-1 flex flex-1 gap-2">
              {["首頁", "關於", "服務", "聯絡"].map((item) => (
                <div
                  key={item}
                  className="rounded px-1.5 py-0.5 text-[8px] text-white/60"
                >
                  {item}
                </div>
              ))}
            </div>
            {hasSearch && (
              <div className="rounded-full bg-white/15 px-2 py-0.5 text-[6px] text-white/50">
                🔍 搜尋
              </div>
            )}
            {hasLang && (
              <div className="flex gap-0.5 text-[6px] text-white/70">
                <span className="rounded bg-white/25 px-1">中</span>
                <span className="px-1">EN</span>
              </div>
            )}
          </>
        )}
        {hasHamburger && isMobile && (
          <Menu className="h-3 w-3 text-white/70" />
        )}
        {isMobile && (
          <div className="mx-auto h-1 w-6 rounded-full bg-white/30" />
        )}
      </div>
      {hasMega && !isMobile && (
        <div
          className="flex gap-2 px-4 py-1.5"
          style={{ backgroundColor: secondary }}
        >
          {["分類 A", "分類 B", "分類 C"].map((c) => (
            <div
              key={c}
              className="rounded bg-black/5 px-2 py-0.5 text-[7px] opacity-60"
            >
              {c}
            </div>
          ))}
        </div>
      )}
      {hasBreadcrumb && (
        <div className="px-3 py-1 text-[7px] opacity-40">
          首頁 / 服務 / 詳情
        </div>
      )}
    </div>
  );
}

function HeroBlock({
  primary,
  accent,
  secondary,
  heroTypeId = "full-width-image",
  layoutId,
  isMobile,
}: {
  primary: string;
  accent: string;
  secondary: string;
  heroTypeId?: string;
  layoutId?: string;
  isMobile?: boolean;
}) {
  const heroMeta = getHeroTypeById(heroTypeId);
  const label = heroMeta?.name ?? "Hero";

  const badge = (
    <span className="absolute right-2 top-2 z-10 rounded-full bg-black/50 px-1.5 py-0.5 text-[7px] font-medium text-white backdrop-blur-sm">
      {label}
    </span>
  );

  if (heroTypeId === "minimal-text") {
    return (
      <div className="relative px-4 py-8" style={{ backgroundColor: secondary }}>
        {badge}
        <div className="space-y-2 text-center">
          <div className="mx-auto h-2.5 w-4/5 rounded-md bg-black/20" />
          <div className="mx-auto h-2 w-3/5 rounded-md bg-black/12" />
          <div className="mx-auto mt-3 h-1 w-2/5 rounded bg-black/8" />
        </div>
        <p className="mt-3 text-center text-[6px] text-black/30">純文字 · 無背景圖</p>
      </div>
    );
  }

  if (heroTypeId === "split-hero" || layoutId === "split-screen") {
    return (
      <div className="relative flex min-h-[72px]" style={{ backgroundColor: secondary }}>
        {badge}
        <div className="flex w-1/2 flex-col justify-center gap-1.5 p-3">
          <div className="h-2 w-full rounded bg-black/18" />
          <div className="h-1.5 w-3/4 rounded bg-black/10" />
          <div
            className="mt-1 w-fit rounded px-2 py-0.5 text-[7px] font-medium text-white"
            style={{ backgroundColor: accent }}
          >
            立即了解
          </div>
        </div>
        <div
          className="relative flex w-1/2 items-center justify-center"
          style={{ backgroundColor: primary }}
        >
          <ImageIcon className="h-5 w-5 text-white/35" />
        </div>
      </div>
    );
  }

  if (heroTypeId === "carousel-slider") {
    return (
      <div className="relative overflow-hidden" style={{ backgroundColor: primary }}>
        {badge}
        <div className="flex items-center gap-1 px-1 py-4">
          <ChevronLeft className="h-3 w-3 shrink-0 text-white/40" />
          <div className="flex flex-1 gap-1 overflow-hidden">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{
                  opacity: i === 0 ? 1 : 0.45,
                  scale: i === 0 ? 1 : 0.92,
                  x: 0,
                }}
                transition={{ delay: i * 0.05 }}
                className="min-w-[45%] flex-1 rounded-md bg-white/15 p-2"
              >
                <div className="mb-1 h-1 w-2/3 rounded bg-white/40" />
                <div className="h-6 rounded-sm bg-white/10" />
              </motion.div>
            ))}
          </div>
          <ChevronRight className="h-3 w-3 shrink-0 text-white/40" />
        </div>
        <div className="flex justify-center gap-1.5 pb-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`rounded-full ${i === 0 ? "h-1.5 w-1.5 bg-white" : "h-1 w-1 bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (heroTypeId === "video-background") {
    return (
      <div
        className="relative flex min-h-[80px] flex-col items-center justify-center"
        style={{
          backgroundColor: primary,
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.03) 8px, rgba(255,255,255,0.03) 9px)`,
        }}
      >
        {badge}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/40 bg-white/15"
        >
          <Play className="h-4 w-4 fill-white/70 text-white/70" />
        </motion.div>
        <p className="mt-2 text-[6px] text-white/50">▶ 自動播放影片背景</p>
        <div className="absolute bottom-2 left-3 right-3">
          <div className="h-1 w-1/2 rounded bg-white/25" />
        </div>
      </div>
    );
  }

  if (heroTypeId === "parallax-hero") {
    return (
      <div className="relative min-h-[88px] overflow-hidden" style={{ backgroundColor: primary }}>
        {badge}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 120%, ${accent} 0%, transparent 70%)`,
          }}
        />
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="relative z-[1] flex flex-col items-center justify-center py-6"
        >
          <div className="h-2 w-2/3 rounded bg-white/45" />
          <div className="mt-1.5 h-1 w-1/2 rounded bg-white/25" />
          <p className="mt-2 text-[6px] text-white/40">↕ 視差捲動層次</p>
        </motion.div>
      </div>
    );
  }

  if (heroTypeId === "gradient-animated") {
    return (
      <motion.div
        animate={{
          background: [
            `linear-gradient(135deg, ${primary}, ${accent})`,
            `linear-gradient(135deg, ${accent}, ${primary})`,
            `linear-gradient(135deg, ${primary}, ${accent})`,
          ],
        }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="relative flex min-h-[80px] flex-col items-center justify-center p-4"
      >
        {badge}
        <div className="h-2.5 w-3/4 rounded bg-white/50" />
        <div className="mt-1.5 h-1.5 w-1/2 rounded bg-white/30" />
        <p className="mt-2 text-[6px] text-white/50">動態漸層背景</p>
      </motion.div>
    );
  }

  if (heroTypeId === "hero-with-form") {
    return (
      <div
        className="relative flex min-h-[88px] flex-col items-center justify-center gap-2 p-3"
        style={{ backgroundColor: primary }}
      >
        {badge}
        <div className="h-1.5 w-2/3 rounded bg-white/40" />
        <div className="flex w-full max-w-[90%] gap-1">
          <div className="h-5 flex-1 rounded-md bg-white/90 px-1 text-[6px] leading-5 text-black/30">
            電郵地址
          </div>
          <div
            className="rounded-md px-2 text-[6px] font-medium leading-5 text-white"
            style={{ backgroundColor: accent }}
          >
            提交
          </div>
        </div>
      </div>
    );
  }

  if (heroTypeId === "stats-counter") {
    return (
      <div className="relative py-4" style={{ backgroundColor: primary }}>
        {badge}
        <div className="mb-2 px-3">
          <div className="h-1.5 w-1/2 rounded bg-white/35" />
        </div>
        <div className="flex justify-around px-2">
          {[["500+", "客戶"], ["98%", "滿意"], ["10", "年"]].map(([num, lbl]) => (
            <div key={lbl} className="text-center">
              <div className="text-[10px] font-bold text-white">{num}</div>
              <div className="text-[5px] text-white/50">{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (heroTypeId === "diagonal-split") {
    return (
      <div className="relative min-h-[80px] overflow-hidden" style={{ backgroundColor: secondary }}>
        {badge}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: primary,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 60%)",
          }}
        />
        <div className="relative z-[1] flex h-full min-h-[80px]">
          <div className="flex w-1/2 flex-col justify-center p-3">
            <div className="h-2 w-4/5 rounded bg-white/40" />
            <div className="mt-1 h-1 w-1/2 rounded bg-white/25" />
          </div>
          <div className="flex w-1/2 items-end justify-end p-3">
            <div className="h-10 w-10 rounded-lg bg-black/10" />
          </div>
        </div>
      </div>
    );
  }

  if (heroTypeId === "fullscreen-cta") {
    return (
      <div
        className="relative flex min-h-[90px] flex-col items-center justify-center gap-2"
        style={{ backgroundColor: primary }}
      >
        {badge}
        <div className="h-2 w-1/2 rounded bg-white/30" />
        <div
          className="rounded-full px-4 py-1.5 text-[8px] font-bold text-white shadow-lg"
          style={{ backgroundColor: accent }}
        >
          立即開始 →
        </div>
      </div>
    );
  }

  // full-width-image — 全幅大圖 Hero
  return (
    <div
      className="relative flex min-h-[80px] flex-col justify-end p-3"
      style={{
        backgroundColor: primary,
        backgroundImage: `linear-gradient(to top, ${primary}ee, ${primary}88)`,
      }}
    >
      {badge}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 70% 30%, ${accent}88 0%, transparent 60%)`,
        }}
      />
      <ImageIcon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-white/20" />
      <div className="relative z-[1]">
        <div className="mb-1.5 h-2.5 w-2/3 rounded bg-white/50" />
        <div className="h-1.5 w-1/2 rounded bg-white/30" />
        {!isMobile && (
          <div
            className="mt-2 w-fit rounded px-2.5 py-1 text-[7px] font-medium text-white"
            style={{ backgroundColor: accent }}
          >
            了解更多
          </div>
        )}
      </div>
    </div>
  );
}

function ContentArea({
  layoutId = "single-column",
  accent,
  secondary,
  animate,
  tierEffects = [],
}: {
  layoutId?: string;
  accent: string;
  secondary: string;
  animate: boolean;
  tierEffects?: string[];
}) {
  const motionProps = animate
    ? {
        initial: tierEffects.includes("slide-in")
          ? { opacity: 0, x: -20 }
          : { opacity: 0, y: 16 },
        animate: { opacity: 1, x: 0, y: 0 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {};

  if (layoutId === "two-column") {
    return (
      <div className="flex gap-2 p-2" style={{ backgroundColor: secondary }}>
        <div className="w-1/4 space-y-1.5 rounded bg-black/5 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1 w-full rounded bg-black/10" />
          ))}
        </div>
        <motion.div {...motionProps} className="flex-1 space-y-2 p-1">
          <div className="h-1.5 w-full rounded bg-black/10" />
          <div className="h-1.5 w-4/5 rounded bg-black/10" />
          <div
            className="h-8 rounded"
            style={{ backgroundColor: accent, opacity: 0.2 }}
          />
        </motion.div>
      </div>
    );
  }

  if (layoutId === "three-column-grid") {
    return (
      <div className="grid grid-cols-3 gap-1.5 p-2" style={{ backgroundColor: secondary }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            {...(animate
              ? {
                  initial: { opacity: 0, y: 12 },
                  animate: { opacity: 1, y: 0 },
                  transition: {
                    delay: tierEffects.includes("stagger") ? i * 0.08 : 0,
                    duration: 0.4,
                  },
                }
              : {})}
            className="aspect-square rounded-md"
            style={{ backgroundColor: accent, opacity: 0.12 + (i % 3) * 0.05 }}
          />
        ))}
      </div>
    );
  }

  if (layoutId === "magazine") {
    return (
      <div className="grid grid-cols-2 gap-1.5 p-2" style={{ backgroundColor: secondary }}>
        <motion.div
          {...motionProps}
          className="col-span-1 row-span-2 rounded-md"
          style={{ backgroundColor: accent, opacity: 0.2, minHeight: 48 }}
        />
        <div className="rounded-md bg-black/5 p-2">
          <div className="h-1 w-full rounded bg-black/10" />
        </div>
        <div className="rounded-md bg-black/5 p-2">
          <div className="h-1 w-3/4 rounded bg-black/10" />
        </div>
      </div>
    );
  }

  if (layoutId === "asymmetric") {
    return (
      <div className="flex gap-1.5 p-2" style={{ backgroundColor: secondary }}>
        <motion.div
          {...motionProps}
          className="w-[62%] space-y-1.5 rounded-md bg-black/5 p-2"
        >
          <div className="h-1.5 w-full rounded bg-black/10" />
          <div className="h-1.5 w-4/5 rounded bg-black/10" />
        </motion.div>
        <div
          className="w-[38%] rounded-md"
          style={{ backgroundColor: accent, opacity: 0.18 }}
        />
      </div>
    );
  }

  if (layoutId === "sidebar-left") {
    return (
      <div className="flex min-h-[48px]" style={{ backgroundColor: secondary }}>
        <div
          className="w-1/4 space-y-1.5 border-r border-black/5 p-2"
          style={{ backgroundColor: `${accent}12` }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1 rounded"
              style={{ backgroundColor: accent, opacity: i === 0 ? 0.5 : 0.15, width: `${100 - i * 15}%` }}
            />
          ))}
        </div>
        <motion.div {...motionProps} className="flex-1 space-y-1.5 p-2">
          <div className="h-1.5 w-full rounded bg-black/10" />
          <div className="h-1.5 w-4/5 rounded bg-black/8" />
          <div className="h-6 rounded-md bg-black/5" />
        </motion.div>
      </div>
    );
  }

  if (layoutId === "card-masonry") {
    return (
      <div className="columns-2 gap-1.5 space-y-1.5 p-2" style={{ backgroundColor: secondary }}>
        {[32, 48, 28, 40, 24].map((h, i) => (
          <motion.div
            key={i}
            {...(animate ? { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06 } } : {})}
            className="mb-1 break-inside-avoid rounded-md"
            style={{ height: h, backgroundColor: accent, opacity: 0.12 + (i % 3) * 0.06 }}
          />
        ))}
      </div>
    );
  }

  // single-column, full-hero, default
  return (
    <div className="space-y-2 p-3" style={{ backgroundColor: secondary }}>
      <motion.div {...motionProps} className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-md"
            style={{ backgroundColor: accent, opacity: 0.15 + i * 0.1 }}
          />
        ))}
      </motion.div>
      <div className="space-y-1.5">
        <div className="h-1.5 w-full rounded bg-zinc-400/20" />
        <div className="h-1.5 w-4/5 rounded bg-zinc-400/15" />
      </div>
    </div>
  );
}

export default function DevicePreview({
  template,
  device = "desktop",
  className = "",
  layoutId = "single-column",
  navigationIds = ["sticky-top", "hamburger-mobile"],
  animationTierId = "standard",
  heroTypeId = "full-width-image",
  showAnimationDemo = false,
  catalogMode = false,
}: DevicePreviewProps) {
  const [demoKey, setDemoKey] = useState(0);
  const [primary, secondary, accent] = template.colors;
  const isMobile = device === "mobile";
  const tier = getAnimationTierById(animationTierId);
  const tierEffects = tier?.effects ?? [];
  const transparent = navigationIds.includes("transparent-nav");
  const hasBottomTab = navigationIds.includes("bottom-tab") && isMobile;
  const hasFloatingAction = navigationIds.includes("floating-action");

  useEffect(() => {
    if (showAnimationDemo) setDemoKey((k) => k + 1);
  }, [showAnimationDemo, animationTierId, layoutId, heroTypeId]);

  // Hero 切換時也觸發重繪動畫
  useEffect(() => {
    setDemoKey((k) => k + 1);
  }, [heroTypeId]);

  const animate = showAnimationDemo || animationTierId !== "standard";
  const previewVariant = getPreviewVariant(template.id);

  if (catalogMode) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900 shadow-2xl ${className}`}
        style={{ aspectRatio: isMobile ? "9/16" : "16/10" }}
      >
        <TemplateCatalogPreview
          variant={previewVariant}
          primary={primary}
          secondary={secondary}
          accent={accent}
          isMobile={isMobile}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900 shadow-2xl ${className}`}
      style={{ aspectRatio: isMobile ? "9/16" : "16/10" }}
    >
      <NavBar
        primary={primary}
        secondary={secondary}
        isMobile={isMobile}
        navigationIds={navigationIds}
        transparent={transparent}
      />

      <div key={`${demoKey}-${heroTypeId}`} className="flex flex-col">
        <HeroBlock
          primary={primary}
          accent={accent}
          secondary={secondary}
          heroTypeId={heroTypeId}
          layoutId={layoutId}
          isMobile={isMobile}
        />

        <ContentArea
          layoutId={layoutId}
          accent={accent}
          secondary={secondary}
          animate={animate}
          tierEffects={tierEffects}
        />

        {!isMobile && (
          <div
            className="mt-auto self-start m-3 rounded-md px-3 py-1 text-[9px] font-medium text-white"
            style={{ backgroundColor: accent }}
          >
            CTA
          </div>
        )}
      </div>

      {hasBottomTab && (
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-around py-2"
          style={{ backgroundColor: primary }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-2 w-2 rounded-sm bg-white/30" />
          ))}
        </div>
      )}

      {hasFloatingAction && (
        <div
          className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-[8px] text-white shadow-lg"
          style={{ backgroundColor: accent }}
        >
          💬
        </div>
      )}

      {tierEffects.includes("parallax") && animate && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-violet-500/5 to-transparent" />
      )}
    </div>
  );
}

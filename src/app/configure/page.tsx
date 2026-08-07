"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Columns3, Monitor, Navigation, Zap } from "lucide-react";
import DesignOptionCheckbox from "@/components/DesignOptionCheckbox";
import DesignOptionRadio from "@/components/DesignOptionRadio";
import FeatureCheckbox from "@/components/FeatureCheckbox";
import LivePreviewPanel from "@/components/LivePreviewPanel";
import OrderSummary from "@/components/OrderSummary";
import DesignFlowBanner from "@/components/DesignFlowBanner";
import { useSketchDesignSuggestions } from "@/components/SketchDesignSuggestions";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getCompatibleFeatures, templates } from "@/lib/data";
import {
  animationTiers,
  getAnimationTierTooltipLines,
  heroTypes,
  layouts,
  navigationOptions,
} from "@/lib/design-options";
import { useConfiguratorStore } from "@/store/configurator-store";

function ConfigureContent() {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template");
  const [showAnimDemo, setShowAnimDemo] = useState(false);

  const selectedTemplateId = useConfiguratorStore((s) => s.selectedTemplateId);
  const selectedFeatureIds = useConfiguratorStore((s) => s.selectedFeatureIds);
  const designSelections = useConfiguratorStore((s) => s.designSelections);
  const setTemplate = useConfiguratorStore((s) => s.setTemplate);
  const toggleFeature = useConfiguratorStore((s) => s.toggleFeature);
  const setLayout = useConfiguratorStore((s) => s.setLayout);
  const toggleNavigation = useConfiguratorStore((s) => s.toggleNavigation);
  const setAnimationTier = useConfiguratorStore((s) => s.setAnimationTier);
  const setHeroType = useConfiguratorStore((s) => s.setHeroType);
  const reset = useConfiguratorStore((s) => s.reset);
  const getTemplate = useConfiguratorStore((s) => s.getTemplate);
  const getTotalPrice = useConfiguratorStore((s) => s.getTotalPrice);

  useEffect(() => {
    if (templateParam && templateParam !== selectedTemplateId) {
      setTemplate(templateParam);
    }
  }, [templateParam, selectedTemplateId, setTemplate]);

  const template = getTemplate();
  const totalPrice = getTotalPrice();
  const compatibleFeatures = template ? getCompatibleFeatures(template) : [];

  const featuresByCategory = compatibleFeatures.reduce<
    Record<string, typeof compatibleFeatures>
  >((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {});

  function triggerAnimDemo() {
    setShowAnimDemo(false);
    requestAnimationFrame(() => setShowAnimDemo(true));
  }

  const { suggestedIds, banner: sketchSuggestBanner } =
    useSketchDesignSuggestions(triggerAnimDemo);

  function handleLayoutSelect(layoutId: string) {
    setLayout(layoutId);
    triggerAnimDemo();
  }

  function handleHeroSelect(heroId: string) {
    setHeroType(heroId);
    triggerAnimDemo();
  }

  function handleNavigationToggle(navId: string) {
    toggleNavigation(navId);
    triggerAnimDemo();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <RevealOnScroll>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">方案選配</h1>
          <p className="mt-2 text-zinc-500">
            左側選擇選項，右側即時預覽效果 — 價格參考香港市場行情（HKD）
          </p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.03}>
        <DesignFlowBanner current="configure" />
      </RevealOnScroll>

      {sketchSuggestBanner}

      {!template && (
        <RevealOnScroll delay={0.1}>
          <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
            <p className="text-amber-300">
              請先選擇一款介面。{" "}
              <Link href="/templates" className="underline hover:text-amber-200">
                前往介面庫
              </Link>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:border-violet-500 hover:text-white"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      )}

      {template && (
        <div className="sticky top-16 z-30 mb-6 lg:hidden">
          <LivePreviewPanel
            template={template}
            designSelections={designSelections}
            showAnimationDemo={showAnimDemo}
            onTriggerAnimation={triggerAnimDemo}
            compact
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        {/* 左：所有選項 */}
        <div className="space-y-8 lg:col-span-3">
          {template && (
            <>
              <section>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Columns3 className="h-5 w-5 text-violet-400" />
                    <h2 className="font-semibold text-white">版面配置</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="text-xs text-zinc-500 hover:text-zinc-300"
                  >
                    更換介面
                  </button>
                </div>
                <p className="mb-4 text-xs text-zinc-500">
                  點選後右側預覽即時更新
                </p>
                <div className="space-y-3">
                  {layouts.map((layout) => (
                    <DesignOptionRadio
                      key={layout.id}
                      option={layout}
                      groupName="layout"
                      checked={designSelections.layoutId === layout.id}
                      suggested={suggestedIds.has(layout.id)}
                      onSelect={() => handleLayoutSelect(layout.id)}
                    />
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-violet-400" />
                  <h2 className="font-semibold text-white">導航設計</h2>
                  <span className="text-xs text-zinc-500">（可多選）</span>
                </div>
                <div className="space-y-3">
                  {navigationOptions.map((nav) => (
                    <DesignOptionCheckbox
                      key={nav.id}
                      option={nav}
                      checked={designSelections.navigationIds.includes(nav.id)}
                      suggested={suggestedIds.has(nav.id)}
                      disabled={nav.included === true}
                      onToggle={() => handleNavigationToggle(nav.id)}
                    />
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-violet-400" />
                  <h2 className="font-semibold text-white">動效等級</h2>
                </div>
                <p className="mb-4 text-xs text-zinc-500">
                  滑鼠移入各選項旁的 ℹ️ 可查看詳細效果說明
                </p>
                <div className="space-y-3">
                  {animationTiers.map((tier) => (
                    <DesignOptionRadio
                      key={tier.id}
                      option={tier}
                      groupName="animation"
                      checked={designSelections.animationTierId === tier.id}
                      suggested={suggestedIds.has(tier.id)}
                      detailTooltip={getAnimationTierTooltipLines(tier)}
                      onSelect={() => {
                        setAnimationTier(tier.id);
                        triggerAnimDemo();
                      }}
                    />
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-violet-400" />
                  <h2 className="font-semibold text-white">Hero 區塊</h2>
                </div>
                <div className="space-y-3">
                  {heroTypes.map((hero) => (
                    <DesignOptionRadio
                      key={hero.id}
                      option={hero}
                      groupName="hero"
                      checked={designSelections.heroTypeId === hero.id}
                      suggested={suggestedIds.has(hero.id)}
                      onSelect={() => handleHeroSelect(hero.id)}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-4 font-semibold text-white">功能模組</h2>
                <div className="space-y-6">
                  {Object.entries(featuresByCategory).map(([category, feats]) => (
                    <div key={category}>
                      <h3 className="mb-3 text-sm font-medium text-zinc-500">
                        {category}
                      </h3>
                      <div className="space-y-3">
                        {feats.map((f) => (
                          <FeatureCheckbox
                            key={f.id}
                            feature={f}
                            checked={selectedFeatureIds.includes(f.id)}
                            suggested={suggestedIds.has(f.id)}
                            disabled={f.included === true}
                            onToggle={() => toggleFeature(f.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* 右：固定即時預覽 + 摘要 */}
        {template && (
          <div className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-20 space-y-4">
              <LivePreviewPanel
                template={template}
                designSelections={designSelections}
                showAnimationDemo={showAnimDemo}
                onTriggerAnimation={triggerAnimDemo}
              />
              <OrderSummary
                template={template}
                selectedFeatureIds={selectedFeatureIds}
                totalPrice={totalPrice}
              />
            </div>
          </div>
        )}

        {/* 手機版摘要放底部 */}
        {template && (
          <div className="lg:hidden">
            <OrderSummary
              template={template}
              selectedFeatureIds={selectedFeatureIds}
              totalPrice={totalPrice}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-500">載入中…</div>}>
      <ConfigureContent />
    </Suspense>
  );
}

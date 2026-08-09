"use client";

import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { useConfiguratorStore } from "@/store/configurator-store";
import { buildConfigureShareUrl } from "@/lib/template-meta";

export default function ShareConfigButton() {
  const exportConfiguration = useConfiguratorStore((s) => s.exportConfiguration);
  const templateId = useConfiguratorStore((s) => s.selectedTemplateId);
  const [copied, setCopied] = useState(false);

  async function copyShareLink() {
    if (!templateId) return;
    const config = exportConfiguration();
    if (!config.selectedTemplateId) return;

    const url = buildConfigureShareUrl(window.location.origin, {
      selectedTemplateId: config.selectedTemplateId,
      selectedFeatureIds: config.selectedFeatureIds,
      designSelections: config.designSelections,
    });

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!templateId) return null;

  return (
    <button
      type="button"
      onClick={copyShareLink}
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-400" />
      ) : (
        <Link2 className="h-4 w-4" />
      )}
      {copied ? "已複製連結" : "分享方案連結"}
    </button>
  );
}

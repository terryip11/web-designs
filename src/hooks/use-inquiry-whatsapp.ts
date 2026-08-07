"use client";

import { useMemo } from "react";
import { useConfiguratorStore } from "@/store/configurator-store";
import { getFeatureById } from "@/lib/data";
import { CURRENCY_CODE } from "@/lib/currency";
import { getDesignSelectionLabels } from "@/lib/design-options";
import {
  buildInquiryWhatsAppMessage,
  type InquirySummaryInput,
} from "@/lib/inquiry-summary";
import { getWhatsAppUrl } from "@/lib/site-contact";
import { useSketchStore } from "@/store/sketch-store";

export function useInquirySummaryInput(
  extra?: Pick<InquirySummaryInput, "customerName" | "customerMessage">
): InquirySummaryInput {
  const template = useConfiguratorStore((s) => s.getTemplate());
  const selectedFeatureIds = useConfiguratorStore((s) => s.selectedFeatureIds);
  const designSelections = useConfiguratorStore((s) => s.designSelections);
  const totalPrice = useConfiguratorStore((s) => s.getTotalPrice());
  const sketchTitle = useSketchStore((s) => s.title);
  const pages = useSketchStore((s) => s.pages);
  const hasSketch = useSketchStore((s) => s.hasSketch());

  return useMemo(
    () => ({
      templateName: template?.name,
      templateCategory: template?.category,
      designSelectionLabels: getDesignSelectionLabels(designSelections),
      selectedFeatures: selectedFeatureIds.map(
        (id) => getFeatureById(id)?.name ?? id
      ),
      totalPrice,
      currency: CURRENCY_CODE,
      sketchTitle: hasSketch ? sketchTitle : undefined,
      sketchPageCount: hasSketch
        ? pages.filter((p) => p.elements.length > 0).length
        : undefined,
      customerName: extra?.customerName,
      customerMessage: extra?.customerMessage,
    }),
    [
      template,
      selectedFeatureIds,
      designSelections,
      totalPrice,
      sketchTitle,
      pages,
      hasSketch,
      extra?.customerName,
      extra?.customerMessage,
    ]
  );
}

export function useWhatsAppInquiryUrl(
  extra?: Pick<InquirySummaryInput, "customerName" | "customerMessage">
): string {
  const input = useInquirySummaryInput(extra);
  return useMemo(
    () => getWhatsAppUrl(buildInquiryWhatsAppMessage(input)),
    [input]
  );
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DesignSelections, Template } from "@/types";
import {
  calculateTotalPrice,
  getCompatibleFeatures,
  getTemplateById,
} from "@/lib/data";
import {
  getDefaultDesignSelections,
  getNavigationById,
} from "@/lib/design-options";
import { getRecommendedFeaturesForTemplate } from "@/lib/template-meta";

interface ConfiguratorState {
  selectedTemplateId: string | null;
  selectedFeatureIds: string[];
  designSelections: DesignSelections;
  setTemplate: (templateId: string) => void;
  toggleFeature: (featureId: string) => void;
  setFeatures: (featureIds: string[]) => void;
  setLayout: (layoutId: string) => void;
  toggleNavigation: (navId: string) => void;
  setAnimationTier: (tierId: string) => void;
  setHeroType: (heroId: string) => void;
  reset: () => void;
  loadConfiguration: (data: {
    selectedTemplateId: string | null;
    selectedFeatureIds: string[];
    designSelections: DesignSelections;
  }) => void;
  exportConfiguration: () => {
    selectedTemplateId: string | null;
    selectedFeatureIds: string[];
    designSelections: DesignSelections;
  };
  getTemplate: () => Template | undefined;
  getTotalPrice: () => number;
}

function getDefaultFeatures(templateId: string): string[] {
  const template = getTemplateById(templateId);
  if (!template) return [];
  const included = getCompatibleFeatures(template)
    .filter((f) => f.included)
    .map((f) => f.id);
  const recommended = getRecommendedFeaturesForTemplate(template);
  return [...new Set([...included, ...recommended])];
}

const defaultDesign = getDefaultDesignSelections();

export const useConfiguratorStore = create<ConfiguratorState>()(
  persist(
    (set, get) => ({
      selectedTemplateId: null,
      selectedFeatureIds: [],
      designSelections: defaultDesign,

      setTemplate: (templateId) => {
        set({
          selectedTemplateId: templateId,
          selectedFeatureIds: getDefaultFeatures(templateId),
          designSelections: getDefaultDesignSelections(),
        });
      },

      toggleFeature: (featureId) => {
        const { selectedFeatureIds, selectedTemplateId } = get();
        const template = selectedTemplateId
          ? getTemplateById(selectedTemplateId)
          : undefined;
        if (!template?.compatibleFeatures.includes(featureId)) return;

        const isSelected = selectedFeatureIds.includes(featureId);
        const feature = getCompatibleFeatures(template).find(
          (f) => f.id === featureId
        );
        if (feature?.included && isSelected) return;

        set({
          selectedFeatureIds: isSelected
            ? selectedFeatureIds.filter((id) => id !== featureId)
            : [...selectedFeatureIds, featureId],
        });
      },

      setFeatures: (featureIds) => set({ selectedFeatureIds: featureIds }),

      setLayout: (layoutId) =>
        set((s) => ({
          designSelections: { ...s.designSelections, layoutId },
        })),

      toggleNavigation: (navId) => {
        const { designSelections } = get();
        const nav = getNavigationById(navId);
        const isSelected = designSelections.navigationIds.includes(navId);
        if (nav?.included && isSelected) return;

        set({
          designSelections: {
            ...designSelections,
            navigationIds: isSelected
              ? designSelections.navigationIds.filter((id) => id !== navId)
              : [...designSelections.navigationIds, navId],
          },
        });
      },

      setAnimationTier: (animationTierId) =>
        set((s) => ({
          designSelections: { ...s.designSelections, animationTierId },
        })),

      setHeroType: (heroTypeId) =>
        set((s) => ({
          designSelections: { ...s.designSelections, heroTypeId },
        })),

      reset: () =>
        set({
          selectedTemplateId: null,
          selectedFeatureIds: [],
          designSelections: getDefaultDesignSelections(),
        }),

      loadConfiguration: ({ selectedTemplateId, selectedFeatureIds, designSelections }) =>
        set({
          selectedTemplateId,
          selectedFeatureIds,
          designSelections,
        }),

      exportConfiguration: () => {
        const s = get();
        return {
          selectedTemplateId: s.selectedTemplateId,
          selectedFeatureIds: s.selectedFeatureIds,
          designSelections: s.designSelections,
        };
      },

      getTemplate: () => {
        const id = get().selectedTemplateId;
        return id ? getTemplateById(id) : undefined;
      },

      getTotalPrice: () => {
        const template = get().getTemplate();
        if (!template) return 0;
        return calculateTotalPrice(
          template,
          get().selectedFeatureIds,
          get().designSelections
        );
      },
    }),
    { name: "design-configurator" }
  )
);

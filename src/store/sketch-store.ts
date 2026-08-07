import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  LayerMove,
  SketchDevice,
  SketchElement,
  SketchPage,
  SketchState,
} from "@/types/sketch";
import { moveElementLayer } from "@/lib/sketch-layers";
import { buildSketchFromTemplate } from "@/lib/sketch-from-template";
import { getTemplateById } from "@/lib/data";

interface SketchStore extends SketchState {
  setTitle: (title: string) => void;
  setLinkedTemplate: (templateId: string | null) => void;
  setActivePage: (pageId: string) => void;
  addPage: (name?: string, device?: SketchDevice) => string;
  removePage: (pageId: string) => void;
  renamePage: (pageId: string, name: string) => void;
  setPageDevice: (pageId: string, device: SketchDevice) => void;
  setPageElements: (pageId: string, elements: SketchElement[]) => void;
  clearPage: (pageId: string) => void;
  moveLayer: (pageId: string, elementId: string, direction: LayerMove) => void;
  applyTemplateToActivePage: (templateId: string) => boolean;
  getActivePage: () => SketchPage | undefined;
  hasSketch: () => boolean;
  exportSnapshot: () => SketchState;
  importSnapshot: (state: SketchState) => void;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDefaultPage(name = "第 1 頁", device: SketchDevice = "desktop"): SketchPage {
  return { id: uid(), name, device, elements: [] };
}

const defaultPage = createDefaultPage();

const emptyState: SketchState = {
  title: "我的介面草圖",
  activePageId: defaultPage.id,
  pages: [defaultPage],
  updatedAt: null,
  linkedTemplateId: null,
};

type LegacyState = {
  title?: string;
  device?: SketchDevice;
  elements?: SketchElement[];
  updatedAt?: string | null;
};

function touchUpdated(pages: SketchPage[]) {
  return { pages, updatedAt: new Date().toISOString() };
}

export const useSketchStore = create<SketchStore>()(
  persist(
    (set, get) => ({
      ...emptyState,

      setTitle: (title) => set({ title, updatedAt: new Date().toISOString() }),

      setLinkedTemplate: (templateId) => set({ linkedTemplateId: templateId }),

      setActivePage: (pageId) => {
        if (get().pages.some((p) => p.id === pageId)) {
          set({ activePageId: pageId });
        }
      },

      addPage: (name, device = "desktop") => {
        const page = createDefaultPage(
          name ?? `第 ${get().pages.length + 1} 頁`,
          device
        );
        set((s) => ({
          ...touchUpdated([...s.pages, page]),
          activePageId: page.id,
        }));
        return page.id;
      },

      removePage: (pageId) => {
        const { pages, activePageId } = get();
        if (pages.length <= 1) return;
        const next = pages.filter((p) => p.id !== pageId);
        set({
          ...touchUpdated(next),
          activePageId:
            activePageId === pageId ? next[0].id : activePageId,
        });
      },

      renamePage: (pageId, name) => {
        set((s) => ({
          ...touchUpdated(
            s.pages.map((p) => (p.id === pageId ? { ...p, name } : p))
          ),
        }));
      },

      setPageDevice: (pageId, device) => {
        set((s) => ({
          ...touchUpdated(
            s.pages.map((p) => (p.id === pageId ? { ...p, device } : p))
          ),
        }));
      },

      setPageElements: (pageId, elements) => {
        set((s) => ({
          ...touchUpdated(
            s.pages.map((p) => (p.id === pageId ? { ...p, elements } : p))
          ),
        }));
      },

      clearPage: (pageId) => {
        set((s) => ({
          ...touchUpdated(
            s.pages.map((p) =>
              p.id === pageId ? { ...p, elements: [] } : p
            )
          ),
        }));
      },

      moveLayer: (pageId, elementId, direction) => {
        set((s) => ({
          ...touchUpdated(
            s.pages.map((p) =>
              p.id === pageId
                ? {
                    ...p,
                    elements: moveElementLayer(p.elements, elementId, direction),
                  }
                : p
            )
          ),
        }));
      },

      applyTemplateToActivePage: (templateId) => {
        const template = getTemplateById(templateId);
        if (!template) return false;
        const { activePageId, pages } = get();
        const page = pages.find((p) => p.id === activePageId);
        if (!page) return false;
        const elements = buildSketchFromTemplate(template, page.device);
        set((s) => ({
          linkedTemplateId: templateId,
          title: s.title === "我的介面草圖" ? `${template.name} 草圖` : s.title,
          ...touchUpdated(
            s.pages.map((p) =>
              p.id === activePageId ? { ...p, elements, name: template.name } : p
            )
          ),
        }));
        return true;
      },

      getActivePage: () => {
        const { pages, activePageId } = get();
        return pages.find((p) => p.id === activePageId);
      },

      hasSketch: () => get().pages.some((p) => p.elements.length > 0),

      exportSnapshot: () => {
        const { title, activePageId, pages, updatedAt, linkedTemplateId } = get();
        return { title, activePageId, pages, updatedAt, linkedTemplateId };
      },

      importSnapshot: (state) =>
        set({
          title: state.title,
          activePageId: state.activePageId,
          pages: state.pages,
          updatedAt: state.updatedAt,
          linkedTemplateId: state.linkedTemplateId,
        }),
    }),
    {
      name: "design-sketch",
      version: 1,
      migrate: (persisted: unknown) => {
        const state = persisted as LegacyState & Partial<SketchState>;
        if (state.pages && state.activePageId) return state as SketchState;

        const page = createDefaultPage("第 1 頁", state.device ?? "desktop");
        page.elements = state.elements ?? [];
        return {
          title: state.title ?? "我的介面草圖",
          activePageId: page.id,
          pages: [page],
          updatedAt: state.updatedAt ?? null,
          linkedTemplateId: null,
        };
      },
    }
  )
);

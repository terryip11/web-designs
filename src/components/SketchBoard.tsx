"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ChevronsDown,
  ChevronsUp,
  Copy,
  Download,
  Eraser,
  ClipboardPaste,
  Grid3x3,
  LayoutTemplate,
  Monitor,
  MousePointer2,
  PenLine,
  Plus,
  Redo2,
  Smartphone,
  Sparkles,
  Play,
  Trash2,
  Type,
  Undo2,
  X,
} from "lucide-react";
import type {
  AlignmentGuide,
  LayerMove,
  SketchBlock,
  SketchBlockType,
  SketchDevice,
  SketchElement,
  SketchAnimation,
  SketchTool,
} from "@/types/sketch";
import { dedupeGuides, snapBlockPosition } from "@/lib/sketch-alignment";
import {
  BLOCK_META,
  clampBlock,
  createBlockPlacement,
  getBlockDisplayLabel,
  isTextEditableBlock,
  SKETCH_CANVAS,
  snapToGrid,
} from "@/lib/sketch-blocks";
import {
  cloneElements,
  drawSketchCanvas,
  eraseStrokesAt,
  exportSketchPng,
  findBlockAt,
  findStrokeAt,
  getCursorForResizeHandle,
  hitTestBlock,
  hitTestResizeHandle,
  resizeBlockFromStart,
  type ResizeHandle,
} from "@/lib/sketch-canvas";
import { exportAllSketchPages } from "@/lib/sketch-export";
import {
  ANIMATION_OPTIONS,
  estimatePreviewDuration,
  isHoverLiftBlock,
  STAGGER_MS,
  STAGGER_OPTIONS,
  type StaggerSpeed,
} from "@/lib/sketch-animations";
import SketchAnimationOverlay from "@/components/SketchAnimationOverlay";
import SketchHoverOverlay from "@/components/SketchHoverOverlay";
import SketchAnimationSelect from "@/components/SketchAnimationSelect";
import SketchContextMenu, {
  type ContextMenuItem,
} from "@/components/SketchContextMenu";
import {
  cloneElementWithNewId,
  QUICK_ANIMATION_PRESETS,
} from "@/lib/sketch-clipboard";
import { getTemplateById } from "@/lib/data";
import { moveElementLayer } from "@/lib/sketch-layers";
import { useSketchStore } from "@/store/sketch-store";

const PEN_COLORS = ["#18181b", "#7c3aed", "#2563eb", "#dc2626"] as const;
const DRAG_MIME = "application/sketch-block";
/** 指標移動超過此距離才開始拖曳，避免點選時因吸附而跳動 */
const DRAG_THRESHOLD = 4;

type SketchContextTarget = {
  x: number;
  y: number;
  canvasX: number;
  canvasY: number;
  kind: "block" | "stroke" | "canvas";
  targetId?: string;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getCanvasPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

function getSelectedBlock(
  elements: SketchElement[],
  selectedId: string | null
): SketchBlock | null {
  if (!selectedId) return null;
  const el = elements.find((e) => e.id === selectedId);
  return el?.type === "block" ? el : null;
}

export default function SketchBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<SketchElement[]>([]);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const prevPageIdRef = useRef<string | null>(null);

  const title = useSketchStore((s) => s.title);
  const pages = useSketchStore((s) => s.pages);
  const activePageId = useSketchStore((s) => s.activePageId);
  const setTitle = useSketchStore((s) => s.setTitle);
  const setActivePage = useSketchStore((s) => s.setActivePage);
  const addPage = useSketchStore((s) => s.addPage);
  const removePage = useSketchStore((s) => s.removePage);
  const renamePage = useSketchStore((s) => s.renamePage);
  const setPageDevice = useSketchStore((s) => s.setPageDevice);
  const setPageElements = useSketchStore((s) => s.setPageElements);
  const clearPage = useSketchStore((s) => s.clearPage);
  const linkedTemplateId = useSketchStore((s) => s.linkedTemplateId);

  const activePage = pages.find((p) => p.id === activePageId) ?? pages[0];
  const device = activePage?.device ?? "desktop";
  const linkedTemplate = linkedTemplateId
    ? getTemplateById(linkedTemplateId)
    : undefined;

  const [elements, setElementsState] = useState<SketchElement[]>(() =>
    cloneElements(activePage?.elements ?? [])
  );
  const [tool, setTool] = useState<SketchTool>("select");
  const [activeBlock, setActiveBlock] = useState<SketchBlockType>("hero");
  const [penColor, setPenColor] = useState<string>(PEN_COLORS[0]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [snapGrid, setSnapGrid] = useState(true);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(null);
  const [dragBlockType, setDragBlockType] = useState<SketchBlockType | null>(null);
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([]);
  const [hoverHandle, setHoverHandle] = useState<ResizeHandle | null>(null);
  const [editingLabel, setEditingLabel] = useState(false);
  const [history, setHistory] = useState<SketchElement[][]>([
    cloneElements(activePage?.elements ?? []),
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [defaultAnimation, setDefaultAnimation] = useState<SketchAnimation>("none");
  const [animPreviewPlaying, setAnimPreviewPlaying] = useState(false);
  const [animPreviewTick, setAnimPreviewTick] = useState(0);
  const [staggerSpeed, setStaggerSpeed] = useState<StaggerSpeed>("medium");
  const [hoverPreviewBlockId, setHoverPreviewBlockId] = useState<string | null>(
    null
  );
  const [contextMenu, setContextMenu] = useState<SketchContextTarget | null>(
    null
  );
  const [hasClipboard, setHasClipboard] = useState(false);
  const clipboardRef = useRef<SketchElement | null>(null);
  const pastePointRef = useRef<{ x: number; y: number }>({
    x: SKETCH_CANVAS.desktop.width / 2,
    y: SKETCH_CANVAS.desktop.height / 2,
  });
  const animPreviewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const pendingDragRef = useRef<{
    startX: number;
    startY: number;
    offset: { x: number; y: number };
  } | null>(null);
  const resizeHandleRef = useRef<ResizeHandle | null>(null);
  const resizeSessionRef = useRef<{
    handle: ResizeHandle;
    startBlock: SketchBlock;
  } | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const currentStrokeRef = useRef<string | null>(null);
  const lastClickRef = useRef<{ id: string; time: number } | null>(null);

  const canvasSize = SKETCH_CANVAS[device];
  const selectedBlock = getSelectedBlock(elements, selectedId);
  const canvasBlocks = useMemo(
    () => elements.filter((el): el is SketchBlock => el.type === "block"),
    [elements]
  );
  const animatedBlockCount = useMemo(
    () => canvasBlocks.filter((b) => b.animation && b.animation !== "none").length,
    [canvasBlocks]
  );

  const staggerMs = STAGGER_MS[staggerSpeed];
  const hoverPreviewBlock = useMemo(
    () =>
      hoverPreviewBlockId
        ? (canvasBlocks.find((b) => b.id === hoverPreviewBlockId) ?? null)
        : null,
    [canvasBlocks, hoverPreviewBlockId]
  );

  elementsRef.current = elements;

  useEffect(() => {
    if (!activePage || prevPageIdRef.current === activePage.id) return;
    const cloned = cloneElements(activePage.elements);
    setElementsState(cloned);
    setHistory([cloned]);
    setHistoryIndex(0);
    setSelectedId(null);
    setEditingLabel(false);
    setAlignmentGuides([]);
    prevPageIdRef.current = activePage.id;
  }, [activePage]);

  const ghostBlockType = dragBlockType ?? (tool === "block" ? activeBlock : null);
  const ghostBlock = useMemo(() => {
    if (!ghostBlockType || !hoverPoint) return null;
    return createBlockPlacement(
      ghostBlockType,
      hoverPoint.x,
      hoverPoint.y,
      canvasSize.width,
      canvasSize.height,
      snapGrid
    );
  }, [ghostBlockType, hoverPoint, canvasSize, snapGrid]);

  const commitElements = useCallback(
    (next: SketchElement[], recordHistory = true) => {
      if (!activePageId) return;
      const cloned = cloneElements(next);
      setElementsState(cloned);
      setPageElements(activePageId, cloned);
      if (recordHistory) {
        setHistory((prev) => {
          const trimmed = prev.slice(0, historyIndex + 1);
          const updated = [...trimmed, cloned].slice(-50);
          setHistoryIndex(updated.length - 1);
          return updated;
        });
      }
    },
    [activePageId, historyIndex, setPageElements]
  );

  const placeBlock = useCallback(
    (blockType: SketchBlockType, point: { x: number; y: number }) => {
      const placement = createBlockPlacement(
        blockType,
        point.x,
        point.y,
        canvasSize.width,
        canvasSize.height,
        snapGrid
      );
      const newId = uid();
      commitElements([
        ...elementsRef.current,
        {
          id: newId,
          type: "block",
          ...placement,
          ...(defaultAnimation !== "none" ? { animation: defaultAnimation } : {}),
        },
      ]);
      setSelectedId(newId);
      setTool("select");
      setEditingLabel(true);
    },
    [canvasSize, snapGrid, commitElements, defaultAnimation]
  );

  const updateSelectedBlock = useCallback(
    (patch: Partial<Pick<SketchBlock, "label" | "x" | "y" | "w" | "h" | "animation">>) => {
      if (!selectedId) return;
      const next = elementsRef.current.map((el) => {
        if (el.type !== "block" || el.id !== selectedId) return el;
        const merged = { ...el, ...patch };
        const clamped = clampBlock(merged, canvasSize.width, canvasSize.height);
        return { ...merged, ...clamped };
      });
      commitElements(next);
    },
    [selectedId, canvasSize, commitElements]
  );

  const deleteElementById = useCallback(
    (id: string) => {
      commitElements(elementsRef.current.filter((el) => el.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setEditingLabel(false);
      }
    },
    [selectedId, commitElements]
  );

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    deleteElementById(selectedId);
  }, [selectedId, deleteElementById]);

  const handleLayerMove = useCallback(
    (direction: LayerMove) => {
      if (!selectedId) return;
      commitElements(
        moveElementLayer(elementsRef.current, selectedId, direction)
      );
    },
    [selectedId, commitElements]
  );

  const moveLayerById = useCallback(
    (id: string, direction: LayerMove) => {
      commitElements(moveElementLayer(elementsRef.current, id, direction));
      setSelectedId(id);
    },
    [commitElements]
  );

  const copyElementById = useCallback((id: string) => {
    const el = elementsRef.current.find((e) => e.id === id);
    if (!el) return;
    clipboardRef.current = cloneElements([el])[0];
    setHasClipboard(true);
  }, []);

  const pasteClipboard = useCallback(
    (at?: { x: number; y: number }) => {
      const source = clipboardRef.current;
      if (!source) return;
      const point = at ?? pastePointRef.current;
      const pasted = cloneElementWithNewId(
        source,
        canvasSize.width,
        canvasSize.height,
        point
      );
      commitElements([...elementsRef.current, pasted]);
      if (pasted.type === "block") {
        setSelectedId(pasted.id);
        setTool("select");
      }
    },
    [canvasSize, commitElements]
  );

  const duplicateElementById = useCallback(
    (id: string) => {
      const el = elementsRef.current.find((e) => e.id === id);
      if (!el) return;
      const duplicated = cloneElementWithNewId(
        el,
        canvasSize.width,
        canvasSize.height
      );
      commitElements([...elementsRef.current, duplicated]);
      if (duplicated.type === "block") {
        setSelectedId(duplicated.id);
        setTool("select");
      }
    },
    [canvasSize, commitElements]
  );

  const setBlockAnimationById = useCallback(
    (id: string, animation: SketchAnimation) => {
      commitElements(
        elementsRef.current.map((el) =>
          el.id === id && el.type === "block" ? { ...el, animation } : el
        )
      );
    },
    [commitElements]
  );

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    const cloned = cloneElements(history[nextIndex]);
    setHistoryIndex(nextIndex);
    setElementsState(cloned);
    setPageElements(activePageId, cloned);
    setSelectedId(null);
    setEditingLabel(false);
  }, [history, historyIndex, activePageId, setPageElements]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    const cloned = cloneElements(history[nextIndex]);
    setHistoryIndex(nextIndex);
    setElementsState(cloned);
    setPageElements(activePageId, cloned);
  }, [history, historyIndex, activePageId, setPageElements]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawSketchCanvas(
      ctx,
      elementsRef.current,
      selectedId,
      canvasSize.width,
      canvasSize.height,
      {
        showGrid: snapGrid,
        ghostBlock,
        alignmentGuides,
        hoverHandle,
        animPreviewPlaying,
        hoverPreviewBlockId:
          !animPreviewPlaying ? hoverPreviewBlockId : null,
      }
    );
  }, [
    selectedId,
    canvasSize,
    snapGrid,
    ghostBlock,
    alignmentGuides,
    hoverHandle,
    animPreviewPlaying,
    hoverPreviewBlockId,
  ]);

  useEffect(() => {
    redraw();
  }, [elements, selectedId, redraw]);

  useEffect(() => {
    const el = canvasViewportRef.current;
    if (!el) return;

    const updateScale = () => {
      const metaRow = 24;
      const padding = 16;
      const availW = el.clientWidth - padding;
      const availH = el.clientHeight - metaRow - padding;
      if (availW <= 0 || availH <= 0) return;
      setCanvasScale(
        Math.min(1, availW / canvasSize.width, availH / canvasSize.height)
      );
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [canvasSize.width, canvasSize.height]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const mod = e.ctrlKey || e.metaKey;

      if (mod && e.key.toLowerCase() === "c" && selectedId) {
        e.preventDefault();
        copyElementById(selectedId);
        return;
      }
      if (mod && e.key.toLowerCase() === "v") {
        e.preventDefault();
        pasteClipboard();
        return;
      }
      if (mod && e.key.toLowerCase() === "d" && selectedId) {
        e.preventDefault();
        duplicateElementById(selectedId);
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        deleteSelected();
        return;
      }

      if (!selectedBlock) return;

      const step = e.shiftKey ? 8 : 1;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        updateSelectedBlock({ x: selectedBlock.x - step });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        updateSelectedBlock({ x: selectedBlock.x + step });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        updateSelectedBlock({ y: selectedBlock.y - step });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        updateSelectedBlock({ y: selectedBlock.y + step });
      } else if (e.key === "Enter") {
        e.preventDefault();
        setEditingLabel(true);
        setTool("select");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    selectedId,
    selectedBlock,
    deleteSelected,
    updateSelectedBlock,
    copyElementById,
    pasteClipboard,
    duplicateElementById,
  ]);

  useEffect(() => {
    if (editingLabel) labelInputRef.current?.focus();
  }, [editingLabel]);

  useEffect(() => {
    return () => {
      if (animPreviewTimerRef.current) clearTimeout(animPreviewTimerRef.current);
    };
  }, []);

  function playAnimationPreview() {
    const blocks = elementsRef.current.filter(
      (el): el is SketchBlock => el.type === "block"
    );
    const duration = estimatePreviewDuration(
      blocks,
      canvasSize.height,
      staggerMs
    );
    if (duration <= 0) return;

    if (animPreviewTimerRef.current) clearTimeout(animPreviewTimerRef.current);
    setHoverPreviewBlockId(null);
    setAnimPreviewTick((t) => t + 1);
    setAnimPreviewPlaying(true);
    animPreviewTimerRef.current = setTimeout(() => {
      setAnimPreviewPlaying(false);
      animPreviewTimerRef.current = null;
    }, duration);
  }

  function handleCanvasPointerDown(clientX: number, clientY: number) {
    setContextMenu(null);
    if (animPreviewPlaying) return;
    startInteraction(clientX, clientY);
  }

  function handleCanvasContextMenu(
    e: React.MouseEvent<HTMLCanvasElement>
  ) {
    e.preventDefault();
    if (animPreviewPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const point = getCanvasPoint(canvas, e.clientX, e.clientY);
    pastePointRef.current = point;
    const current = elementsRef.current;
    const block = findBlockAt(current, point.x, point.y);
    if (block) {
      setSelectedId(block.id);
      setEditingLabel(false);
      setHoverPreviewBlockId(null);
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        canvasX: point.x,
        canvasY: point.y,
        targetId: block.id,
        kind: "block",
      });
      return;
    }

    const stroke = findStrokeAt(current, point.x, point.y);
    if (stroke) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        canvasX: point.x,
        canvasY: point.y,
        targetId: stroke.id,
        kind: "stroke",
      });
      return;
    }

    setSelectedId(null);
    setEditingLabel(false);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      canvasX: point.x,
      canvasY: point.y,
      kind: "canvas",
    });
  }

  function buildContextMenuItems(): ContextMenuItem[] {
    if (!contextMenu) return [];
    const { kind, targetId, canvasX, canvasY } = contextMenu;

    if (kind === "block" && targetId) {
      const block = elementsRef.current.find(
        (el): el is SketchBlock => el.type === "block" && el.id === targetId
      );
      const currentAnim = block?.animation ?? "none";

      return [
        {
          type: "action",
          id: "edit-label",
          label: "編輯文字",
          icon: Type,
          onClick: () => {
            if (block) openLabelEditForBlock(block);
          },
        },
        {
          type: "action",
          id: "copy",
          label: "複製",
          icon: Copy,
          onClick: () => copyElementById(targetId),
        },
        {
          type: "action",
          id: "duplicate",
          label: "快速複製",
          icon: Copy,
          onClick: () => duplicateElementById(targetId),
        },
        { type: "separator", id: "sep-layer" },
        {
          type: "action",
          id: "layer-up",
          label: "上移一層",
          icon: ArrowUp,
          onClick: () => moveLayerById(targetId, "forward"),
        },
        {
          type: "action",
          id: "layer-down",
          label: "下移一層",
          icon: ArrowDown,
          onClick: () => moveLayerById(targetId, "backward"),
        },
        {
          type: "action",
          id: "layer-front",
          label: "置頂",
          icon: ChevronsUp,
          onClick: () => moveLayerById(targetId, "front"),
        },
        {
          type: "action",
          id: "layer-back",
          label: "置底",
          icon: ChevronsDown,
          onClick: () => moveLayerById(targetId, "back"),
        },
        { type: "separator", id: "sep-fx" },
        {
          type: "submenu",
          id: "fx",
          label: "進場特效",
          icon: Sparkles,
          children: QUICK_ANIMATION_PRESETS.map((preset) => ({
            id: `fx-${preset.value}`,
            label: preset.label,
            checked: currentAnim === preset.value,
            onClick: () => setBlockAnimationById(targetId, preset.value),
          })),
        },
        { type: "separator", id: "sep-del" },
        {
          type: "action",
          id: "delete",
          label: "刪除此元件",
          icon: Trash2,
          danger: true,
          onClick: () => deleteElementById(targetId),
        },
      ];
    }

    if (kind === "stroke" && targetId) {
      return [
        {
          type: "action",
          id: "copy-stroke",
          label: "複製",
          icon: Copy,
          onClick: () => copyElementById(targetId),
        },
        {
          type: "action",
          id: "duplicate-stroke",
          label: "快速複製",
          icon: Copy,
          onClick: () => duplicateElementById(targetId),
        },
        { type: "separator", id: "sep-stroke-del" },
        {
          type: "action",
          id: "delete-stroke",
          label: "刪除此筆畫",
          icon: Trash2,
          danger: true,
          onClick: () => deleteElementById(targetId),
        },
      ];
    }

    return [
      {
        type: "action",
        id: "paste",
        label: "貼上",
        icon: ClipboardPaste,
        disabled: !hasClipboard,
        onClick: () => pasteClipboard({ x: canvasX, y: canvasY }),
      },
      { type: "separator", id: "sep-canvas-history" },
      {
        type: "action",
        id: "undo",
        label: "復原",
        icon: Undo2,
        disabled: historyIndex <= 0,
        onClick: () => undo(),
      },
      {
        type: "action",
        id: "redo",
        label: "重做",
        icon: Redo2,
        disabled: historyIndex >= history.length - 1,
        onClick: () => redo(),
      },
    ];
  }

  function handleClear() {
    if (!confirm("確定要清空此頁草圖？")) return;
    commitElements([]);
    if (activePageId) clearPage(activePageId);
    setSelectedId(null);
    setEditingLabel(false);
  }

  function handleExportCurrent() {
    const dataUrl = exportSketchPng(
      elementsRef.current,
      canvasSize.width,
      canvasSize.height
    );
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${title}-${activePage?.name ?? "page"}.png`;
    a.click();
  }

  function handleExportAll() {
    const exports = exportAllSketchPages(pages);
    exports.forEach((item, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = item.dataUrl;
        a.download = `${title}-${item.pageName}.png`;
        a.click();
      }, i * 200);
    });
  }

  function handleDeviceChange(next: SketchDevice) {
    if (!activePageId || next === device) return;
    if (
      elements.length > 0 &&
      !confirm("切換裝置尺寸會保留元件，但位置可能需調整。繼續？")
    ) {
      return;
    }
    setPageDevice(activePageId, next);
  }

  function openLabelEditForBlock(block: SketchBlock) {
    setSelectedId(block.id);
    setTool("select");
    setEditingLabel(true);
  }

  function tryOpenLabelEdit(block: SketchBlock) {
    const now = Date.now();
    const last = lastClickRef.current;
    if (last && last.id === block.id && now - last.time < 350) {
      openLabelEditForBlock(block);
      lastClickRef.current = null;
      return true;
    }
    lastClickRef.current = { id: block.id, time: now };
    return false;
  }

  function clampDragPosition(block: SketchBlock, nx: number, ny: number) {
    return {
      x: Math.max(0, Math.min(nx, canvasSize.width - block.w)),
      y: Math.max(0, Math.min(ny, canvasSize.height - block.h)),
    };
  }

  function finalizeBlockPosition(
    block: SketchBlock,
    options?: { snapSize?: boolean }
  ): {
    x: number;
    y: number;
    w: number;
    h: number;
    guides: AlignmentGuide[];
  } {
    const snapSize = options?.snapSize ?? false;
    let { x, y, w, h } = block;
    if (snapGrid) {
      x = snapToGrid(x);
      y = snapToGrid(y);
      if (snapSize) {
        w = Math.max(24, snapToGrid(w));
        h = Math.max(24, snapToGrid(h));
      }
    }
    const others = elementsRef.current.filter(
      (el): el is SketchBlock => el.type === "block" && el.id !== block.id
    );
    const snapped = snapBlockPosition(
      { ...block, x, y, w, h },
      others,
      canvasSize.width,
      canvasSize.height
    );
    const clamped = clampBlock(
      { x: snapped.x, y: snapped.y, w, h },
      canvasSize.width,
      canvasSize.height
    );
    return { ...clamped, guides: dedupeGuides(snapped.guides) };
  }

  function clearDragSession() {
    dragOffsetRef.current = null;
    pendingDragRef.current = null;
    resizeHandleRef.current = null;
    resizeSessionRef.current = null;
    setAlignmentGuides([]);
  }

  function startInteraction(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const point = getCanvasPoint(canvas, clientX, clientY);
    const current = elementsRef.current;

    if (tool === "select") {
      // 已選中元件時優先偵測縮放控制點，避免誤觸拖曳
      if (selectedId) {
        const selected = current.find(
          (el): el is SketchBlock =>
            el.type === "block" && el.id === selectedId
        );
        if (selected) {
          const handle = hitTestResizeHandle(selected, point.x, point.y);
        if (handle) {
          pendingDragRef.current = null;
          resizeHandleRef.current = handle;
          dragOffsetRef.current = null;
          resizeSessionRef.current = {
            handle,
            startBlock: { ...selected },
          };
          return;
        }
      }
    }

      const hit = findBlockAt(current, point.x, point.y);
      if (hit) {
        if (tryOpenLabelEdit(hit)) return;
        const handle = hitTestResizeHandle(hit, point.x, point.y);
        if (handle) {
          setSelectedId(hit.id);
          pendingDragRef.current = null;
          resizeHandleRef.current = handle;
          dragOffsetRef.current = null;
          resizeSessionRef.current = {
            handle,
            startBlock: { ...hit },
          };
          return;
        }
        setSelectedId(hit.id);
        pendingDragRef.current = {
          startX: point.x,
          startY: point.y,
          offset: { x: point.x - hit.x, y: point.y - hit.y },
        };
        dragOffsetRef.current = null;
        resizeSessionRef.current = null;
      } else {
        setSelectedId(null);
        setEditingLabel(false);
        clearDragSession();
      }
      return;
    }

    if (tool === "block") {
      placeBlock(activeBlock, point);
      return;
    }

    if (tool === "pen") {
      setIsDrawing(true);
      const strokeId = uid();
      currentStrokeRef.current = strokeId;
      setElementsState([
        ...current,
        {
          id: strokeId,
          type: "stroke",
          points: [point],
          color: penColor,
          width: 2.5,
        },
      ]);
      return;
    }

    if (tool === "eraser") {
      setIsDrawing(true);
      setElementsState(eraseStrokesAt(current, point.x, point.y, 14));
    }
  }

  function updateHoverFeedback(point: { x: number; y: number }) {
    if (
      tool !== "select" ||
      isDrawing ||
      resizeHandleRef.current ||
      dragOffsetRef.current ||
      pendingDragRef.current
    ) {
      setHoverHandle(null);
      return;
    }

    const block = selectedId
      ? (elementsRef.current.find(
          (el): el is SketchBlock => el.type === "block" && el.id === selectedId
        ) ?? null)
      : null;

    if (block) {
      const handle = hitTestResizeHandle(block, point.x, point.y);
      setHoverHandle(handle);
      return;
    }

    setHoverHandle(null);
  }

  function getCanvasCursor(): string {
    if (tool === "eraser") return "cell";
    if (tool === "pen" || tool === "block" || ghostBlockType) return "crosshair";
    if (tool !== "select") return "default";

    if (hoverHandle) return getCursorForResizeHandle(hoverHandle);

    const pt = lastPointerRef.current;
    if (selectedBlock && pt && hitTestBlock(pt.x, pt.y, selectedBlock)) {
      return "move";
    }

    return "default";
  }

  function moveInteraction(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const point = getCanvasPoint(canvas, clientX, clientY);
    lastPointerRef.current = point;

    if (ghostBlockType) {
      setHoverPoint(point);
      setHoverHandle(null);
      return;
    }

    if (
      tool === "select" &&
      !resizeHandleRef.current &&
      !dragOffsetRef.current &&
      !pendingDragRef.current &&
      !isDrawing &&
      !animPreviewPlaying
    ) {
      updateHoverFeedback(point);
      const hit = findBlockAt(elementsRef.current, point.x, point.y);
      if (hit && isHoverLiftBlock(hit)) {
        setHoverPreviewBlockId(hit.id);
      } else {
        setHoverPreviewBlockId(null);
      }
    }

    if (tool === "select" && pendingDragRef.current && !dragOffsetRef.current) {
      const pending = pendingDragRef.current;
      const dist = Math.hypot(point.x - pending.startX, point.y - pending.startY);
      if (dist >= DRAG_THRESHOLD) {
        dragOffsetRef.current = pending.offset;
        pendingDragRef.current = null;
      }
    }

    if (tool === "select" && selectedId && resizeHandleRef.current && resizeSessionRef.current) {
      const session = resizeSessionRef.current;
      const sized = resizeBlockFromStart(
        session.startBlock,
        session.handle,
        point.x,
        point.y,
        canvasSize.width,
        canvasSize.height
      );
      setElementsState((prev) =>
        prev.map((el) =>
          el.type === "block" && el.id === selectedId ? { ...el, ...sized } : el
        )
      );
      return;
    }

    if (tool === "select" && selectedId && dragOffsetRef.current) {
      const offset = dragOffsetRef.current;
      setElementsState((prev) =>
        prev.map((el) => {
          if (el.type !== "block" || el.id !== selectedId) return el;
          const pos = clampDragPosition(
            el,
            point.x - offset.x,
            point.y - offset.y
          );
          return { ...el, ...pos };
        })
      );
      return;
    }

    if (!isDrawing) return;

    if (tool === "pen" && currentStrokeRef.current) {
      const strokeId = currentStrokeRef.current;
      setElementsState((prev) =>
        prev.map((el) =>
          el.id === strokeId && el.type === "stroke"
            ? { ...el, points: [...el.points, point] }
            : el
        )
      );
      return;
    }

    if (tool === "eraser") {
      setElementsState((prev) => eraseStrokesAt(prev, point.x, point.y, 14));
    }
  }

  function endInteraction() {
    const didDrag = Boolean(dragOffsetRef.current);
    const didResize = Boolean(resizeHandleRef.current);

    if (tool === "select" && selectedId && (didDrag || didResize)) {
      let next = elementsRef.current;
      let guides: AlignmentGuide[] = [];
      next = next.map((el) => {
        if (el.type !== "block" || el.id !== selectedId) return el;
        const finalized = finalizeBlockPosition(el, { snapSize: didResize });
        guides = finalized.guides;
        const { guides: _guides, ...pos } = finalized;
        return { ...el, ...pos };
      });
      setAlignmentGuides(guides);
      commitElements(next);
      clearDragSession();
    } else if (pendingDragRef.current) {
      const block = getSelectedBlock(elementsRef.current, selectedId);
      if (block && isTextEditableBlock(block.blockType)) {
        openLabelEditForBlock(block);
      }
      pendingDragRef.current = null;
    }
    if (isDrawing && (tool === "pen" || tool === "eraser")) {
      commitElements(elementsRef.current);
    }
    setIsDrawing(false);
    currentStrokeRef.current = null;
  }

  function handleCanvasDrop(e: React.DragEvent) {
    e.preventDefault();
    const blockType =
      (e.dataTransfer.getData(DRAG_MIME) as SketchBlockType) || dragBlockType;
    if (!blockType || !canvasRef.current) return;
    const point = getCanvasPoint(canvasRef.current, e.clientX, e.clientY);
    placeBlock(blockType, point);
    setDragBlockType(null);
    setHoverPoint(null);
  }

  const blockTypes = useMemo(
    () => Object.keys(BLOCK_META) as SketchBlockType[],
    []
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 py-1">
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-white">介面草圖</h1>
          {linkedTemplate ? (
            <p className="truncate text-xs text-emerald-400/90">
              已連結：{linkedTemplate.name} ·{" "}
              <Link href={`/templates/${linkedTemplate.id}`} className="underline">
                查看
              </Link>
            </p>
          ) : (
            <p className="text-xs text-zinc-500">
              畫布自動適配視窗 · 工具在左側
            </p>
          )}
        </div>
        <Link
          href="/contact"
          className="shrink-0 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-violet-500 hover:text-white"
        >
          提交需求 →
        </Link>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 max-lg:grid-rows-[minmax(0,38%)_minmax(0,1fr)] lg:grid-cols-[252px_1fr]">
        <aside className="flex min-h-0 flex-col gap-2.5 overflow-y-auto pr-1">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <label className="mb-1.5 block text-xs text-zinc-500">草圖名稱</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
            />
          </div>

          {selectedBlock && (
            <div className="rounded-xl border border-violet-500/40 bg-violet-500/5 p-3">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-violet-400">
                選中元件 · {BLOCK_META[selectedBlock.blockType].label}
              </p>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-zinc-500">
                    {isTextEditableBlock(selectedBlock.blockType)
                      ? "顯示文字（可直接輸入）"
                      : "顯示文字"}
                  </label>
                  <input
                    ref={labelInputRef}
                    value={selectedBlock.label ?? ""}
                    placeholder={BLOCK_META[selectedBlock.blockType].defaultLabel}
                    onChange={(e) =>
                      updateSelectedBlock({ label: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setEditingLabel(false);
                        e.currentTarget.blur();
                      }
                    }}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                  {isTextEditableBlock(selectedBlock.blockType) && (
                    <p className="mt-1.5 text-[10px] leading-relaxed text-zinc-600">
                      點選此元件後在此輸入，或雙擊畫布上的元件快速編輯
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500">進場特效</label>
                  <SketchAnimationSelect
                    value={selectedBlock.animation ?? "none"}
                    onChange={(animation) => updateSelectedBlock({ animation })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                  />
                  <p className="mt-1 text-[10px] text-zinc-600">
                    {ANIMATION_OPTIONS.find(
                      (o) => o.value === (selectedBlock.animation ?? "none")
                    )?.hint ?? ""}
                    {selectedBlock.animation === "hover-lift" &&
                      selectedBlock.blockType !== "button" &&
                      selectedBlock.blockType !== "card" &&
                      " · 建議用於按鈕或卡片"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(["x", "y", "w", "h"] as const).map((key) => (
                    <div key={key}>
                      <label className="mb-1 block text-[10px] uppercase text-zinc-600">
                        {key}
                      </label>
                      <input
                        type="number"
                        value={Math.round(selectedBlock[key])}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (Number.isNaN(v)) return;
                          updateSelectedBlock({ [key]: v });
                        }}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { dir: "forward" as LayerMove, icon: ArrowUp, label: "上移" },
                      { dir: "backward" as LayerMove, icon: ArrowDown, label: "下移" },
                      { dir: "front" as LayerMove, icon: ChevronsUp, label: "置頂" },
                      { dir: "back" as LayerMove, icon: ChevronsDown, label: "置底" },
                    ] as const
                  ).map(({ dir, icon: Icon, label }) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => handleLayerMove(dir)}
                      className="flex items-center justify-center gap-1 rounded-lg border border-zinc-700 px-2 py-1.5 text-[10px] text-zinc-400 hover:border-zinc-600"
                    >
                      <Icon className="h-3 w-3" /> {label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={deleteSelected}
                  className="flex w-full items-center justify-center gap-1 rounded-lg border border-red-500/40 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> 刪除此元件
                </button>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                對齊
              </p>
              <button
                type="button"
                onClick={() => setSnapGrid((v) => !v)}
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] ${
                  snapGrid
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Grid3x3 className="h-3 w-3" />
                格線 {snapGrid ? "開" : "關"}
              </button>
            </div>
            <p className="text-[10px] leading-relaxed text-zinc-600">
              拖曳元件時會顯示粉色對齊線；格線吸附 8px。
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              此頁尺寸
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["desktop", "mobile"] as SketchDevice[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDeviceChange(d)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs transition-colors ${
                    device === d
                      ? "border-violet-500 bg-violet-500/10 text-violet-300"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {d === "desktop" ? (
                    <Monitor className="h-3.5 w-3.5" />
                  ) : (
                    <Smartphone className="h-3.5 w-3.5" />
                  )}
                  {d === "desktop" ? "桌面" : "手機"}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              工具
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "select", icon: MousePointer2, label: "選取" },
                  { id: "pen", icon: PenLine, label: "畫筆" },
                  { id: "eraser", icon: Eraser, label: "橡皮擦" },
                  { id: "block", icon: LayoutTemplate, label: "線框" },
                ] as const
              ).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTool(id);
                    if (id !== "select") setEditingLabel(false);
                    if (id !== "block") setDragBlockType(null);
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs transition-colors ${
                    tool === id
                      ? "border-violet-500 bg-violet-500/10 text-violet-300"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
            {tool === "pen" && (
              <div className="mt-3 flex gap-2">
                {PEN_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPenColor(c)}
                    className={`h-7 w-7 rounded-full border-2 ${
                      penColor === c ? "border-white" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}

            <div className="mt-3 border-t border-zinc-800 pt-3">
              <p className="mb-2 flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                進場特效
              </p>
              <label className="mb-1 block text-[10px] text-zinc-600">
                新放置元件預設
              </label>
              <SketchAnimationSelect
                value={defaultAnimation}
                onChange={setDefaultAnimation}
                className="mb-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none"
              />
              <label className="mb-1 block text-[10px] text-zinc-600">
                錯開速度（非捲動進場）
              </label>
              <select
                value={staggerSpeed}
                onChange={(e) =>
                  setStaggerSpeed(e.target.value as StaggerSpeed)
                }
                className="mb-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none"
              >
                {STAGGER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={playAnimationPreview}
                disabled={animatedBlockCount === 0 || animPreviewPlaying}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Play className="h-3.5 w-3.5" />
                {animPreviewPlaying ? "播放中…" : "預覽播放"}
              </button>
              <p className="mt-1.5 text-[10px] leading-relaxed text-zinc-600">
                已設特效：{animatedBlockCount} 個 · 懸停上浮：滑過按鈕／卡片預覽
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              線框元件
            </p>
            <p className="mb-2 text-[10px] text-zinc-600">
              拖曳到畫布，或選中後點畫布放置
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {blockTypes.map((bt) => (
                <button
                  key={bt}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(DRAG_MIME, bt);
                    e.dataTransfer.effectAllowed = "copy";
                    setDragBlockType(bt);
                    setActiveBlock(bt);
                  }}
                  onDragEnd={() => {
                    setDragBlockType(null);
                    setHoverPoint(null);
                  }}
                  onClick={() => {
                    setActiveBlock(bt);
                    setTool("block");
                  }}
                  className={`cursor-grab rounded-lg border px-2 py-1.5 text-left text-xs transition-colors active:cursor-grabbing ${
                    activeBlock === bt
                      ? "border-violet-500 bg-violet-500/10 text-violet-300"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {BLOCK_META[bt].label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={undo} disabled={historyIndex <= 0} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-400 disabled:opacity-40">
              <Undo2 className="h-3.5 w-3.5" /> 復原
            </button>
            <button type="button" onClick={redo} disabled={historyIndex >= history.length - 1} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-400 disabled:opacity-40">
              <Redo2 className="h-3.5 w-3.5" /> 重做
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <button type="button" onClick={handleExportCurrent} className="flex items-center justify-center gap-1 rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white hover:bg-violet-500">
              <Download className="h-3.5 w-3.5" /> 匯出此頁 PNG
            </button>
            {pages.length > 1 && (
              <button type="button" onClick={handleExportAll} className="flex items-center justify-center gap-1 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-400 hover:border-zinc-600">
                <Download className="h-3.5 w-3.5" /> 匯出全部頁面
              </button>
            )}
            <button type="button" onClick={handleClear} className="flex items-center justify-center gap-1 rounded-lg border border-red-500/40 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10">
              <Trash2 className="h-3.5 w-3.5" /> 清空此頁
            </button>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-col gap-2">
          <div className="flex shrink-0 flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-2">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActivePage(page.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    page.id === activePageId
                      ? "bg-violet-600 text-white"
                      : "border border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {page.name}
                  {page.elements.length > 0 && (
                    <span className="ml-1 opacity-60">({page.elements.length})</span>
                  )}
                </button>
                {pages.length > 1 && page.id === activePageId && (
                  <button
                    type="button"
                    onClick={() => removePage(page.id)}
                    className="rounded p-1 text-zinc-600 hover:text-red-400"
                    title="刪除此頁"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addPage()}
              className="flex items-center gap-1 rounded-lg border border-dashed border-zinc-700 px-3 py-1.5 text-xs text-zinc-500 hover:border-violet-500 hover:text-violet-300"
            >
              <Plus className="h-3.5 w-3.5" /> 新增頁
            </button>
            {activePage && (
              <input
                value={activePage.name}
                onChange={(e) => renamePage(activePage.id, e.target.value)}
                className="min-w-[8rem] flex-1 rounded-lg border border-zinc-800 bg-zinc-950/50 px-2 py-1 text-xs text-zinc-400 focus:border-violet-500 focus:text-white focus:outline-none sm:max-w-[12rem] sm:flex-none"
                placeholder="此頁名稱"
              />
            )}
          </div>

          <div
            ref={canvasViewportRef}
            className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 p-2"
          >
            <div
              className="mb-1.5 flex shrink-0 items-center justify-between text-[11px] text-zinc-500"
              style={{ width: canvasSize.width * canvasScale }}
            >
              <span>
                {canvasSize.width} × {canvasSize.height}px · {activePage?.name}
              </span>
              <span>
                {animPreviewPlaying
                  ? "特效預覽中…"
                  : `${elements.length} 個元素 · 本機儲存`}
              </span>
            </div>
            <div
              className="relative shrink-0"
              style={{
                width: canvasSize.width * canvasScale,
                height: canvasSize.height * canvasScale,
              }}
            >
              <div
                ref={canvasWrapRef}
                className="absolute left-0 top-0 origin-top-left"
                style={{
                  transform: `scale(${canvasScale})`,
                  width: canvasSize.width,
                  height: canvasSize.height,
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className="block rounded-lg shadow-2xl shadow-black/40"
                  style={{
                    touchAction: "none",
                    cursor: getCanvasCursor(),
                    width: canvasSize.width,
                    height: canvasSize.height,
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "copy";
                    if (canvasRef.current) {
                      setHoverPoint(
                        getCanvasPoint(canvasRef.current, e.clientX, e.clientY)
                      );
                    }
                  }}
                  onDrop={handleCanvasDrop}
                  onContextMenu={handleCanvasContextMenu}
                  onMouseDown={(e) => handleCanvasPointerDown(e.clientX, e.clientY)}
                  onMouseMove={(e) => moveInteraction(e.clientX, e.clientY)}
                  onMouseUp={endInteraction}
                  onMouseLeave={() => {
                    setHoverPoint(null);
                    setHoverHandle(null);
                    setHoverPreviewBlockId(null);
                    if (
                      isDrawing ||
                      dragOffsetRef.current ||
                      resizeHandleRef.current ||
                      pendingDragRef.current
                    ) {
                      endInteraction();
                    } else {
                      pendingDragRef.current = null;
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    const t = e.touches[0];
                    handleCanvasPointerDown(t.clientX, t.clientY);
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    const t = e.touches[0];
                    moveInteraction(t.clientX, t.clientY);
                  }}
                  onTouchEnd={() => {
                    setHoverPoint(null);
                    endInteraction();
                  }}
                />
                <SketchAnimationOverlay
                  blocks={canvasBlocks}
                  previewTick={animPreviewTick}
                  playing={animPreviewPlaying}
                  canvasHeight={canvasSize.height}
                  staggerMs={staggerMs}
                />
                <SketchHoverOverlay block={hoverPreviewBlock} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {contextMenu && (
        <SketchContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={buildContextMenuItems()}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

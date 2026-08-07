import type { SketchBlock, SketchBlockType } from "@/types/sketch";

export const SKETCH_CANVAS = {
  desktop: { width: 960, height: 640 },
  mobile: { width: 375, height: 667 },
} as const;

export const GRID_SIZE = 8;

export const BLOCK_META: Record<
  SketchBlockType,
  {
    label: string;
    defaultLabel: string;
    defaultW: number;
    defaultH: number;
    fill: string;
  }
> = {
  header: {
    label: "頁首 Header",
    defaultLabel: "Logo · 導航 · CTA",
    defaultW: 920,
    defaultH: 56,
    fill: "#e4e4e7",
  },
  nav: {
    label: "導航 Nav",
    defaultLabel: "首頁 · 關於 · 服務 · 聯絡",
    defaultW: 920,
    defaultH: 48,
    fill: "#d4d4d8",
  },
  hero: {
    label: "Hero 區塊",
    defaultLabel: "主標題 + 副標題 + 行動按鈕",
    defaultW: 880,
    defaultH: 180,
    fill: "#a1a1aa",
  },
  section: {
    label: "內容區 Section",
    defaultLabel: "內容區塊標題",
    defaultW: 880,
    defaultH: 120,
    fill: "#f4f4f5",
  },
  card: {
    label: "卡片 Card",
    defaultLabel: "卡片標題",
    defaultW: 160,
    defaultH: 100,
    fill: "#fafafa",
  },
  text: {
    label: "文字 Text",
    defaultLabel: "輸入文字…",
    defaultW: 200,
    defaultH: 40,
    fill: "#ffffff",
  },
  input: {
    label: "輸入框 Input",
    defaultLabel: "請輸入…",
    defaultW: 240,
    defaultH: 40,
    fill: "#ffffff",
  },
  search: {
    label: "搜尋 Search",
    defaultLabel: "🔍 搜尋…",
    defaultW: 280,
    defaultH: 40,
    fill: "#ffffff",
  },
  list: {
    label: "列表 List",
    defaultLabel: "• 項目一 · 項目二 · 項目三",
    defaultW: 240,
    defaultH: 96,
    fill: "#fafafa",
  },
  divider: {
    label: "分隔線 Divider",
    defaultLabel: "",
    defaultW: 880,
    defaultH: 16,
    fill: "#e4e4e7",
  },
  form: {
    label: "表單 Form",
    defaultLabel: "聯絡我們表單",
    defaultW: 360,
    defaultH: 200,
    fill: "#fafafa",
  },
  checkbox: {
    label: "核取 Checkbox",
    defaultLabel: "我同意服務條款",
    defaultW: 220,
    defaultH: 32,
    fill: "#ffffff",
  },
  sidebar: {
    label: "側欄 Sidebar",
    defaultLabel: "選單 · 設定 · 登出",
    defaultW: 200,
    defaultH: 400,
    fill: "#f4f4f5",
  },
  tabs: {
    label: "分頁 Tabs",
    defaultLabel: "概覽 · 詳情 · 評價",
    defaultW: 480,
    defaultH: 48,
    fill: "#ffffff",
  },
  table: {
    label: "表格 Table",
    defaultLabel: "欄位 A · 欄位 B · 欄位 C",
    defaultW: 480,
    defaultH: 160,
    fill: "#ffffff",
  },
  video: {
    label: "影片 Video",
    defaultLabel: "產品介紹影片",
    defaultW: 320,
    defaultH: 180,
    fill: "#3f3f46",
  },
  pricing: {
    label: "價格表 Pricing",
    defaultLabel: "基本 · 專業 · 企業",
    defaultW: 560,
    defaultH: 180,
    fill: "#fafafa",
  },
  faq: {
    label: "FAQ 問答",
    defaultLabel: "常見問題一 · 常見問題二",
    defaultW: 480,
    defaultH: 140,
    fill: "#fafafa",
  },
  map: {
    label: "地圖 Map",
    defaultLabel: "📍 門市位置",
    defaultW: 400,
    defaultH: 200,
    fill: "#ecfccb",
  },
  image: {
    label: "圖片 Image",
    defaultLabel: "🖼 圖片占位",
    defaultW: 160,
    defaultH: 120,
    fill: "#d4d4d8",
  },
  button: {
    label: "按鈕 Button",
    defaultLabel: "立即行動",
    defaultW: 120,
    defaultH: 36,
    fill: "#8b5cf6",
  },
  footer: {
    label: "頁尾 Footer",
    defaultLabel: "© 品牌 · 連結 · 社群",
    defaultW: 920,
    defaultH: 64,
    fill: "#e4e4e7",
  },
};

export function snapToGrid(value: number, grid = GRID_SIZE): number {
  return Math.round(value / grid) * grid;
}

export function getBlockDisplayLabel(block: Pick<SketchBlock, "blockType" | "label">): string {
  if (block.label?.trim()) return block.label.trim();
  return BLOCK_META[block.blockType].defaultLabel;
}

/** 點選後適合直接開啟文字編輯的元件 */
export function isTextEditableBlock(blockType: SketchBlockType): boolean {
  return (
    blockType === "text" ||
    blockType === "input" ||
    blockType === "search" ||
    blockType === "list" ||
    blockType === "form" ||
    blockType === "checkbox" ||
    blockType === "tabs" ||
    blockType === "table" ||
    blockType === "pricing" ||
    blockType === "faq" ||
    blockType === "sidebar" ||
    blockType === "video" ||
    blockType === "map"
  );
}

export function createBlockPlacement(
  blockType: SketchBlockType,
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number,
  snap = true
): Pick<SketchBlock, "blockType" | "x" | "y" | "w" | "h" | "label"> {
  const meta = BLOCK_META[blockType];
  const w = Math.min(meta.defaultW, canvasWidth - 16);
  const h = meta.defaultH;

  let px = x - w / 2;
  let py = y - h / 2;

  if (snap) {
    px = snapToGrid(px);
    py = snapToGrid(py);
  }

  px = Math.max(0, Math.min(px, canvasWidth - w));
  py = Math.max(0, Math.min(py, canvasHeight - h));

  return {
    blockType,
    x: px,
    y: py,
    w,
    h,
    label: meta.defaultLabel,
  };
}

export function clampBlock(
  block: Pick<SketchBlock, "x" | "y" | "w" | "h">,
  canvasWidth: number,
  canvasHeight: number
): Pick<SketchBlock, "x" | "y" | "w" | "h"> {
  const w = Math.max(24, Math.min(block.w, canvasWidth));
  const h = Math.max(24, Math.min(block.h, canvasHeight));
  const x = Math.max(0, Math.min(block.x, canvasWidth - w));
  const y = Math.max(0, Math.min(block.y, canvasHeight - h));
  return { x, y, w, h };
}

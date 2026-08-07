export type SketchBlockType =
  | "header"
  | "nav"
  | "hero"
  | "section"
  | "card"
  | "text"
  | "input"
  | "search"
  | "list"
  | "divider"
  | "form"
  | "checkbox"
  | "sidebar"
  | "tabs"
  | "table"
  | "video"
  | "pricing"
  | "faq"
  | "map"
  | "image"
  | "button"
  | "footer";

export type SketchAnimation =
  | "none"
  | "fade-in"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom-in"
  | "bounce-in"
  | "flip-in"
  | "scroll-reveal"
  | "blur-in"
  | "rotate-in"
  | "hover-lift";

export type SketchTool = "select" | "pen" | "eraser" | "block";

export type SketchDevice = "desktop" | "mobile";

export interface SketchPoint {
  x: number;
  y: number;
}

export interface SketchStroke {
  id: string;
  type: "stroke";
  points: SketchPoint[];
  color: string;
  width: number;
}

export interface SketchBlock {
  id: string;
  type: "block";
  blockType: SketchBlockType;
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  /** 進場特效（預覽播放時顯示） */
  animation?: SketchAnimation;
}

export type SketchElement = SketchStroke | SketchBlock;

export interface SketchPage {
  id: string;
  name: string;
  device: SketchDevice;
  elements: SketchElement[];
}

export interface SketchState {
  title: string;
  activePageId: string;
  pages: SketchPage[];
  updatedAt: string | null;
  linkedTemplateId: string | null;
}

export type LayerMove = "forward" | "backward" | "front" | "back";

export interface AlignmentGuide {
  orientation: "horizontal" | "vertical";
  position: number;
}

export interface SketchPageExport {
  pageId: string;
  pageName: string;
  device: SketchDevice;
  dataUrl: string;
}

"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ContextMenuAction = {
  id: string;
  label: string;
  icon?: LucideIcon;
  danger?: boolean;
  disabled?: boolean;
  checked?: boolean;
  onClick: () => void;
};

export type ContextMenuItem =
  | ({ type: "action" } & ContextMenuAction)
  | { type: "separator"; id: string }
  | {
      type: "submenu";
      id: string;
      label: string;
      icon?: LucideIcon;
      children: ContextMenuAction[];
    };

interface SketchContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

const VIEWPORT_PAD = 8;

function clampMenuPosition(
  x: number,
  y: number,
  width: number,
  height: number
) {
  let left = x;
  let top = y;
  if (left + width > window.innerWidth - VIEWPORT_PAD) {
    left = window.innerWidth - width - VIEWPORT_PAD;
  }
  if (top + height > window.innerHeight - VIEWPORT_PAD) {
    top = window.innerHeight - height - VIEWPORT_PAD;
  }
  return {
    left: Math.max(VIEWPORT_PAD, left),
    top: Math.max(VIEWPORT_PAD, top),
  };
}

function MenuButton({
  item,
  onClose,
}: {
  item: ContextMenuAction;
  onClose: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      role="menuitem"
      disabled={item.disabled}
      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        item.danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-zinc-200 hover:bg-zinc-800"
      }`}
      onClick={() => {
        if (item.disabled) return;
        item.onClick();
        onClose();
      }}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 opacity-70" />}
      <span className="flex-1">{item.label}</span>
      {item.checked && <span className="text-violet-400">✓</span>}
    </button>
  );
}

function SubmenuEntry({
  item,
  onClose,
}: {
  item: Extract<ContextMenuItem, { type: "submenu" }>;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [flipLeft, setFlipLeft] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;

  useLayoutEffect(() => {
    if (!open || !rowRef.current || !panelRef.current) return;

    const row = rowRef.current.getBoundingClientRect();
    const panel = panelRef.current.getBoundingClientRect();
    const pad = VIEWPORT_PAD;

    setFlipLeft(row.right + panel.width > window.innerWidth - pad);

    let yShift = 0;
    const topIfAligned = row.top;
    const bottomIfAligned = topIfAligned + panel.height;
    if (bottomIfAligned > window.innerHeight - pad) {
      yShift = window.innerHeight - pad - bottomIfAligned;
    }
    const topAfterShift = topIfAligned + yShift;
    if (topAfterShift < pad) {
      yShift += pad - topAfterShift;
    }
    setOffsetY(yShift);
  }, [open, item.children.length]);

  return (
    <div
      ref={rowRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        role="menuitem"
        className="flex w-full cursor-default items-center gap-2 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
      >
        {Icon && <Icon className="h-4 w-4 shrink-0 opacity-70" />}
        <span className="flex-1">{item.label}</span>
        {flipLeft ? (
          <ChevronLeft className="h-3.5 w-3.5 text-zinc-500" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
        )}
      </div>
      {open && (
        <div
          ref={panelRef}
          className={`absolute z-[110] min-w-[9.5rem] overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 py-1 shadow-xl ${
            flipLeft ? "right-full mr-0.5" : "left-full ml-0.5"
          }`}
          style={{ top: offsetY }}
        >
          {item.children.map((child) => (
            <MenuButton key={child.id} item={child} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SketchContextMenu({
  x,
  y,
  items,
  onClose,
}: SketchContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    setPosition(null);
  }, [x, y, items]);

  useLayoutEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    setPosition(clampMenuPosition(x, y, rect.width, rect.height));
  }, [x, y, items]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (menuRef.current?.contains(e.target as Node)) return;
      onClose();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onClose, true);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onClose, true);
    };
  }, [onClose]);

  if (!mounted) return null;

  const menu = (
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-[11rem] overflow-visible rounded-lg border border-zinc-700 bg-zinc-900 py-1 shadow-2xl shadow-black/50"
      style={{
        left: position?.left ?? x,
        top: position?.top ?? y,
        visibility: position ? "visible" : "hidden",
      }}
      role="menu"
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item) => {
        if (item.type === "separator") {
          return <div key={item.id} className="my-1 border-t border-zinc-800" />;
        }
        if (item.type === "submenu") {
          return <SubmenuEntry key={item.id} item={item} onClose={onClose} />;
        }
        return <MenuButton key={item.id} item={item} onClose={onClose} />;
      })}
    </div>
  );

  return createPortal(menu, document.body);
}

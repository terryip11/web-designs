"use client";

import { useId, useState, type ReactNode } from "react";

interface HoverTooltipProps {
  content: ReactNode;
  children: ReactNode;
  /** 偏好顯示在觸發元素上方或下方 */
  placement?: "top" | "bottom";
}

export default function HoverTooltip({
  content,
  children,
  placement = "top",
}: HoverTooltipProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span aria-describedby={visible ? id : undefined} className="inline-flex">
        {children}
      </span>
      {visible && (
        <span
          id={id}
          role="tooltip"
          className={`pointer-events-none absolute z-50 w-max max-w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-left shadow-xl shadow-black/40 ${
            placement === "top"
              ? "bottom-full left-1/2 mb-2 -translate-x-1/2"
              : "top-full left-1/2 mt-2 -translate-x-1/2"
          }`}
        >
          {content}
          <span
            className={`absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border border-zinc-700 bg-zinc-900 ${
              placement === "top"
                ? "-bottom-1 border-t-0 border-l-0"
                : "-top-1 border-b-0 border-r-0"
            }`}
            aria-hidden
          />
        </span>
      )}
    </span>
  );
}

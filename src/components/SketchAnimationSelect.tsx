"use client";

import type { SketchAnimation } from "@/types/sketch";
import { ANIMATION_OPTIONS } from "@/lib/sketch-animations";

interface SketchAnimationSelectProps {
  value: SketchAnimation;
  onChange: (value: SketchAnimation) => void;
  className?: string;
}

export default function SketchAnimationSelect({
  value,
  onChange,
  className,
}: SketchAnimationSelectProps) {
  const enter = ANIMATION_OPTIONS.filter((o) => o.group === "enter");
  const interaction = ANIMATION_OPTIONS.filter((o) => o.group === "interaction");

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SketchAnimation)}
      className={className}
    >
      <optgroup label="進場特效">
        {enter.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </optgroup>
      <optgroup label="互動特效">
        {interaction.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </optgroup>
    </select>
  );
}

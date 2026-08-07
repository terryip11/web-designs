import type { SketchElement, LayerMove } from "@/types/sketch";

export function moveElementLayer(
  elements: SketchElement[],
  elementId: string,
  direction: LayerMove
): SketchElement[] {
  const index = elements.findIndex((el) => el.id === elementId);
  if (index === -1) return elements;

  const next = [...elements];
  const [item] = next.splice(index, 1);

  switch (direction) {
    case "forward": {
      const target = Math.min(index + 1, next.length);
      next.splice(target, 0, item);
      break;
    }
    case "backward": {
      const target = Math.max(index - 1, 0);
      next.splice(target, 0, item);
      break;
    }
    case "front":
      next.push(item);
      break;
    case "back":
      next.unshift(item);
      break;
  }

  return next;
}

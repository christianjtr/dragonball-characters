import { useCallback } from "react";

interface UseMenuNavigationProps {
  itemCount: number;
  activeIndex: number;
  onMove: (index: number) => void;
  onConfirm: (index: number) => void;
  onBack?: () => void;
  loop?: boolean;
}

export const useMenuNavigation = ({
  itemCount,
  activeIndex,
  onMove,
  onConfirm,
  onBack,
  loop = true,
}: UseMenuNavigationProps) => {
  const moveTo = useCallback(
    (target: number) => {
      if (itemCount === 0) {
        return;
      }

      const next = loop
        ? ((target % itemCount) + itemCount) % itemCount
        : Math.max(0, Math.min(itemCount - 1, target));

      if (next !== activeIndex) {
        onMove(next);
      }
    },
    [activeIndex, itemCount, loop, onMove],
  );

  const handleKey = useCallback(
    (event: globalThis.KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName))
      ) {
        return false;
      }

      const key = event.key.toLowerCase();
      switch (key) {
        case "arrowdown":
        case "s":
          event.preventDefault();
          moveTo(activeIndex + 1);
          return true;
        case "arrowup":
        case "w":
          event.preventDefault();
          moveTo(activeIndex - 1);
          return true;
        case "home":
          event.preventDefault();
          moveTo(0);
          return true;
        case "end":
          event.preventDefault();
          moveTo(itemCount - 1);
          return true;
        case "enter":
        case " ":
          event.preventDefault();
          if (itemCount > 0) onConfirm(activeIndex);
          return true;
        case "escape":
        case "backspace":
          if (onBack) {
            event.preventDefault();
            onBack();
            return true;
          }
          return false;
        default:
          return false;
      }
    },
    [activeIndex, itemCount, moveTo, onBack, onConfirm],
  );

  return { moveTo, handleKey };
};

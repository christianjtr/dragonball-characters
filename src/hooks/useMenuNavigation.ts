import { useCallback, type KeyboardEvent } from "react";

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

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          moveTo(activeIndex + 1);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveTo(activeIndex - 1);
          break;
        case "Home":
          event.preventDefault();
          moveTo(0);
          break;
        case "End":
          event.preventDefault();
          moveTo(itemCount - 1);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (itemCount > 0) {
            onConfirm(activeIndex);
          }
          break;
        case "Escape":
        case "Backspace":
          if (onBack) {
            event.preventDefault();
            onBack();
          }
          break;
        default:
          break;
      }
    },
    [activeIndex, itemCount, moveTo, onBack, onConfirm],
  );

  return { moveTo, handleKeyDown };
};

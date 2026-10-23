import { useCallback, type KeyboardEvent } from "react";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";

interface UseRosterNavigationProps {
  items: CharacterSummary[];
  columns: number;
  activeId?: number;
  onFocusChange: (id: number) => void;
  onConfirm: () => void;
  onEscape: () => void;
}

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName;

  return (
    tagName === "INPUT" ||
    tagName === "SELECT" ||
    tagName === "TEXTAREA" ||
    target.isContentEditable
  );
};

export const useRosterNavigation = ({
  items,
  columns,
  activeId,
  onFocusChange,
  onConfirm,
  onEscape,
}: UseRosterNavigationProps) => {
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  );

  const moveTo = useCallback(
    (index: number) => {
      if (items.length === 0) {
        return;
      }

      const nextIndex = Math.max(0, Math.min(items.length - 1, index));
      const nextItem = items[nextIndex];

      if (nextItem && nextItem.id !== activeId) {
        onFocusChange(nextItem.id);
      }
    },
    [activeId, items, onFocusChange],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          moveTo(activeIndex + 1);
          break;
        case "ArrowLeft":
          event.preventDefault();
          moveTo(activeIndex - 1);
          break;
        case "ArrowDown":
          event.preventDefault();
          moveTo(activeIndex + columns);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveTo(activeIndex - columns);
          break;
        case "Home":
          event.preventDefault();
          moveTo(0);
          break;
        case "End":
          event.preventDefault();
          moveTo(items.length - 1);
          break;
        case "PageDown":
          event.preventDefault();
          moveTo(activeIndex + columns * 2);
          break;
        case "PageUp":
          event.preventDefault();
          moveTo(activeIndex - columns * 2);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          onConfirm();
          break;
        case "Escape":
          event.preventDefault();
          onEscape();
          break;
        default:
          break;
      }
    },
    [activeIndex, columns, items.length, moveTo, onConfirm, onEscape],
  );

  return { activeIndex, handleKeyDown };
};

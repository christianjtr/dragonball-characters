import { useEffect, useRef, useState } from "react";
import { useGamepadNavigation } from "@hooks/useGamepadNavigation";

interface UseBackNavigationOptions {
  onBack: () => void;
  onConfirm?: () => void;
  enabled?: boolean;
}

export const useBackNavigation = ({
  onBack,
  onConfirm,
  enabled = true,
}: UseBackNavigationOptions): boolean => {
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const onBackRef = useRef(onBack);
  const onConfirmRef = useRef(onConfirm);

  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  useEffect(() => {
    onConfirmRef.current = onConfirm;
  }, [onConfirm]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('[role="dialog"]')) {
        return;
      }

      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName))
      ) {
        return;
      }

      if (event.key === "Enter" && onConfirmRef.current) {
        const isInteractiveTarget =
          target instanceof Element &&
          target.closest('button, a, [role="button"]');

        if (!isInteractiveTarget) {
          event.preventDefault();
          onConfirmRef.current();
        }

        return;
      }

      if (event.key !== "Escape" && event.key !== "Backspace") {
        return;
      }

      event.preventDefault();
      onBackRef.current();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);

  useGamepadNavigation({
    enabled,
    onMove: () => undefined,
    onConfirm: () => onConfirmRef.current?.(),
    onBack: () => onBackRef.current(),
    onConnectedChange: setGamepadConnected,
  });

  return gamepadConnected;
};

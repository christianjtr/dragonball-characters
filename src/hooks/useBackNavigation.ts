import { useEffect, useRef, useState } from "react";
import { useGamepadNavigation } from "@hooks/useGamepadNavigation";

interface UseBackNavigationOptions {
  onBack: () => void;
  enabled?: boolean;
}

export const useBackNavigation = ({
  onBack,
  enabled = true,
}: UseBackNavigationOptions): boolean => {
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const onBackRef = useRef(onBack);

  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" && event.key !== "Backspace") {
        return;
      }

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

      event.preventDefault();
      onBackRef.current();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);

  useGamepadNavigation({
    enabled,
    onMove: () => undefined,
    onConfirm: () => undefined,
    onBack: () => onBackRef.current(),
    onConnectedChange: setGamepadConnected,
  });

  return gamepadConnected;
};

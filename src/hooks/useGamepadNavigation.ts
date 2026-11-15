import { useEffect, useRef } from "react";

interface UseGamepadNavigationOptions {
  enabled: boolean;
  onMove: (direction: "left" | "right" | "up" | "down") => void;
  onConfirm: () => void;
  onBack: () => void;
  onConnectedChange?: (connected: boolean) => void;
  onMoveHaptic?: () => void;
  onConfirmHaptic?: () => void;
}

const AXIS_THRESHOLD = 0.55;
const REPEAT_DELAY_MS = 190;

export const useGamepadNavigation = ({
  enabled,
  onMove,
  onConfirm,
  onBack,
  onConnectedChange,
  onMoveHaptic,
  onConfirmHaptic,
}: UseGamepadNavigationOptions): void => {
  const callbacks = useRef({
    onMove,
    onConfirm,
    onBack,
    onConnectedChange,
    onMoveHaptic,
    onConfirmHaptic,
  });
  const lastInputAt = useRef(0);
  const previousButtons = useRef(new Map<number, boolean>());
  const connected = useRef(false);

  useEffect(() => {
    callbacks.current = {
      onMove,
      onConfirm,
      onBack,
      onConnectedChange,
      onMoveHaptic,
      onConfirmHaptic,
    };
  }, [onMove, onConfirm, onBack, onConnectedChange, onMoveHaptic, onConfirmHaptic]);

  useEffect(() => {
    if (!enabled || !("getGamepads" in navigator)) {
      return;
    }

    let frame = 0;
    let disposed = false;
    let currentGamepadIndex: number | null = null;

    const updateConnection = (next: boolean) => {
      if (connected.current !== next) {
        connected.current = next;
        callbacks.current.onConnectedChange?.(next);
      }
    };

    const onConnected = (event: GamepadEvent) => {
      currentGamepadIndex = event.gamepad.index;
      previousButtons.current.clear();
      updateConnection(true);
    };

    const onDisconnected = (event: GamepadEvent) => {
      if (currentGamepadIndex === event.gamepad.index) {
        currentGamepadIndex = null;
        previousButtons.current.clear();
        updateConnection(false);
      }
    };

    const poll = (timestamp: number) => {
      if (disposed) return;

      const gamepads = navigator.getGamepads();
      const gamepad =
        (currentGamepadIndex === null ? null : gamepads[currentGamepadIndex]) ??
        Array.from(gamepads).find((candidate) => candidate?.connected) ??
        null;

      if (gamepad) {
        currentGamepadIndex = gamepad.index;
        updateConnection(true);
        const canMove = timestamp - lastInputAt.current >= REPEAT_DELAY_MS;
        const horizontal =
          (gamepad.axes[0] ?? 0) < -AXIS_THRESHOLD || gamepad.buttons[14]?.pressed
            ? "left"
            : (gamepad.axes[0] ?? 0) > AXIS_THRESHOLD || gamepad.buttons[15]?.pressed
              ? "right"
              : null;
        const vertical =
          (gamepad.axes[1] ?? 0) < -AXIS_THRESHOLD || gamepad.buttons[12]?.pressed
            ? "up"
            : (gamepad.axes[1] ?? 0) > AXIS_THRESHOLD || gamepad.buttons[13]?.pressed
              ? "down"
              : null;

        if (enabled && canMove && (horizontal || vertical)) {
          callbacks.current.onMove(horizontal ?? vertical!);
          callbacks.current.onMoveHaptic?.();
          lastInputAt.current = timestamp;
        }

        gamepad.buttons.forEach((button, index) => {
          const pressed = button.pressed;
          const wasPressed = previousButtons.current.get(index) ?? false;

          if (enabled && pressed && !wasPressed && index === 0) {
            callbacks.current.onConfirm();
            callbacks.current.onConfirmHaptic?.();
            lastInputAt.current = timestamp;
          } else if (enabled && pressed && !wasPressed && index === 1) {
            callbacks.current.onBack();
            lastInputAt.current = timestamp;
          }

          previousButtons.current.set(index, pressed);
        });
      } else {
        currentGamepadIndex = null;
        previousButtons.current.clear();
        updateConnection(false);
      }

      frame = window.requestAnimationFrame(poll);
    };

    window.addEventListener("gamepadconnected", onConnected);
    window.addEventListener("gamepaddisconnected", onDisconnected);
    frame = window.requestAnimationFrame(poll);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("gamepadconnected", onConnected);
      window.removeEventListener("gamepaddisconnected", onDisconnected);
      updateConnection(false);
    };
  }, [enabled]);
};

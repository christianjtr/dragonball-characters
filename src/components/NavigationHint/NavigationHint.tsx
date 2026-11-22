import React from "react";
import "./NavigationHint.css";

export type NavigationHintVariant = "menu" | "select" | "detail" | "versus";

interface NavigationHintProps {
  variant: NavigationHintVariant;
  compact?: boolean;
  gamepadConnected?: boolean;
  className?: string;
}

interface HintPart {
  keys: string[];
  label: string;
}

const HINT_PARTS: Record<NavigationHintVariant, HintPart[]> = {
  menu: [
    { keys: ["↑", "↓"], label: "mover" },
    { keys: ["Enter"], label: "elegir" },
    { keys: ["Esc"], label: "volver" },
  ],
  select: [
    { keys: ["Flechas / WASD"], label: "mover" },
    { keys: ["Enter / Space"], label: "elegir" },
    { keys: ["Esc"], label: "volver" },
  ],
  detail: [{ keys: ["Esc"], label: "volver a luchadores" }],
  versus: [{ keys: ["Esc"], label: "volver a luchadores" }],
};

export const NavigationHint: React.FC<NavigationHintProps> = ({
  variant,
  compact = false,
  gamepadConnected = false,
  className = "",
}) => {
  const classes = `navigation-hint${compact ? " navigation-hint--compact" : ""} ${className}`.trim();

  if (compact) {
    return (
      <p className={classes}>
        <span className="arcade-kbd">VOLVER</span> toca para regresar
        {gamepadConnected ? (
          <span className="navigation-hint__gamepad">Mando conectado</span>
        ) : null}
      </p>
    );
  }

  return (
    <p className={classes}>
      {HINT_PARTS[variant].map((part) => (
        <React.Fragment key={part.label}>
          {part.keys.map((key) => (
            <span className="arcade-kbd" key={key}>
              {key}
            </span>
          ))}{" "}
          {part.label}{" "}
        </React.Fragment>
      ))}
      {gamepadConnected ? (
        <span className="navigation-hint__gamepad">Mando conectado</span>
      ) : null}
    </p>
  );
};

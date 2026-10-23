import React from "react";
import { useArcadeSettings } from "@context/arcadeSettings";
import "./SoundToggle.css";

export const SoundToggle: React.FC = () => {
  const { soundEnabled, toggleSound } = useArcadeSettings();

  return (
    <button
      type="button"
      className={`sound-toggle ${soundEnabled ? "is-on" : ""}`}
      aria-pressed={soundEnabled}
      onClick={toggleSound}
      title={soundEnabled ? "Silenciar el sonido del arcade" : "Activar el sonido del arcade"}
    >
      <span className="sound-toggle__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="sound-toggle__label">
        SONIDO {soundEnabled ? "ON" : "OFF"}
      </span>
    </button>
  );
};

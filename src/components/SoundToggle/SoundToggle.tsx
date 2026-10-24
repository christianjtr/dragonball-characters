import React from "react";
import { useArcadeSettings } from "@context/arcadeSettings";
import "./SoundToggle.css";

export const SoundToggle: React.FC = () => {
  const { soundEnabled, toggleSound } = useArcadeSettings();

  return (
    <button
      type="button"
      className={`sound-toggle ${soundEnabled ? "is-on" : "is-off"}`}
      aria-pressed={soundEnabled}
      aria-label={
        soundEnabled
          ? "Silenciar el sonido del arcade"
          : "Activar el sonido del arcade"
      }
      onClick={toggleSound}
      title={soundEnabled ? "Silenciar el sonido del arcade" : "Activar el sonido del arcade"}
    >
      <span className="sound-toggle__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="sound-toggle__label">
        {soundEnabled ? "SILENCIAR" : "ACTIVAR AUDIO"}
      </span>
    </button>
  );
};

import React, { useCallback, useEffect, useRef } from "react";
import { useArcadeSettings } from "@context/arcadeSettings";
import { useArcadeAudio } from "@hooks/useArcadeAudio";
import "./ArcadeOptionsPanel.css";

interface ArcadeOptionsPanelProps {
  onClose: () => void;
}

export const ArcadeOptionsPanel: React.FC<ArcadeOptionsPanelProps> = ({
  onClose,
}) => {
  const { effectsEnabled, musicEnabled, toggleEffects, toggleMusic } =
    useArcadeSettings();
  const play = useArcadeAudio();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Backspace") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleToggleEffects = useCallback(() => {
    play("confirm");
    toggleEffects();
  }, [play, toggleEffects]);

  const handleToggleMusic = useCallback(() => {
    play("confirm");
    toggleMusic();
  }, [play, toggleMusic]);

  return (
    <div
      className="arcade-options__backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        className="arcade-options"
        role="dialog"
        aria-modal="true"
        aria-labelledby="arcade-options-title"
        tabIndex={-1}
      >
        <header className="arcade-options__header">
          <div>
            <p className="arcade-options__eyebrow">System Config</p>
            <h2 id="arcade-options-title" className="arcade-options__title">
              Options
            </h2>
          </div>
          <button
            type="button"
            className="arcade-options__close"
            aria-label="Cerrar opciones"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <div className="arcade-options__rows">
          <button
            type="button"
            className={`arcade-options__row ${effectsEnabled ? "is-on" : "is-off"}`}
            aria-pressed={effectsEnabled}
            onClick={handleToggleEffects}
          >
            <span className="arcade-options__row-copy">
              <span className="arcade-options__row-label">
                Efectos de sonido
              </span>
              <span className="arcade-options__row-description">
                Navegación, selección y cancelación.
              </span>
            </span>
            <span className="arcade-options__switch" aria-hidden="true">
              <span className="arcade-options__switch-knob" />
            </span>
          </button>

          <button
            type="button"
            className={`arcade-options__row ${musicEnabled ? "is-on" : "is-off"}`}
            aria-pressed={musicEnabled}
            onClick={handleToggleMusic}
          >
            <span className="arcade-options__row-copy">
              <span className="arcade-options__row-label">
                Música de fondo
              </span>
              <span className="arcade-options__row-description">
                Tema arcade en bucle durante la partida.
              </span>
            </span>
            <span className="arcade-options__switch" aria-hidden="true">
              <span className="arcade-options__switch-knob" />
            </span>
          </button>
        </div>

        <p className="arcade-options__note">
          Las preferencias se guardan en este dispositivo. El audio solo suena
          después de tu primera interacción.
        </p>

        <button
          type="button"
          className="arcade-options__back"
          onClick={onClose}
        >
          <span aria-hidden="true">←</span> Volver al menú
        </button>
      </div>
    </div>
  );
};

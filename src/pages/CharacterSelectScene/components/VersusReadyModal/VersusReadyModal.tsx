import React, { useEffect, useRef } from "react";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import { FighterPortrait } from "@components/FighterPortrait/FighterPortrait";
import { getCharacterAccent } from "@utils/characterTheme";
import { getRaceLabel } from "@utils/characterLabels";
import "./VersusReadyModal.css";

interface VersusReadyModalProps {
  p1: CharacterSummary;
  p2: CharacterSummary;
  onStart: () => void;
  onChangeP1: () => void;
  onChangeP2: () => void;
  onDismiss: () => void;
}

interface FighterSideProps {
  player: "P1" | "P2";
  character: CharacterSummary;
}

const FighterSide: React.FC<FighterSideProps> = ({ player, character }) => {
  const accent = getCharacterAccent(character.race);

  return (
    <div
      className="versus-ready-modal__fighter"
      style={{ "--fighter-accent": accent } as React.CSSProperties}
    >
      <span className="versus-ready-modal__player">{player}</span>
      <div className="versus-ready-modal__portrait">
        <FighterPortrait character={character} accent={accent} eager />
      </div>
      <h3 className="versus-ready-modal__name">{character.name}</h3>
      <p className="versus-ready-modal__race">{getRaceLabel(character.race)}</p>
    </div>
  );
};

export const VersusReadyModal: React.FC<VersusReadyModalProps> = ({
  p1,
  p2,
  onStart,
  onChangeP1,
  onChangeP2,
  onDismiss,
}) => {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    dialogRef.current
      ?.querySelector<HTMLButtonElement>('[data-autofocus="true"]')
      ?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled])",
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onDismiss]);

  return (
    <div className="versus-ready-modal__backdrop" onMouseDown={onDismiss}>
      <section
        ref={dialogRef}
        className="versus-ready-modal arcade-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="versus-ready-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="versus-ready-modal__topline">
          <span className="versus-ready-modal__badge">COMBATE LISTO</span>
          <button
            type="button"
            className="versus-ready-modal__close"
            onClick={onDismiss}
            aria-label="Cerrar aviso y volver a elegir"
          >
            ✕
          </button>
        </div>

        <h2 className="versus-ready-modal__title" id="versus-ready-modal-title">
          ¿Listo para el combate?
        </h2>

        <div className="versus-ready-modal__fighters">
          <FighterSide player="P1" character={p1} />
          <span className="versus-ready-modal__mark" aria-hidden="true">
            VS
          </span>
          <FighterSide player="P2" character={p2} />
        </div>

        <div className="versus-ready-modal__actions">
          <button
            type="button"
            className="versus-ready-modal__action versus-ready-modal__action--primary"
            data-autofocus="true"
            onClick={onStart}
          >
            INICIAR COMBATE
          </button>
          <div className="versus-ready-modal__secondary">
            <button
              type="button"
              className="versus-ready-modal__action versus-ready-modal__action--secondary"
              onClick={onChangeP1}
            >
              CAMBIAR P1
            </button>
            <button
              type="button"
              className="versus-ready-modal__action versus-ready-modal__action--secondary"
              onClick={onChangeP2}
            >
              CAMBIAR P2
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

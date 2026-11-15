import React from "react";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import { FighterPortrait } from "@components/FighterPortrait/FighterPortrait";
import { getCharacterAccent } from "@utils/characterTheme";
import { getRaceLabel } from "@utils/characterLabels";
import "./PlayerSelectCard.css";

interface PlayerSelectCardProps {
  player: "P1" | "P2";
  character?: CharacterSummary;
  active: boolean;
  onClear?: () => void;
}

export const PlayerSelectCard: React.FC<PlayerSelectCardProps> = ({
  player,
  character,
  active,
  onClear,
}) => {
  const accent = character ? getCharacterAccent(character.race) : "var(--arcade-line)";

  return (
    <article
      className={`player-select-card player-select-card--${player.toLowerCase()}${active ? " is-active" : ""}${character ? " is-ready" : ""}`}
      style={{ "--fighter-accent": accent } as React.CSSProperties}
      aria-label={`${player}${character ? `: ${character.name}` : ": sin seleccionar"}`}
      aria-current={active ? "step" : undefined}
    >
      <div className="player-select-card__topline">
        <span className="player-select-card__player">{player}</span>
        <span className="player-select-card__status">
          {character ? "LISTO" : active ? "ELIGE LUCHADOR" : "EN ESPERA"}
        </span>
      </div>
      <div className="player-select-card__portrait">
        {character ? (
          <FighterPortrait character={character} accent={accent} eager />
        ) : (
          <span className="player-select-card__placeholder" aria-hidden="true">
            ?
          </span>
        )}
        {character ? <span className="player-select-card__ready-mark">✓</span> : null}
      </div>
      <div className="player-select-card__identity">
        <h2>{character?.name ?? "Selecciona un luchador"}</h2>
        <p>{character ? getRaceLabel(character.race) : "Usa la cuadrícula"}</p>
      </div>
      {character && onClear ? (
        <button
          type="button"
          className="player-select-card__change"
          onClick={onClear}
          aria-label={`Cambiar luchador de ${player}`}
        >
          CAMBIAR
        </button>
      ) : null}
    </article>
  );
};

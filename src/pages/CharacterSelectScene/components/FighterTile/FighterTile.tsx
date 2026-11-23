import React from "react";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import { FighterPortrait } from "@components/FighterPortrait/FighterPortrait";
import { getCharacterAccent } from "@utils/characterTheme";
import { getRaceLabel } from "@utils/characterLabels";
import "./FighterTile.css";

interface FighterTileProps {
  character: CharacterSummary;
  isActive: boolean;
  isP1Selected: boolean;
  isP2Selected?: boolean;
  quickSelect: boolean;
  quickActionLabel: string;
  quickActionPlayer: "P1" | "P2";
  onActivate: (id: number) => void;
  onQuickSelect: (id: number) => void;
  onConfirm: (id: number) => void;
  onPrefetch: (id: number) => void;
}

const FighterTileComponent: React.FC<FighterTileProps> = ({
  character,
  isActive,
  isP1Selected,
  isP2Selected = false,
  quickSelect,
  quickActionLabel,
  quickActionPlayer,
  onActivate,
  onQuickSelect,
  onConfirm,
  onPrefetch,
}) => {
  const accent = getCharacterAccent(character.race);
  const raceLabel = getRaceLabel(character.race);

  const handleClick = () => {
    if (quickSelect) {
      if (isP1Selected) {
        onActivate(character.id);
        return;
      }

      onQuickSelect(character.id);
      return;
    }

    if (isActive) {
      onConfirm(character.id);
      return;
    }

    onActivate(character.id);
  };

  return (
    <button
      type="button"
      id={`fighter-tile-${character.id}`}
      className={`fighter-tile ${isActive ? "is-active" : ""}${isP1Selected ? " is-p1-selected" : ""}${isP2Selected ? " is-p2-selected" : ""}`}
      style={{ "--fighter-accent": accent } as React.CSSProperties}
      role="option"
      aria-selected={isActive}
      aria-label={
        quickSelect
          ? isP1Selected
            ? `${character.name}, ${raceLabel}, P1 listo`
            : `${character.name}, ${raceLabel}, ${quickActionLabel}`
          : undefined
      }
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
      onPointerEnter={() => onPrefetch(character.id)}
      onFocus={() => onPrefetch(character.id)}
    >
      {quickSelect ? (
        <span
          className={`fighter-tile__quick-action fighter-tile__quick-action--${quickActionPlayer.toLowerCase()}${isP1Selected ? " fighter-tile__quick-action--ready" : ""}`}
          aria-hidden="true"
        >
          {isP1Selected ? "P1 listo" : quickActionLabel}
        </span>
      ) : null}
      {isP1Selected || isP2Selected ? (
        <span
          className={`fighter-tile__player-mark${isP2Selected ? " fighter-tile__player-mark--p2" : ""}`}
          aria-hidden="true"
        >
          {isP2Selected ? "P2" : "P1"}
        </span>
      ) : null}
      <FighterPortrait character={character} accent={accent} alt="" />
      <span className="fighter-tile__name">{character.name}</span>
      <span className="fighter-tile__meta">{raceLabel}</span>
    </button>
  );
};

export const FighterTile = React.memo(FighterTileComponent);

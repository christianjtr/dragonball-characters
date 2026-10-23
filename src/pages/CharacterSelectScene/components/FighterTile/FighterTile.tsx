import React from "react";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import { FighterPortrait } from "@components/FighterPortrait/FighterPortrait";
import { getCharacterAccent } from "@utils/characterTheme";
import { getRaceLabel } from "@utils/characterLabels";
import "./FighterTile.css";

interface FighterTileProps {
  character: CharacterSummary;
  isActive: boolean;
  onActivate: (id: number) => void;
  onConfirm: (id: number) => void;
  onPrefetch: (id: number) => void;
}

const FighterTileComponent: React.FC<FighterTileProps> = ({
  character,
  isActive,
  onActivate,
  onConfirm,
  onPrefetch,
}) => {
  const accent = getCharacterAccent(character.race);

  const handleClick = () => {
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
      className={`fighter-tile ${isActive ? "is-active" : ""}`}
      style={{ "--fighter-accent": accent } as React.CSSProperties}
      role="option"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
      onPointerEnter={() => onPrefetch(character.id)}
      onFocus={() => onPrefetch(character.id)}
    >
      <span className="fighter-tile__star" aria-hidden="true">
        ★
      </span>
      <FighterPortrait character={character} accent={accent} alt="" />
      <span className="fighter-tile__name">{character.name}</span>
      <span className="fighter-tile__meta">{getRaceLabel(character.race)}</span>
    </button>
  );
};

export const FighterTile = React.memo(FighterTileComponent);

import React from "react";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import { FighterTile } from "../FighterTile/FighterTile";
import "./RosterGrid.css";

interface RosterGridProps {
  characters: CharacterSummary[];
  activeId?: number;
  gridRef: React.RefObject<HTMLDivElement | null>;
  onActivate: (id: number) => void;
  onConfirm: (id: number) => void;
  onPrefetch: (id: number) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const RosterGrid: React.FC<RosterGridProps> = ({
  characters,
  activeId,
  gridRef,
  onActivate,
  onConfirm,
  onPrefetch,
  onKeyDown,
}) => {
  return (
    <div
      ref={gridRef}
      className="roster-grid"
      role="listbox"
      aria-label="Lista de luchadores"
      onKeyDown={onKeyDown}
    >
      {characters.map((character) => (
        <FighterTile
          key={character.id}
          character={character}
          isActive={character.id === activeId}
          onActivate={onActivate}
          onConfirm={onConfirm}
          onPrefetch={onPrefetch}
        />
      ))}
    </div>
  );
};

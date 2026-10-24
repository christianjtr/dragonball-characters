import React from "react";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import { FighterTile } from "../FighterTile/FighterTile";
import "./RosterGrid.css";

interface RosterGridProps {
  characters: CharacterSummary[];
  activeId?: number;
  selectedP1Id?: number;
  gridRef: React.RefObject<HTMLDivElement | null>;
  quickSelect: boolean;
  quickActionLabel: string;
  quickActionPlayer: "P1" | "P2";
  onActivate: (id: number) => void;
  onQuickSelect: (id: number) => void;
  onConfirm: (id: number) => void;
  onPrefetch: (id: number) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const RosterGrid: React.FC<RosterGridProps> = ({
  characters,
  activeId,
  selectedP1Id,
  gridRef,
  quickSelect,
  quickActionLabel,
  quickActionPlayer,
  onActivate,
  onQuickSelect,
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
          isP1Selected={character.id === selectedP1Id}
          quickSelect={quickSelect}
          quickActionLabel={quickActionLabel}
          quickActionPlayer={quickActionPlayer}
          onActivate={onActivate}
          onQuickSelect={onQuickSelect}
          onConfirm={onConfirm}
          onPrefetch={onPrefetch}
        />
      ))}
    </div>
  );
};

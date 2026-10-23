import React, { useState } from "react";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import "./FighterPortrait.css";

interface FighterPortraitProps {
  character: Pick<CharacterSummary, "name" | "image">;
  accent?: string;
  eager?: boolean;
  alt?: string;
  className?: string;
}

const getInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const FighterPortrait: React.FC<FighterPortraitProps> = ({
  character,
  accent,
  eager = false,
  alt,
  className,
}) => {
  const [hasFailed, setHasFailed] = useState(false);
  const classes = ["fighter-portrait", className].filter(Boolean).join(" ");
  const style = accent
    ? ({ "--fighter-accent": accent } as React.CSSProperties)
    : undefined;

  return (
    <div className={classes} style={style}>
      {hasFailed ? (
        <span className="fighter-portrait__fallback" aria-hidden="true">
          {getInitials(character.name)}
        </span>
      ) : (
        <img
          className="fighter-portrait__image"
          src={character.image}
          alt={alt ?? character.name}
          loading={eager ? "eager" : "lazy"}
          onError={() => setHasFailed(true)}
        />
      )}
    </div>
  );
};

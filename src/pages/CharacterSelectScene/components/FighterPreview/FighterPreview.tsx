import React from "react";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import { ArcadeButton } from "@components/ArcadeButton/ArcadeButton";
import { FighterPortrait } from "@components/FighterPortrait/FighterPortrait";
import { getCharacterAccent } from "@utils/characterTheme";
import {
  getAffiliationLabel,
  getCharacterStatusLabel,
  getGenderLabel,
  getRaceLabel,
} from "@utils/characterLabels";
import "./FighterPreview.css";

interface FighterPreviewProps {
  character: CharacterSummary;
  actionLabel: string;
  onConfirm: () => void;
}

export const FighterPreview: React.FC<FighterPreviewProps> = ({
  character,
  actionLabel,
  onConfirm,
}) => {
  const accent = getCharacterAccent(character.race);

  return (
    <aside className="fighter-preview arcade-panel" aria-label="Vista previa del luchador">
      <div
        className="fighter-preview__portrait"
        style={{ "--fighter-accent": accent } as React.CSSProperties}
      >
        <FighterPortrait character={character} accent={accent} eager />
      </div>

      <div className="fighter-preview__body">
        <div className="fighter-preview__tags">
          <span className="fighter-preview__tag">
            {getRaceLabel(character.race)}
          </span>
          <span className="fighter-preview__tag">
            {getGenderLabel(character.gender)}
          </span>
          <span className="fighter-preview__tag">
            {getAffiliationLabel(character.affiliation)}
          </span>
        </div>

        <h2 className="fighter-preview__name">{character.name}</h2>

        <dl className="fighter-preview__stats">
          <div>
            <dt>Ki</dt>
            <dd>{character.ki}</dd>
          </div>
          <div>
            <dt>Ki máximo</dt>
            <dd>{character.maxKi}</dd>
          </div>
          <div>
            <dt>Estado</dt>
            <dd>{getCharacterStatusLabel(character.deletedAt)}</dd>
          </div>
        </dl>

        <p className="fighter-preview__description">{character.description}</p>

        <ArcadeButton className="fighter-preview__action" onClick={onConfirm}>
          {actionLabel}
        </ArcadeButton>
      </div>
    </aside>
  );
};

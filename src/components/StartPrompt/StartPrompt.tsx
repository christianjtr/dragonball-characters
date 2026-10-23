import React from "react";
import { ArcadeButton } from "@components/ArcadeButton/ArcadeButton";
import "./StartPrompt.css";

interface StartPromptProps {
  onStart: () => void;
  label?: string;
  hint?: string;
}

export const StartPrompt: React.FC<StartPromptProps> = ({
  onStart,
  label = "Empezar",
  hint = "Enter / Espacio / Toca",
}) => {
  return (
    <div className="start-prompt">
      <ArcadeButton
        className="start-prompt__button"
        onClick={onStart}
        aria-label={label}
      >
        {label}
      </ArcadeButton>
      <span className="start-prompt__hint">{hint}</span>
    </div>
  );
};

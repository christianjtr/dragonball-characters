import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { KameHouseScene } from "@components/KameHouseScene/KameHouseScene";
import { StartPrompt } from "@components/StartPrompt/StartPrompt";
import { useRoster } from "@context/rosterContext";
import { useArcadeAudio } from "@hooks/useArcadeAudio";
import { useDocumentTitle } from "@hooks/useDocumentTitle";
import "./AttractScene.css";

const isInteractiveTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return ["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"].includes(
    target.tagName,
  );
};

export default function AttractScene(): React.JSX.Element {
  const navigate = useNavigate();
  const { characters } = useRoster();
  const play = useArcadeAudio();

  useDocumentTitle("Dragonball Arcade | Inicio");

  const handleStart = useCallback(() => {
    play("confirm");
    navigate("/select");
  }, [navigate, play]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInteractiveTarget(event.target)) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleStart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleStart]);

  return (
    <section className="attract-scene" aria-labelledby="attract-heading">
      <div className="attract-scene__content">
        <p className="attract-scene__eyebrow">Arcade Kame House</p>

        <h1 id="attract-heading" className="attract-scene__title">
          <span className="attract-scene__logo-line attract-scene__logo-line--yellow">
            Dragonball
          </span>
          <span className="attract-scene__logo-line attract-scene__logo-line--red">
            Arcade
          </span>
        </h1>

        <p className="attract-scene__lede">
          Explora la lista completa de luchadores, consulta las estadísticas de
          cada uno y prepara un combate para dos jugadores.
        </p>

        <StartPrompt onStart={handleStart} />

        <p className="attract-scene__footnote">
          {characters.length > 0
            ? `${characters.length} luchadores listos`
            : "Sincronizando luchadores"}
        </p>
      </div>

      <figure className="attract-scene__art">
        <KameHouseScene />
        <figcaption className="attract-scene__caption">
          Kame House, en algún lugar del mar
        </figcaption>
      </figure>
    </section>
  );
}

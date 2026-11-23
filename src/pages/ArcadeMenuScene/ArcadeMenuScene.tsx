import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
import {
  ArcadeMenuList,
  type ArcadeMenuItem,
} from "@components/ArcadeMenuList/ArcadeMenuList";
import { ArcadeOptionsPanel } from "@components/ArcadeOptionsPanel/ArcadeOptionsPanel";
import { KameHouseScene } from "@components/KameHouseScene/KameHouseScene";
import { NavigationHint } from "@components/NavigationHint/NavigationHint";
import { useRoster } from "@context/rosterContext";
import { useArcadeAudio } from "@hooks/useArcadeAudio";
import { useDocumentTitle } from "@hooks/useDocumentTitle";
import { useReducedMotion } from "@hooks/useReducedMotion";
import DragonballLogo from "@assets/dragon-ball.svg";
import Goku from "@assets/goku.gif";
import "./ArcadeMenuScene.css";

interface ArcadeMenuEntry extends ArcadeMenuItem {
  path?: string;
}

const MENU_ENTRIES: ArcadeMenuEntry[] = [
  {
    id: "play",
    label: "Jugar",
    description: "Elige luchadores y entra a la arena.",
    accent: "orange",
    path: "/select",
  },
  {
    id: "options",
    label: "Opciones",
    description: "Sonido y preferencias del arcade.",
    accent: "gold",
  },
];

const TRANSITION_DELAY_MS = 220;
const HERO_ROTATION_MS = 6500;
const HERO_NAMES = ["goku", "vegeta", "freezer", "gohan"];

export default function ArcadeMenuScene(): React.JSX.Element {
  const navigate = useNavigate();
  const { characters } = useRoster();
  const play = useArcadeAudio();
  const reducedMotion = useReducedMotion();

  useDocumentTitle("Dragonball Arcade | Menú principal");

  const [activeIndex, setActiveIndex] = useState(0);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [failedArtIds, setFailedArtIds] = useState<number[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);

  const activeIndexRef = useRef(0);
  const transitionTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      window.clearTimeout(transitionTimer.current);
    };
  }, []);

  const heroFighters = useMemo(() => {
    const preferred = HERO_NAMES.map((name) =>
      characters.find((character) =>
        character.name.toLowerCase().includes(name),
      ),
    ).filter((character) => character !== undefined);

    const unique = [...preferred, ...characters].filter(
      (character, index, list) =>
        list.findIndex((candidate) => candidate.id === character.id) === index,
    );

    return unique.slice(0, 4);
  }, [characters]);

  const heroFighter = heroFighters[heroIndex % heroFighters.length];

  useEffect(() => {
    setHeroIndex(0);
  }, [heroFighters]);

  useEffect(() => {
    if (reducedMotion || optionsOpen || heroFighters.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setHeroIndex((index) => (index + 1) % heroFighters.length);
    }, HERO_ROTATION_MS);

    return () => window.clearInterval(interval);
  }, [heroFighters.length, optionsOpen, reducedMotion]);

  const handleActiveChange = useCallback(
    (index: number) => {
      if (index === activeIndexRef.current) {
        return;
      }

      activeIndexRef.current = index;
      setActiveIndex(index);
      play("move");
    },
    [play],
  );

  const handleCloseOptions = useCallback(() => {
    play("back");
    setOptionsOpen(false);
    window.setTimeout(() => {
      document
        .getElementById("arcade-main-menu")
        ?.focus({ preventScroll: true });
    }, 0);
  }, [play]);

  const goTo = useCallback(
    (path: string) => {
      play("confirm");

      if (reducedMotion) {
        navigate(path);
        return;
      }

      setIsTransitioning(true);
      transitionTimer.current = window.setTimeout(() => {
        navigate(path);
      }, TRANSITION_DELAY_MS);
    },
    [navigate, play, reducedMotion],
  );

  const handleSelect = useCallback(
    (index: number) => {
      if (isTransitioning) {
        return;
      }

      const entry = MENU_ENTRIES[index];

      if (!entry) {
        return;
      }

      if (entry.id === "options") {
        play("confirm");
        setOptionsOpen(true);
        return;
      }

      if (entry.path) {
        goTo(entry.path);
      }
    },
    [goTo, isTransitioning, play],
  );

  const handleBack = useCallback(() => {
    play("back");
  }, [play]);

  const artSource =
    heroFighter && !failedArtIds.includes(heroFighter.id) && heroFighter.image
      ? heroFighter.image
      : Goku;

  const handleArtError = useCallback(() => {
    if (!heroFighter) return;
    setFailedArtIds((previous) =>
      previous.includes(heroFighter.id)
        ? previous
        : [...previous, heroFighter.id],
    );
  }, [heroFighter]);

  const statusLabel =
    characters.length > 0
      ? `${characters.length} luchadores listos`
      : "Sincronizando luchadores";

  return (
    <section
      className={`arcade-menu ${isTransitioning ? "is-transitioning" : ""}`}
      aria-labelledby="arcade-menu-heading"
    >
      <div className="arcade-menu__body">
        <div className="arcade-menu__art">
          <div className="arcade-menu__stage">
            <KameHouseScene
              className="arcade-menu__stage-scene"
              preserveAspectRatio="xMidYMid slice"
            />
            <span className="arcade-menu__stage-glow" aria-hidden="true" />
            <img
              key={heroFighter?.id ?? "fallback"}
              className="arcade-menu__fighter"
              src={artSource}
              alt={heroFighter?.name ?? "Goku"}
              loading="eager"
              onError={handleArtError}
            />
            <span className="arcade-menu__scrim" aria-hidden="true" />
          </div>
        </div>

        <div className="arcade-menu__overlay">
          <div className="arcade-menu__intro">
            <div className="arcade-menu__heading">
              <h1 id="arcade-menu-heading" className="arcade-menu__title">
                <img
                  src={DragonballLogo}
                  alt=""
                  className="arcade-menu__title-ball"
                  aria-hidden="true"
                />
                <span className="arcade-menu__title-main">
                  Dragonball Arcade
                </span>
              </h1>
              <p className="arcade-menu__lede">
                Elige a tu luchador, ajusta el sonido y entra a la arena.
              </p>
            </div>
          </div>

          <div className="arcade-menu__controls">
            <ArcadeMenuList
              items={MENU_ENTRIES}
              activeIndex={activeIndex}
              onActiveChange={handleActiveChange}
              onSelect={handleSelect}
              onBack={handleBack}
            />

            <div className="arcade-menu__control-bar">
              <p className="arcade-menu__status" aria-live="polite">
                {statusLabel}
              </p>
              <NavigationHint variant="menu" />
            </div>
          </div>
        </div>
      </div>

      {isTransitioning ? (
        <div className="arcade-menu__transition" aria-hidden="true" />
      ) : null}

      {optionsOpen ? (
        <ArcadeOptionsPanel onClose={handleCloseOptions} />
      ) : null}
    </section>
  );
}

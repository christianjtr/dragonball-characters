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
    label: "Play",
    description: "Select fighters and enter the arena.",
    accent: "orange",
    path: "/select",
  },
  {
    id: "options",
    label: "Options",
    description: "Sound and arcade preferences.",
    accent: "gold",
  },
];

const TRANSITION_DELAY_MS = 220;

export default function ArcadeMenuScene(): React.JSX.Element {
  const navigate = useNavigate();
  const { characters } = useRoster();
  const play = useArcadeAudio();
  const reducedMotion = useReducedMotion();

  useDocumentTitle("Dragonball Arcade | Main Menu");

  const [activeIndex, setActiveIndex] = useState(0);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [artFailed, setArtFailed] = useState(false);

  const activeIndexRef = useRef(0);
  const transitionTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      window.clearTimeout(transitionTimer.current);
    };
  }, []);

  const featuredFighter = useMemo(() => {
    if (characters.length === 0) {
      return undefined;
    }

    return (
      characters.find((character) =>
        character.name.toLowerCase().includes("goku"),
      ) ?? characters[0]
    );
  }, [characters]);

  useEffect(() => {
    setArtFailed(false);
  }, [featuredFighter?.id]);

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
    !artFailed && featuredFighter?.image ? featuredFighter.image : Goku;
  const statusLabel =
    characters.length > 0
       ? `${characters.length} fighters ready`
       : "Syncing fighters";

  return (
    <section
      className={`arcade-menu ${isTransitioning ? "is-transitioning" : ""}`}
      aria-labelledby="arcade-menu-heading"
    >
      <div className="arcade-menu__intro">
        <div className="arcade-menu__heading">
          <h1 id="arcade-menu-heading" className="arcade-menu__title">
            <img
              src={DragonballLogo}
              alt=""
              className="arcade-menu__title-ball"
              aria-hidden="true"
            />
            <span className="arcade-menu__title-kicker">Dragonball</span>
            <span className="arcade-menu__title-main">Arcade</span>
          </h1>
          <p className="arcade-menu__lede">
            One way in. Choose how you want to play on the fighter select screen.
          </p>
        </div>

        <div className="arcade-menu__intro-meta">
          <p className="arcade-menu__status" aria-live="polite">
            {statusLabel}
          </p>
          <p className="arcade-menu__hint">
            <span className="arcade-kbd">↑</span>
            <span className="arcade-kbd">↓</span> move
            <span className="arcade-kbd">Enter</span> choose
            <span className="arcade-kbd">Esc</span> back
          </p>
        </div>
      </div>

      <div className="arcade-menu__body">
        <figure className="arcade-menu__art">
          <div className="arcade-menu__stage">
            <KameHouseScene className="arcade-menu__stage-scene" />
            <span className="arcade-menu__stage-glow" aria-hidden="true" />
            <img
              className="arcade-menu__fighter"
              src={artSource}
              alt={featuredFighter ? featuredFighter.name : "Goku"}
              loading="eager"
              onError={() => setArtFailed(true)}
            />
            <span className="arcade-menu__stage-tag">
              Kame House // Sector 7
            </span>
          </div>
          <figcaption className="arcade-menu__caption">
            Choose your next destination, warrior.
          </figcaption>
        </figure>

        <div className="arcade-menu__panel">
          <p className="arcade-menu__eyebrow">★ Main Menu // Player 1</p>

          <ArcadeMenuList
            items={MENU_ENTRIES}
            activeIndex={activeIndex}
            onActiveChange={handleActiveChange}
            onSelect={handleSelect}
            onBack={handleBack}
          />

          <p className="arcade-menu__tagline">
            Insert coin · {characters.length > 0 ? "Ready" : "Loading"}
          </p>
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

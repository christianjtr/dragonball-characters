import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ARCADE_CONFIG } from "@config/arcadeConfig";
import { Skeleton } from "@components/Skeleton/Skeleton";
import { StatusPanel } from "@components/StatusPanel/StatusPanel";
import { useRoster } from "@context/rosterContext";
import { useArcadeAudio } from "@hooks/useArcadeAudio";
import { useDocumentTitle } from "@hooks/useDocumentTitle";
import { useGridColumns } from "@hooks/useGridColumns";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { useGamepadNavigation } from "@hooks/useGamepadNavigation";
import { useRosterNavigation } from "@hooks/useRosterNavigation";
import {
  buildRosterParams,
  parseRosterQuery,
  type RosterQuery,
} from "@utils/rosterQuery";
import { buildRosterView } from "@utils/rosterSort";
import { getAffiliationLabel, getRaceLabel } from "@utils/characterLabels";
import DragonballLogo from "@assets/dragon-ball.svg";
import {
  FighterPreview,
  PlayerSelectCard,
  ReadyBanner,
  RecruiterCard,
  RosterFilterBar,
  RosterGrid,
} from "./components";
import "./CharacterSelectScene.css";

const SKELETON_TILES = Array.from({ length: 12 }, (_, index) => index);
const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

export default function CharacterSelectScene(): React.JSX.Element {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { characters, byId, details, status, prefetchDetail, reload } = useRoster();
  const play = useArcadeAudio();

  useDocumentTitle("Elige tu luchador | Dragonball Arcade");

  const query = useMemo(() => parseRosterQuery(searchParams), [searchParams]);
  const deferredSearch = useDeferredValue(query.search);
  const view = useMemo(
    () =>
      buildRosterView(characters, {
        search: deferredSearch,
        race: query.race,
        affiliation: query.affiliation,
        sort: query.sort,
      }),
    [characters, deferredSearch, query.race, query.affiliation, query.sort],
  );

  const [versusMode, setVersusMode] = useState(
    () => searchParams.get("versus") === "1",
  );
  const [p1Id, setP1Id] = useState<number | null>(null);
  const [p2Id, setP2Id] = useState<number | null>(null);
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const [showRecruiterCard, setShowRecruiterCard] = useState(false);
  const konamiProgress = useRef(0);

  const gridRef = useRef<HTMLDivElement>(null);
  const columns = useGridColumns(gridRef);
  const isCompact = useMediaQuery("(max-width: 980px)");
  const shouldFocus = useRef(true);
  const prefetchTimer = useRef<number | undefined>(undefined);

  const activeCharacter = useMemo(() => {
    if (view.length === 0) {
      return undefined;
    }

    const focused = query.focus
      ? view.find((character) => character.id === query.focus)
      : undefined;

    return focused ?? view[0];
  }, [query.focus, view]);

  useEffect(() => {
    if (versusMode && activeCharacter) {
      void prefetchDetail(activeCharacter.id);
    }
  }, [activeCharacter, prefetchDetail, versusMode]);

  const activeDetail = activeCharacter
    ? details[activeCharacter.id]?.data
    : undefined;

  const p1Character = p1Id ? byId.get(p1Id) : undefined;
  const p2Character = p2Id ? byId.get(p2Id) : undefined;
  const activePlayer = versusMode && p1Id && !p2Id ? "P2" : "P1";

  useEffect(() => {
    return () => {
      window.clearTimeout(prefetchTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!shouldFocus.current || !activeCharacter) {
      return;
    }

    const tile = document.getElementById(
      `fighter-tile-${activeCharacter.id}`,
    );

    tile?.focus({ preventScroll: true });
    tile?.scrollIntoView({ block: "nearest", inline: "nearest" });
    shouldFocus.current = false;
  }, [activeCharacter]);

  const updateQuery = useCallback(
    (patch: Partial<RosterQuery>) => {
      setSearchParams((previous) => buildRosterParams(previous, patch), {
        replace: true,
      });
    },
    [setSearchParams],
  );

  const handleActivate = useCallback(
    (id: number) => {
      shouldFocus.current = true;
      updateQuery({ focus: id });
      play("move");
    },
    [play, updateQuery],
  );

  const handlePrefetch = useCallback(
    (id: number) => {
      window.clearTimeout(prefetchTimer.current);
      prefetchTimer.current = window.setTimeout(() => {
        void prefetchDetail(id);
      }, ARCADE_CONFIG.detail.prefetchDelayMs);
    },
    [prefetchDetail],
  );

  const handleConfirm = useCallback(
    (id?: number) => {
      const targetId = id ?? activeCharacter?.id;

      if (!targetId) {
        return;
      }

      if (versusMode) {
        if (!p1Id) {
          setP1Id(targetId);
          updateQuery({ focus: view.find((character) => character.id !== targetId)?.id });
          play("lock-in");
          return;
        }

        if (targetId === p1Id || targetId === p2Id) {
          play("error");
          return;
        }

        setP2Id(targetId);
        play("transform");
        return;
      }

      play("lock-in");
      navigate(`/fighters/${targetId}`);
    },
    [activeCharacter?.id, navigate, p1Id, p2Id, play, updateQuery, view, versusMode],
  );

  const handleStartFight = useCallback(() => {
    if (p1Id && p2Id) {
      play("confirm");
      navigate(`/versus/${p1Id}/${p2Id}`);
    }
  }, [navigate, p1Id, p2Id, play]);

  const handleQuickSelect = useCallback(
    (id: number) => {
      shouldFocus.current = true;
      updateQuery({ focus: id });
      handleConfirm(id);
    },
    [handleConfirm, updateQuery],
  );

  const handleEscape = useCallback(() => {
    play("back");

    if (p2Id) {
      setP2Id(null);
      return;
    }

    if (p1Id) {
      setP1Id(null);
      return;
    }

    if (versusMode) {
      setVersusMode(false);
      setSearchParams(
        (previous) => {
          const params = new URLSearchParams(previous);
          params.delete("versus");
          return params;
        },
        { replace: true },
      );
      return;
    }

    navigate("/");
  }, [navigate, p1Id, p2Id, play, setSearchParams, versusMode]);

  const handleClear = useCallback(() => {
    const params = new URLSearchParams();

    if (versusMode) {
      params.set("versus", "1");
    }

    setSearchParams(params, { replace: true });
    play("back");
  }, [play, setSearchParams, versusMode]);

  const handleToggleVersus = useCallback(() => {
    const next = !versusMode;

    setP1Id(null);
    setP2Id(null);

    setVersusMode(next);
    setSearchParams(
      (previous) => {
        const params = new URLSearchParams(previous);

        if (next) {
          params.set("versus", "1");
        } else {
          params.delete("versus");
        }

        return params;
      },
      { replace: true },
    );
    play("move");
  }, [play, setSearchParams, versusMode]);

  const { activeIndex: keyboardActiveIndex, handleKeyDown } = useRosterNavigation({
    items: view,
    columns,
    activeId: activeCharacter?.id,
    onFocusChange: handleActivate,
    onConfirm: () => (p2Character ? handleStartFight() : handleConfirm()),
    onEscape: handleEscape,
  });
  const activeIndex = keyboardActiveIndex;

  const handleGamepadMove = useCallback(
    (direction: "left" | "right" | "up" | "down") => {
      const offsets = {
        left: -1,
        right: 1,
        up: -columns,
        down: columns,
      };
      const nextIndex = Math.max(
        0,
        Math.min(view.length - 1, activeIndex + offsets[direction]),
      );
      const character = view[nextIndex];

      if (character && character.id !== activeCharacter?.id) {
        handleActivate(character.id);
      }
    },
    [activeCharacter?.id, activeIndex, columns, handleActivate, view],
  );

  const pulseGamepad = useCallback((duration: number, strong: number, weak: number) => {
    if (!("getGamepads" in navigator)) return;
    const gamepad = Array.from(navigator.getGamepads()).find((candidate) => candidate?.connected);
    const actuator = gamepad?.vibrationActuator;

    if (actuator && "playEffect" in actuator) {
      void actuator
        .playEffect("dual-rumble", {
          duration,
          strongMagnitude: strong,
          weakMagnitude: weak,
        })
        .catch(() => undefined);
    }
  }, []);

  useGamepadNavigation({
    enabled: true,
    onMove: handleGamepadMove,
    onConfirm: () => (p2Character ? handleStartFight() : handleConfirm()),
    onBack: handleEscape,
    onConnectedChange: setGamepadConnected,
    onMoveHaptic: () => pulseGamepad(35, 0.15, 0.22),
    onConfirmHaptic: () => pulseGamepad(95, 0.48, 0.62),
  });

  const handleKonamiKey = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const expected = KONAMI_SEQUENCE[konamiProgress.current];
      const pressed = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (pressed === "b" || pressed === "a") {
        event.preventDefault();
      }

      if (pressed === expected) {
        konamiProgress.current += 1;
        if (konamiProgress.current === KONAMI_SEQUENCE.length) {
          setShowRecruiterCard(true);
          konamiProgress.current = 0;
          play("transform");
        }
      } else {
        konamiProgress.current = pressed === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    },
    [play],
  );

  const actionLabel = versusMode
    ? p2Character
      ? "Iniciar combate"
      : `Confirmar ${activePlayer}`
    : "Confirmar luchador";

  const quickSelect = versusMode && isCompact && !p2Id;
  const quickActionPlayer = p1Id ? "P2" : "P1";
  const quickActionLabel = `Elegir ${quickActionPlayer}`;
  const lede = isCompact
    ? versusMode
      ? p2Character
        ? "¡Combate listo! Confirma para comenzar."
        : `Elige a ${activePlayer} tocando una tarjeta.`
      : "Toca una tarjeta para ver su ficha; vuelve a tocarla para confirmar."
    : `${versusMode ? `Elige un luchador para ${activePlayer}. ` : ""}Usa flechas o WASD para moverte, Enter o Espacio para elegir${gamepadConnected ? ", o usa tu mando" : ""}.`;

  const isInitialLoading =
    (status === "idle" || status === "loading") && characters.length === 0;

  return (
    <section
      className={`select-scene${versusMode ? " select-scene--arcade-versus" : ""}`}
      aria-labelledby="select-heading"
      onKeyDownCapture={handleKonamiKey}
    >
      <div className="select-scene__intro">
        <div className="select-scene__heading">
          <h1 id="select-heading" className="select-scene__title">
            <img
              src={DragonballLogo}
              alt=""
              className="select-scene__title-ball"
              aria-hidden="true"
            />
            <span className="select-scene__title-kicker">Elige tu</span>
            <span className="select-scene__title-main">Luchador</span>
          </h1>
          <p className="select-scene__lede">{lede}</p>
        </div>
        {!isCompact ? (
          <p className="select-scene__hint">
            <span className="arcade-kbd">Flechas / WASD</span> mover
            <span className="arcade-kbd">Enter / Space</span> elegir
            <span className="arcade-kbd">Esc</span> volver
            {gamepadConnected ? <span className="select-scene__gamepad">Mando conectado</span> : null}
          </p>
        ) : null}
      </div>

      {!versusMode ? (
        <>
          <div className="select-scene__toolbar">
            <RosterFilterBar
              query={query}
              resultCount={view.length}
              totalCount={characters.length}
              versusMode={false}
              onChange={updateQuery}
              onClear={handleClear}
              onToggleVersus={handleToggleVersus}
            />
          </div>
        </>
      ) : null}

      {!versusMode && p1Character ? (
        <ReadyBanner player="P1" name={p1Character.name} />
      ) : null}

      {isInitialLoading ? (
        <div className="select-scene__stage">
          <div className="roster-grid" aria-hidden="true">
            {SKELETON_TILES.map((tile) => (
              <div
                className="select-scene__skeleton-tile"
                key={`skeleton_tile_${tile}`}
              >
                <Skeleton style={{ aspectRatio: "1 / 1", height: "auto" }} />
                <Skeleton style={{ height: "0.9rem", width: "70%" }} />
              </div>
            ))}
          </div>
          <div
            className="select-scene__skeleton-preview arcade-panel"
            aria-hidden="true"
          >
            <Skeleton style={{ height: "200px" }} />
            <Skeleton style={{ height: "1.4rem", width: "60%" }} />
            <Skeleton style={{ height: "0.8rem" }} />
            <Skeleton style={{ height: "0.8rem" }} />
          </div>
          <p className="visually-hidden" role="status">
            Cargando la lista de luchadores
          </p>
        </div>
      ) : status === "error" && characters.length === 0 ? (
        <StatusPanel
          tone="error"
          title="Lista no disponible"
          message="No se pudo cargar la lista de luchadores. Revisa tu conexión e inténtalo de nuevo."
          actionLabel="Reintentar"
          onAction={reload}
        />
      ) : view.length === 0 ? (
        <StatusPanel
          title="No se encontraron luchadores"
          message="Ningún luchador coincide con esos filtros. Límpialos para ver la lista completa."
          actionLabel="Limpiar filtros"
          onAction={handleClear}
        />
      ) : (
        <div className="select-scene__stage">
          <RosterGrid
            characters={view}
              activeId={activeCharacter?.id}
            selectedP1Id={p1Id ?? undefined}
            selectedP2Id={p2Id ?? undefined}
            gridRef={gridRef}
            quickSelect={quickSelect}
            quickActionLabel={quickActionLabel}
            quickActionPlayer={quickActionPlayer}
            onActivate={handleActivate}
            onQuickSelect={handleQuickSelect}
            onConfirm={handleConfirm}
            onPrefetch={handlePrefetch}
              onKeyDown={handleKeyDown}
              auraActive={versusMode && Boolean(activeDetail?.transformations.length)}
            />
          {activeCharacter && !versusMode ? (
            <FighterPreview
              character={activeCharacter}
              actionLabel={actionLabel}
              onConfirm={() => handleConfirm()}
            />
          ) : null}
        </div>
      )}

      {versusMode ? (
        <div className="select-scene__players" aria-label="Selección de jugadores">
          <PlayerSelectCard
            player="P1"
            character={p1Character}
            active={activePlayer === "P1"}
            onClear={p1Id ? () => { setP1Id(null); setP2Id(null); } : undefined}
          />
          <div className="select-scene__versus-mark" aria-hidden="true">VS</div>
          <PlayerSelectCard
            player="P2"
            character={p2Character}
            active={activePlayer === "P2"}
            onClear={p2Id ? () => setP2Id(null) : undefined}
          />
          {p2Character ? (
            <button
              type="button"
              className="select-scene__start-fight arcade-button"
              onClick={handleStartFight}
            >
              INICIAR COMBATE
            </button>
          ) : null}
        </div>
      ) : null}

      <p className="visually-hidden" aria-live="polite">
        {activeCharacter
          ? `${activeCharacter.name}. ${getRaceLabel(activeCharacter.race)}. ${getAffiliationLabel(activeCharacter.affiliation)}.`
          : ""}
      </p>
      {showRecruiterCard ? (
        <RecruiterCard onClose={() => setShowRecruiterCard(false)} />
      ) : null}
    </section>
  );
}

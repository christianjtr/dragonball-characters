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
import { useRosterNavigation } from "@hooks/useRosterNavigation";
import {
  buildRosterParams,
  parseRosterQuery,
  type RosterQuery,
} from "@utils/rosterQuery";
import { buildRosterView } from "@utils/rosterSort";
import { getAffiliationLabel, getRaceLabel } from "@utils/characterLabels";
import {
  FighterPreview,
  ReadyBanner,
  RosterFilterBar,
  RosterGrid,
} from "./components";
import "./CharacterSelectScene.css";

const SKELETON_TILES = Array.from({ length: 12 }, (_, index) => index);

export default function CharacterSelectScene(): React.JSX.Element {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { characters, byId, status, prefetchDetail, reload } = useRoster();
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

  const [versusMode, setVersusMode] = useState(false);
  const [p1Id, setP1Id] = useState<number | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const columns = useGridColumns(gridRef);
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

  const p1Character = p1Id ? byId.get(p1Id) : undefined;

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

      play("confirm");

      if (!versusMode) {
        navigate(`/fighters/${targetId}`);
        return;
      }

      if (!p1Id) {
        setP1Id(targetId);
        return;
      }

      navigate(`/versus/${p1Id}/${targetId}`);
    },
    [activeCharacter?.id, navigate, p1Id, play, versusMode],
  );

  const handleEscape = useCallback(() => {
    play("back");

    if (p1Id) {
      setP1Id(null);
      return;
    }

    if (versusMode) {
      setVersusMode(false);
      return;
    }

    navigate("/");
  }, [navigate, p1Id, play, versusMode]);

  const handleClear = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
    play("back");
  }, [play, setSearchParams]);

  const handleToggleVersus = useCallback(() => {
    if (versusMode) {
      setP1Id(null);
    }

    setVersusMode(!versusMode);
    play("move");
  }, [play, versusMode]);

  const { handleKeyDown } = useRosterNavigation({
    items: view,
    columns,
    activeId: activeCharacter?.id,
    onFocusChange: handleActivate,
    onConfirm: () => handleConfirm(),
    onEscape: handleEscape,
  });

  const actionLabel = versusMode
    ? p1Character
      ? "Elegir como P2"
      : "Elegir como P1"
    : "Confirmar luchador";

  const isInitialLoading =
    (status === "idle" || status === "loading") && characters.length === 0;

  return (
    <section className="select-scene" aria-labelledby="select-heading">
      <div className="select-scene__intro">
        <div>
          <h1 id="select-heading">Elige tu luchador</h1>
          <p className="select-scene__lede">
            {versusMode ? "Elige un luchador para P1 y luego para P2. " : ""}
            Usa las flechas para moverte, Enter para confirmar y Escape para
            volver.
          </p>
        </div>
        <p className="select-scene__hint">
          <span className="arcade-kbd">Flechas</span> mover
          <span className="arcade-kbd">Enter</span> elegir
          <span className="arcade-kbd">Esc</span> volver
        </p>
      </div>

      <RosterFilterBar
        query={query}
        resultCount={view.length}
        totalCount={characters.length}
        versusMode={versusMode}
        onChange={updateQuery}
        onClear={handleClear}
        onToggleVersus={handleToggleVersus}
      />

      {p1Character ? (
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
            gridRef={gridRef}
            onActivate={handleActivate}
            onConfirm={handleConfirm}
            onPrefetch={handlePrefetch}
            onKeyDown={handleKeyDown}
          />
          {activeCharacter ? (
            <FighterPreview
              character={activeCharacter}
              actionLabel={actionLabel}
              onConfirm={() => handleConfirm()}
            />
          ) : null}
        </div>
      )}

      <p className="visually-hidden" aria-live="polite">
        {activeCharacter
          ? `${activeCharacter.name}. ${getRaceLabel(activeCharacter.race)}. ${getAffiliationLabel(activeCharacter.affiliation)}.`
          : ""}
      </p>
    </section>
  );
}

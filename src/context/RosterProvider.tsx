import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ARCADE_CONFIG } from "@config/arcadeConfig";
import { DragonballCharactersService } from "@services/apis/dragonball/characters.services";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import {
  RosterContext,
  type DetailEntry,
  type RosterContextValue,
  type RosterStatus,
} from "./rosterContext";

interface RosterProviderProps {
  children: React.ReactNode;
}

interface RosterCache {
  data: CharacterSummary[];
  cachedAt: number;
}

let rosterCache: RosterCache | null = null;

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === "AbortError";

export const RosterProvider: React.FC<RosterProviderProps> = ({ children }) => {
  const [characters, setCharacters] = useState<CharacterSummary[]>(
    () => rosterCache?.data ?? [],
  );
  const [status, setStatus] = useState<RosterStatus>(() =>
    rosterCache ? "ready" : "idle",
  );
  const [error, setError] = useState<unknown>();
  const [details, setDetails] = useState<Record<number, DetailEntry>>({});

  const detailsRef = useRef<Record<number, DetailEntry>>({});
  const inflightRef = useRef(new Map<number, Promise<void>>());

  const load = useCallback(
    async (signal?: AbortSignal, options?: { force?: boolean }) => {
      const cached = rosterCache;
      const isFresh =
        cached !== null &&
        Date.now() - cached.cachedAt < ARCADE_CONFIG.roster.cacheTtlMs;

      if (cached && isFresh && !options?.force) {
        setCharacters(cached.data);
        setStatus("ready");
        return;
      }

      setStatus((previous) => (previous === "ready" ? previous : "loading"));
      setError(undefined);

      try {
        const items = await DragonballCharactersService.getAllRoster({ signal });
        rosterCache = { data: items, cachedAt: Date.now() };
        setCharacters(items);
        setStatus("ready");
        setError(undefined);
      } catch (loadError) {
        if (isAbortError(loadError)) {
          return;
        }

        setError(loadError);
        setStatus((previous) => (previous === "ready" ? previous : "error"));
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);

    return () => {
      controller.abort();
    };
  }, [load]);

  const reload = useCallback(() => {
    void load(undefined, { force: true });
  }, [load]);

  const commitDetail = useCallback((id: number, entry: DetailEntry) => {
    detailsRef.current = { ...detailsRef.current, [id]: entry };
    setDetails(detailsRef.current);
  }, []);

  const prefetchDetail = useCallback(
    (
      id: number,
      options?: { force?: boolean; priority?: boolean },
    ): Promise<void> => {
      const numericId = Number(id);

      if (!Number.isFinite(numericId)) {
        return Promise.resolve();
      }

      const existing = detailsRef.current[numericId];
      const isFresh =
        existing?.status === "ready" &&
        Date.now() - existing.requestedAt < ARCADE_CONFIG.detail.cacheTtlMs;

      if (isFresh && !options?.force) {
        return Promise.resolve();
      }

      const inflight = inflightRef.current.get(numericId);

      if (inflight) {
        return inflight;
      }

      if (
        !options?.priority &&
        inflightRef.current.size >= ARCADE_CONFIG.detail.maxConcurrentPrefetches
      ) {
        return Promise.resolve();
      }

      const request = (async () => {
        commitDetail(numericId, {
          status: "loading",
          data: existing?.data,
          requestedAt: Date.now(),
        });

        try {
          const data = await DragonballCharactersService.getById(numericId);
          commitDetail(numericId, {
            status: "ready",
            data,
            requestedAt: Date.now(),
          });
        } catch (detailError) {
          commitDetail(numericId, {
            status: "error",
            data: existing?.data,
            error: detailError,
            requestedAt: Date.now(),
          });
        } finally {
          inflightRef.current.delete(numericId);
        }
      })();

      inflightRef.current.set(numericId, request);

      return request;
    },
    [commitDetail],
  );

  const getDetail = useCallback(
    (id: number) => detailsRef.current[id],
    [],
  );

  const byId = useMemo(
    () => new Map(characters.map((character) => [character.id, character])),
    [characters],
  );

  const value = useMemo<RosterContextValue>(
    () => ({
      status,
      error,
      characters,
      byId,
      details,
      reload,
      prefetchDetail,
      getDetail,
    }),
    [
      status,
      error,
      characters,
      byId,
      details,
      reload,
      prefetchDetail,
      getDetail,
    ],
  );

  return (
    <RosterContext.Provider value={value}>{children}</RosterContext.Provider>
  );
};

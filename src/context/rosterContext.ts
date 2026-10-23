import { createContext, use } from "react";
import type { DragonballAPI } from "@services/apis/dragonball/types";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";

export type RosterStatus = "idle" | "loading" | "ready" | "error";
export type DetailStatus = "idle" | "loading" | "ready" | "error";

export interface DetailEntry {
  status: DetailStatus;
  data?: DragonballAPI.CharacterResponse;
  error?: unknown;
  requestedAt: number;
}

export interface RosterContextValue {
  status: RosterStatus;
  error?: unknown;
  characters: CharacterSummary[];
  byId: Map<number, CharacterSummary>;
  details: Record<number, DetailEntry>;
  reload: () => void;
  prefetchDetail: (
    id: number,
    options?: { force?: boolean; priority?: boolean },
  ) => Promise<void>;
  getDetail: (id: number) => DetailEntry | undefined;
}

export const RosterContext = createContext<RosterContextValue | null>(null);

export const useRoster = (): RosterContextValue => {
  const context = use(RosterContext);

  if (!context) {
    throw new Error("useRoster must be used within a RosterProvider");
  }

  return context;
};

import type { RosterSortKey } from "./rosterSort";

export interface RosterQuery {
  search: string;
  race: string;
  affiliation: string;
  sort: RosterSortKey;
  focus?: number;
}

export const DEFAULT_SORT: RosterSortKey = "name";

const SORT_KEYS: RosterSortKey[] = ["name", "affiliation", "race"];

const parseSortKey = (value: string | null): RosterSortKey =>
  SORT_KEYS.includes(value as RosterSortKey)
    ? (value as RosterSortKey)
    : DEFAULT_SORT;

export const parseRosterQuery = (params: URLSearchParams): RosterQuery => {
  const focusValue = Number(params.get("focus"));

  return {
    search: params.get("q") ?? "",
    race: params.get("race") ?? "",
    affiliation: params.get("affiliation") ?? "",
    sort: parseSortKey(params.get("sort")),
    focus:
      Number.isFinite(focusValue) && focusValue > 0 ? focusValue : undefined,
  };
};

export const buildRosterParams = (
  current: URLSearchParams,
  patch: Partial<RosterQuery>,
): URLSearchParams => {
  const next = new URLSearchParams(current);

  if (patch.search !== undefined) {
    if (patch.search) {
      next.set("q", patch.search);
    } else {
      next.delete("q");
    }
  }

  if (patch.race !== undefined) {
    if (patch.race) {
      next.set("race", patch.race);
    } else {
      next.delete("race");
    }
  }

  if (patch.affiliation !== undefined) {
    if (patch.affiliation) {
      next.set("affiliation", patch.affiliation);
    } else {
      next.delete("affiliation");
    }
  }

  if (patch.sort !== undefined) {
    if (patch.sort === DEFAULT_SORT) {
      next.delete("sort");
    } else {
      next.set("sort", patch.sort);
    }
  }

  if (patch.focus !== undefined) {
    next.set("focus", String(patch.focus));
  }

  return next;
};

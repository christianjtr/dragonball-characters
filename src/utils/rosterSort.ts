import type { CharacterSummary } from "@services/apis/dragonball/types/Character";

export type RosterSortKey = "name" | "affiliation" | "race";

export interface RosterFilterState {
  search: string;
  race: string;
  affiliation: string;
}

const SORT_ACCESSORS: Record<
  RosterSortKey,
  (character: CharacterSummary) => string
> = {
  name: (character) => character.name.toLowerCase(),
  affiliation: (character) => character.affiliation.toLowerCase(),
  race: (character) => character.race.toLowerCase(),
};

export const filterRoster = (
  items: CharacterSummary[],
  filters: RosterFilterState,
): CharacterSummary[] => {
  const query = filters.search.trim().toLowerCase();

  return items.filter((character) => {
    if (query && !character.name.toLowerCase().includes(query)) {
      return false;
    }

    if (filters.race && character.race !== filters.race) {
      return false;
    }

    if (filters.affiliation && character.affiliation !== filters.affiliation) {
      return false;
    }

    return true;
  });
};

export const sortRoster = (
  items: CharacterSummary[],
  key: RosterSortKey,
): CharacterSummary[] => {
  const accessor = SORT_ACCESSORS[key];
  return [...items].sort((a, b) => accessor(a).localeCompare(accessor(b)));
};

export const buildRosterView = (
  items: CharacterSummary[],
  filters: RosterFilterState & { sort: RosterSortKey },
): CharacterSummary[] => sortRoster(filterRoster(items, filters), filters.sort);

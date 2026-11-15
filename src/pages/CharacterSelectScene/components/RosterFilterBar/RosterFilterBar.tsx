import React from "react";
import { ArcadeButton } from "@components/ArcadeButton/ArcadeButton";
import { RACE } from "@services/apis/dragonball/types/Race";
import { AFFILIATION } from "@services/apis/dragonball/types/Affiliation";
import type { RosterQuery } from "@utils/rosterQuery";
import type { RosterSortKey } from "@utils/rosterSort";
import { getAffiliationLabel, getRaceLabel } from "@utils/characterLabels";
import "./RosterFilterBar.css";

interface RosterFilterBarProps {
  query: RosterQuery;
  resultCount: number;
  totalCount: number;
  onChange: (patch: Partial<RosterQuery>) => void;
  onClear: () => void;
}

const RACE_OPTIONS = Object.values(RACE);
const AFFILIATION_OPTIONS = Object.values(AFFILIATION);
const SORT_OPTIONS: Array<{ value: RosterSortKey; label: string }> = [
  { value: "name", label: "Name" },
  { value: "race", label: "Race" },
  { value: "affiliation", label: "Affiliation" },
];

export const RosterFilterBar: React.FC<RosterFilterBarProps> = ({
  query,
  resultCount,
  totalCount,
  onChange,
  onClear,
}) => {
  return (
    <div className="roster-filter-bar arcade-panel">
      <label className="roster-filter-bar__field roster-filter-bar__search">
        <span className="roster-filter-bar__label">Search</span>
        <input
          id="roster-search"
          name="q"
          type="search"
          value={query.search}
          placeholder="Fighter name"
          onChange={(event) => onChange({ search: event.target.value })}
        />
      </label>

      <label className="roster-filter-bar__field">
        <span className="roster-filter-bar__label">Race</span>
        <select
          id="roster-race"
          name="race"
          value={query.race}
          onChange={(event) => onChange({ race: event.target.value })}
        >
          <option value="">All races</option>
          {RACE_OPTIONS.map((race) => (
            <option key={race} value={race}>
              {getRaceLabel(race)}
            </option>
          ))}
        </select>
      </label>

      <label className="roster-filter-bar__field">
        <span className="roster-filter-bar__label">Affiliation</span>
        <select
          id="roster-affiliation"
          name="affiliation"
          value={query.affiliation}
          onChange={(event) => onChange({ affiliation: event.target.value })}
        >
          <option value="">All affiliations</option>
          {AFFILIATION_OPTIONS.map((affiliation) => (
            <option key={affiliation} value={affiliation}>
              {getAffiliationLabel(affiliation)}
            </option>
          ))}
        </select>
      </label>

      <label className="roster-filter-bar__field">
        <span className="roster-filter-bar__label">Sort by</span>
        <select
          id="roster-sort"
          name="sort"
          value={query.sort}
          onChange={(event) =>
            onChange({ sort: event.target.value as RosterSortKey })
          }
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="roster-filter-bar__actions">
        <span className="roster-filter-bar__count">
          {resultCount} of {totalCount} fighters
        </span>
        <ArcadeButton variant="ghost" size="sm" onClick={onClear}>
          Clear
        </ArcadeButton>
      </div>
    </div>
  );
};

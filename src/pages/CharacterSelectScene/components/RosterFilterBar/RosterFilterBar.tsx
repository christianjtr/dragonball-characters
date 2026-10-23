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
  versusMode: boolean;
  onChange: (patch: Partial<RosterQuery>) => void;
  onClear: () => void;
  onToggleVersus: () => void;
}

const RACE_OPTIONS = Object.values(RACE);
const AFFILIATION_OPTIONS = Object.values(AFFILIATION);
const SORT_OPTIONS: Array<{ value: RosterSortKey; label: string }> = [
  { value: "name", label: "Nombre" },
  { value: "race", label: "Raza" },
  { value: "affiliation", label: "Afiliación" },
];

export const RosterFilterBar: React.FC<RosterFilterBarProps> = ({
  query,
  resultCount,
  totalCount,
  versusMode,
  onChange,
  onClear,
  onToggleVersus,
}) => {
  return (
    <div className="roster-filter-bar arcade-panel">
      <label className="roster-filter-bar__field roster-filter-bar__search">
        <span className="roster-filter-bar__label">Buscar</span>
        <input
          id="roster-search"
          name="q"
          type="search"
          value={query.search}
          placeholder="Nombre del luchador"
          onChange={(event) => onChange({ search: event.target.value })}
        />
      </label>

      <label className="roster-filter-bar__field">
        <span className="roster-filter-bar__label">Raza</span>
        <select
          id="roster-race"
          name="race"
          value={query.race}
          onChange={(event) => onChange({ race: event.target.value })}
        >
          <option value="">Todas las razas</option>
          {RACE_OPTIONS.map((race) => (
            <option key={race} value={race}>
              {getRaceLabel(race)}
            </option>
          ))}
        </select>
      </label>

      <label className="roster-filter-bar__field">
        <span className="roster-filter-bar__label">Afiliación</span>
        <select
          id="roster-affiliation"
          name="affiliation"
          value={query.affiliation}
          onChange={(event) => onChange({ affiliation: event.target.value })}
        >
          <option value="">Todas las afiliaciones</option>
          {AFFILIATION_OPTIONS.map((affiliation) => (
            <option key={affiliation} value={affiliation}>
              {getAffiliationLabel(affiliation)}
            </option>
          ))}
        </select>
      </label>

      <label className="roster-filter-bar__field">
        <span className="roster-filter-bar__label">Ordenar por</span>
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
          {resultCount} de {totalCount} luchadores
        </span>
        <ArcadeButton variant="ghost" size="sm" onClick={onClear}>
          Limpiar
        </ArcadeButton>
        <ArcadeButton
          variant={versusMode ? "danger" : "ghost"}
          size="sm"
          aria-pressed={versusMode}
          onClick={onToggleVersus}
        >
          {versusMode ? "Modo 2P activado" : "Modo 2P desactivado"}
        </ArcadeButton>
      </div>
    </div>
  );
};

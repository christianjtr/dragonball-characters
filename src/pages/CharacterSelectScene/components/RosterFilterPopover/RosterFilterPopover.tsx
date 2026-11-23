import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { AFFILIATION } from "@services/apis/dragonball/types/Affiliation";
import { RACE } from "@services/apis/dragonball/types/Race";
import { getAffiliationLabel, getRaceLabel } from "@utils/characterLabels";
import type { RosterQuery } from "@utils/rosterQuery";
import type { RosterSortKey } from "@utils/rosterSort";
import "./RosterFilterPopover.css";

interface RosterFilterPopoverProps {
  query: RosterQuery;
  resultCount: number;
  totalCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (patch: Partial<RosterQuery>) => void;
}

const RACE_OPTIONS = Object.values(RACE);
const AFFILIATION_OPTIONS = Object.values(AFFILIATION);
const SORT_OPTIONS: Array<{ value: RosterSortKey; label: string }> = [
  { value: "name", label: "Nombre" },
  { value: "race", label: "Raza" },
  { value: "affiliation", label: "Afiliación" },
];

interface FilterChip {
  key: string;
  label: string;
  value: string;
  patch: Partial<RosterQuery>;
}

export const RosterFilterPopover: React.FC<RosterFilterPopoverProps> = ({
  query,
  resultCount,
  totalCount,
  open,
  onOpenChange,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const chips = useMemo<FilterChip[]>(() => {
    const active: FilterChip[] = [];

    if (query.search) {
      active.push({
        key: "search",
        label: "Buscar",
        value: query.search,
        patch: { search: "" },
      });
    }

    if (query.race) {
      active.push({
        key: "race",
        label: "Raza",
        value: getRaceLabel(query.race),
        patch: { race: "" },
      });
    }

    if (query.affiliation) {
      active.push({
        key: "affiliation",
        label: "Afiliación",
        value: getAffiliationLabel(query.affiliation),
        patch: { affiliation: "" },
      });
    }

    if (query.sort !== "name") {
      active.push({
        key: "sort",
        label: "Orden",
        value:
          SORT_OPTIONS.find((option) => option.value === query.sort)?.label ??
          query.sort,
        patch: { sort: "name" },
      });
    }

    return active;
  }, [query.affiliation, query.race, query.search, query.sort]);

  const close = useCallback(
    (restoreFocus: boolean) => {
      onOpenChange(false);
      if (restoreFocus) {
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
    },
    [onOpenChange],
  );

  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (
        containerRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      close(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      close(true);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  return (
    <div className="roster-filters" ref={containerRef} data-filter-popover="">
      <div className="roster-filters__row">
        <button
          type="button"
          ref={triggerRef}
          className="roster-filters__trigger arcade-button arcade-button--sm"
          aria-expanded={open}
          aria-controls="roster-filter-panel"
          aria-haspopup="dialog"
          onClick={() => onOpenChange(!open)}
        >
          FILTROS
          {chips.length > 0 ? (
            <span className="roster-filters__badge">{chips.length}</span>
          ) : null}
        </button>

        {chips.map((chip) => (
          <button
            type="button"
            key={chip.key}
            className="roster-filters__chip"
            aria-label={`Quitar filtro ${chip.label}: ${chip.value}`}
            onClick={() => onChange(chip.patch)}
          >
            <span className="roster-filters__chip-label">{chip.label}</span>
            <span className="roster-filters__chip-value">{chip.value}</span>
            <span aria-hidden="true">×</span>
          </button>
        ))}
      </div>

      {open ? (
        <div
          id="roster-filter-panel"
          className="roster-filters__panel"
          role="dialog"
          aria-label="Filtros de luchadores"
        >
          <label className="roster-filters__field roster-filters__field--search">
            <span className="roster-filters__label">Buscar</span>
            <input
              ref={searchRef}
              id="roster-search"
              name="q"
              type="search"
              value={query.search}
              placeholder="Nombre del luchador"
              onChange={(event) => onChange({ search: event.target.value })}
            />
          </label>

          <label className="roster-filters__field">
            <span className="roster-filters__label">Raza</span>
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

          <label className="roster-filters__field">
            <span className="roster-filters__label">Afiliación</span>
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

          <label className="roster-filters__field">
            <span className="roster-filters__label">Ordenar por</span>
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

          <p className="roster-filters__count" aria-live="polite">
            {resultCount} de {totalCount} luchadores
          </p>
        </div>
      ) : null}
    </div>
  );
};

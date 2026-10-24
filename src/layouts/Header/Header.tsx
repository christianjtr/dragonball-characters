import React from "react";
import { Link, NavLink } from "react-router";
import { useRoster } from "@context/rosterContext";
import { KameHouseMark } from "@components/KameHouseMark/KameHouseMark";
import { SoundToggle } from "@components/SoundToggle/SoundToggle";
import Goku from "@assets/goku.gif";
import "./Header.css";

const getRosterLabel = (count: number): string => {
  if (count === 0) {
    return "Sincronizando luchadores";
  }

  return `${count} luchadores`;
};

export const Header: React.FC = () => {
  const { characters } = useRoster();

  return (
    <header className="header">
      <Link to="/" className="header__brand" aria-label="Inicio de Dragonball Arcade">
        <KameHouseMark className="header__logo" />
        <span className="header__brand-copy">
          <span className="header__title">Dragonball Arcade</span>
          <span className="header__subtitle">Kame House</span>
        </span>
      </Link>

      <nav className="header__nav" aria-label="Navegación principal">
        <NavLink
          to="/select"
          className={({ isActive }) =>
            `header__link ${isActive ? "is-active" : ""}`.trim()
          }
        >
          Luchadores
        </NavLink>
      </nav>

      <div className="header__meta">
        <span className="header__count" aria-live="polite">
          {getRosterLabel(characters.length)}
        </span>
        <SoundToggle />
        <span className="header__mascot" aria-hidden="true">
          <img src={Goku} alt="" />
        </span>
      </div>
    </header>
  );
};

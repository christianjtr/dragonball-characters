import React from "react";
import { Link, NavLink } from "react-router";
import { useRoster } from "@context/rosterContext";
import { SoundToggle } from "@components/SoundToggle/SoundToggle";
import DragonballLogo from "@assets/dragon-ball.svg";
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
        <img src={DragonballLogo} alt="" className="header__logo" />
        <span className="header__title">Dragonball Arcade</span>
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
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `header__link ${isActive ? "is-active" : ""}`.trim()
          }
        >
          Inicio
        </NavLink>
      </nav>

      <div className="header__meta">
        <span className="header__count" aria-live="polite">
          {getRosterLabel(characters.length)}
        </span>
        <SoundToggle />
      </div>
    </header>
  );
};

import React from "react";
import { Link } from "react-router";
import DragonballLogo from "@assets/dragon-ball.svg";
import "./Header.css";

export const Header = (): React.JSX.Element => {
    return (
        <header className="header">
            <div className="header__logo-container">
                <Link to="/">
                    <img src={DragonballLogo} alt="Dragonball brand logo" className="header__logo" />
                </Link>
            </div>
            <h1 className="header__title">Dragonball Characters</h1>
        </header>
    );
}
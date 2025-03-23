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
            {/* <nav className="header__nav">
                <ul className="header__nav-list">
                    <li className="header__nav-item">
                        <a href="/" className="header__nav-link">
                            Home
                        </a>
                    </li>
                    <li className="header__nav-item">
                        <a href="/about" className="header__nav-link">
                            About
                        </a>
                    </li>
                    <li className="header__nav-item">
                        <a href="/contact" className="header__nav-link">
                            Contact
                        </a>
                    </li>
                </ul>
            </nav> */}
        </header>
    );
}
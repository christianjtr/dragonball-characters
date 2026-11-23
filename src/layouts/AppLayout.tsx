import React from "react";
import { useLocation } from "react-router";
import { Header } from "./Header/Header";
import { useArcadeMusic } from "@hooks/useArcadeMusic";
import "./AppLayout.css";

interface AppLayoutProps {
  children: React.JSX.Element;
}

export default function AppLayout({
  children,
}: AppLayoutProps): React.JSX.Element {
  useArcadeMusic();
  const { pathname } = useLocation();
  const mainClassName =
    pathname === "/"
      ? "app-layout__main app-layout__main--menu"
      : "app-layout__main";

  return (
    <React.Fragment>
      <a className="app-layout__skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Header />
      <main id="main-content" className={mainClassName} tabIndex={-1}>
        {children}
      </main>
    </React.Fragment>
  );
}

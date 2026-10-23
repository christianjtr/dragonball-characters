import React from "react";
import { Header } from "./Header/Header";
import "./AppLayout.css";

interface AppLayoutProps {
  children: React.JSX.Element;
}

export default function AppLayout({
  children,
}: AppLayoutProps): React.JSX.Element {
  return (
    <React.Fragment>
      <a className="app-layout__skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Header />
      <main id="main-content" className="app-layout__main" tabIndex={-1}>
        {children}
      </main>
    </React.Fragment>
  );
}

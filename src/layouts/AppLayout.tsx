import React from "react";
import { Header } from "./Header/Header";
import "./AppLayout.css";

interface AppLayoutProps {
    children: React.JSX.Element;
}

export default function AppLayout({ children }: AppLayoutProps): React.JSX.Element {
    return (
        <React.Fragment>
            <Header />
            <main className="app-layout__main">
                {children}
            </main>
        </React.Fragment>
    );
}
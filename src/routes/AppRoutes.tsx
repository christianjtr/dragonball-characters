import React, { lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";

const CharactersHomeScene = lazy(() => import("@pages/CharacterHomeScene/CharactersHomeScene"));
const CharacterDetailScene = lazy(() => import("@pages/CharacterDetailScene/CharacterDetailScene"));
const NotFound = lazy(() => import("@components/NotFound/NotFound"));

export const AppRoutes = (): React.JSX.Element => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <Routes>
            <Route path="/" element={<Navigate to="characters" replace />} />
            <Route path="characters" element={<CharactersHomeScene />} />
            <Route path="characters/:id" element={<CharacterDetailScene />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
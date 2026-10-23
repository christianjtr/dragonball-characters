import React, { lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router";

const AttractScene = lazy(() => import("@pages/AttractScene/AttractScene"));
const CharacterSelectScene = lazy(
  () => import("@pages/CharacterSelectScene/CharacterSelectScene"),
);
const FighterProfileScene = lazy(
  () => import("@pages/FighterProfileScene/FighterProfileScene"),
);
const VersusScene = lazy(() => import("@pages/VersusScene/VersusScene"));
const NotFound = lazy(() => import("@components/NotFound/NotFound"));

const LegacyCharacterRedirect = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  return <Navigate to={`/fighters/${id}`} replace />;
};

export const AppRoutes = (): React.JSX.Element => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<AttractScene />} />
      <Route path="/select" element={<CharacterSelectScene />} />
      <Route path="/fighters/:id" element={<FighterProfileScene />} />
      <Route path="/versus/:p1Id/:p2Id" element={<VersusScene />} />
      <Route path="/characters" element={<Navigate to="/select" replace />} />
      <Route path="/characters/:id" element={<LegacyCharacterRedirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

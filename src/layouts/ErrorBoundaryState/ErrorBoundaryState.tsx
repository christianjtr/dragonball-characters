import React from "react";
import { ArcadeButton } from "@components/ArcadeButton/ArcadeButton";
import Broken from "@assets/broken.png";
import "./ErrorBoundary.css";

export const ErrorBoundaryState = (): React.JSX.Element => {
  return (
    <div className="error-boundary-container">
      <img src={Broken} alt="" className="error-boundary__image" />
      <h1 className="error-boundary__title">El arcade tuvo un problema</h1>
      <p className="error-boundary__message">
        Recarga la página para volver a la lista de luchadores.
      </p>
      <ArcadeButton onClick={() => window.location.reload()}>
        Recargar
      </ArcadeButton>
    </div>
  );
};

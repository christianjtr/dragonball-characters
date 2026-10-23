import React from "react";
import { Link } from "react-router";
import { KameHouseScene } from "@components/KameHouseScene/KameHouseScene";
import { useDocumentTitle } from "@hooks/useDocumentTitle";
import "./NotFound.css";

interface NotFoundProps {
  title?: string;
  content?: string;
  backTo?: string;
  backToText?: string;
}

export default function NotFound({
  title = "Página no encontrada",
  content = "La página que buscas no existe.",
  backTo = "/",
  backToText = "Volver al inicio",
}: NotFoundProps): React.JSX.Element {
  useDocumentTitle(`${title} | Dragonball Arcade`);

  return (
    <div className="not-found-container">
      <KameHouseScene className="not-found-scene" />
      <h1 className="not-found-title">{title}</h1>
      <p className="not-found-message">{content}</p>
      <Link to={backTo} className="not-found-link">
        {backToText}
      </Link>
    </div>
  );
}

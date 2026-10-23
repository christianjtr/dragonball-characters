import React from "react";
import "./ReadyBanner.css";

interface ReadyBannerProps {
  player: "P1" | "P2";
  name: string;
}

export const ReadyBanner: React.FC<ReadyBannerProps> = ({ player, name }) => {
  return (
    <div className="ready-banner" role="status">
      <span className="ready-banner__player">{player} listo</span>
      <strong className="ready-banner__name">{name}</strong>
      <span className="ready-banner__hint">
        Elige el siguiente luchador para iniciar el combate
      </span>
    </div>
  );
};

import React from "react";
import Goku from "@assets/goku.gif";
import "./Loader.css";

export const Loader = (): React.JSX.Element => {
  return (
    <div className="loader-container" role="status">
      <img src={Goku} className="loader__image" alt="" />
      <span className="loader__label">Cargando</span>
    </div>
  );
};

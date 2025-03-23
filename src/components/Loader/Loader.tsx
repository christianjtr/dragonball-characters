import React from "react";
import Goku from "@assets/goku.gif";
import "./Loader.css";

export const Loader = (): React.JSX.Element => {
    return (
        <div style={{ height: '100vh' }}>
            <div className="loader__image-container">
                <img src={Goku} className="loader__image" alt="loading image" />
                <span>Loading</span>
            </div>
        </div>
    );
}

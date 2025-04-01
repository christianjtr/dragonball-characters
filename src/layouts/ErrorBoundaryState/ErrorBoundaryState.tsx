import React from "react";
import Broken from "@assets/broken.png";
import './ErrorBoundary.css';

export const ErrorBoundaryState = (): React.JSX.Element => {
    return (
        <div className="error_boundary_container">
            <h1>Something went wrong!</h1>
            <img src={Broken} alt="Something went wrong" />
        </div>
    )
}

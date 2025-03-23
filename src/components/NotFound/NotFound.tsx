import React from "react";
import { Link } from "react-router";
import NotFoundImage from "@assets/not-found.png";
import "./NotFound.css";

export default function NotFound(): React.JSX.Element {
    return (
        <div className="not-found-container">
            <img src={NotFoundImage} alt="404 Not Found" className="not-found-image" />
            <h1 className="not-found-title">404 - Not Found</h1>
            <p className="not-found-message">The page you are looking for does not exist.</p>
            <Link to="/" className="not-found-link">
                Go back to the homepage
            </Link>
        </div>
    );
}

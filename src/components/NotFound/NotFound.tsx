import React from "react";
import { Link } from "react-router";
import NotFoundImage from "@assets/not-found.png";
import "./NotFound.css";

interface NotFoundProps {
    title?: string;
    content?: string;
    backToHomeText?: string;
}

export default function NotFound(props: NotFoundProps): React.JSX.Element {
    const {
        title = "404 - Not Found",
        content = "The page you are looking for does not exist.",
        backToHomeText = "Go back to the homepage"
    } = props;


    return (
        <div className="not-found-container">
            <img src={NotFoundImage} alt={title} className="not-found-image" />
            <h1 className="not-found-title">{title}</h1>
            <p className="not-found-message">{content}</p>
            <Link to="/" className="not-found-link">
                {backToHomeText}
            </Link>
        </div>
    );
}

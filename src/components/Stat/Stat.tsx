import React from "react";
import "./Stat.css";

interface StatProps {
    icon: string;
    title: string;
    value: string | number;
}

export const Stat: React.FC<StatProps> = (props): React.JSX.Element => {
    const { icon, title, value } = props;

    return (
        <div className="stat">
            <img className="stat__icon" src={icon} alt="Icono" aria-label="Icono" />
            <span className="stat__title">{title}</span>
            <span className="stat__value">{value}</span>
        </div>
    );
}
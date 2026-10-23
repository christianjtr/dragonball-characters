import React from "react";
import { ArcadeButton } from "@components/ArcadeButton/ArcadeButton";
import "./StatusPanel.css";

interface StatusPanelProps {
  title: string;
  message?: string;
  tone?: "info" | "error";
  actionLabel?: string;
  onAction?: () => void;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({
  title,
  message,
  tone = "info",
  actionLabel,
  onAction,
}) => {
  return (
    <div
      className={`status-panel status-panel--${tone} arcade-panel`}
      role={tone === "error" ? "alert" : "status"}
    >
      <h2 className="status-panel__title">{title}</h2>
      {message ? <p className="status-panel__message">{message}</p> : null}
      {actionLabel && onAction ? (
        <ArcadeButton variant={tone === "error" ? "danger" : "primary"} onClick={onAction}>
          {actionLabel}
        </ArcadeButton>
      ) : null}
    </div>
  );
};

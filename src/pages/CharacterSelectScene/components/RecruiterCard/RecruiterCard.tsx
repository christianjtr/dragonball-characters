import React, { useEffect, useRef } from "react";
import { ARCADE_CONFIG } from "@config/arcadeConfig";
import "./RecruiterCard.css";

interface RecruiterCardProps {
  onClose: () => void;
}

const STATS = [
  { label: "Arquitectura", value: 94 },
  { label: "Resolución de bugs", value: 92 },
  { label: "Product sense", value: 90 },
];

export const RecruiterCard: React.FC<RecruiterCardProps> = ({ onClose }) => {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
  <div className="recruiter-card__backdrop" onMouseDown={onClose}>
    <section
      ref={dialogRef}
      className="recruiter-card arcade-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recruiter-card-title"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="recruiter-card__topline">
        <span className="recruiter-card__badge">PERSONAJE SECRETO</span>
        <button
          type="button"
          className="recruiter-card__close"
          onClick={onClose}
          aria-label="Cerrar perfil"
        >
          ✕
        </button>
      </div>
      <div className="recruiter-card__hero">
        <div className="recruiter-card__avatar" aria-hidden="true">
          CJ
        </div>
        <div>
          <p className="recruiter-card__eyebrow">INGENIERO DE SISTEMAS</p>
          <h2 id="recruiter-card-title">PLAYER 01</h2>
          <p className="recruiter-card__subtitle">Arquitecto de soluciones · Builder</p>
        </div>
      </div>
      <p className="recruiter-card__bio">
        Construyo productos digitales claros, robustos y listos para crecer,
        conectando ingeniería, experiencia de usuario y objetivos de negocio.
      </p>
      <div className="recruiter-card__stats" aria-label="Atributos del jugador">
        {STATS.map((stat) => (
          <div className="recruiter-card__stat" key={stat.label}>
            <div className="recruiter-card__stat-heading">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
            <div
              className="recruiter-card__meter"
              role="meter"
              aria-label={stat.label}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={stat.value}
            >
              <span style={{ width: `${stat.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="recruiter-card__actions">
        {ARCADE_CONFIG.recruiter.cvUrl ? (
          <a
            className="recruiter-card__action"
            href={ARCADE_CONFIG.recruiter.cvUrl}
            target="_blank"
            rel="noreferrer"
          >
            VER CV ↗
          </a>
        ) : null}
        {!ARCADE_CONFIG.recruiter.cvUrl ? (
          <p className="recruiter-card__links-note">
            Enlace al CV pendiente de configurar.
          </p>
        ) : null}
      </div>
    </section>
  </div>
  );
};

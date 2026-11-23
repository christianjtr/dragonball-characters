import React, { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { isHTTPError } from "@clients/httpClient";
import { FighterPortrait } from "@components/FighterPortrait/FighterPortrait";
import { NavigationHint } from "@components/NavigationHint/NavigationHint";
import NotFound from "@components/NotFound/NotFound";
import { Skeleton } from "@components/Skeleton/Skeleton";
import { StatusPanel } from "@components/StatusPanel/StatusPanel";
import { useArcadeAudio } from "@hooks/useArcadeAudio";
import { useBackNavigation } from "@hooks/useBackNavigation";
import { useCharacterDetail } from "@hooks/useCharacterDetail";
import { useDocumentTitle } from "@hooks/useDocumentTitle";
import { useMediaQuery } from "@hooks/useMediaQuery";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import { getCharacterAccent } from "@utils/characterTheme";
import {
  getAffiliationLabel,
  getGenderLabel,
  getRaceLabel,
} from "@utils/characterLabels";
import "./VersusScene.css";

interface VersusFighterCardProps {
  label: string;
  character: CharacterSummary;
  align: "left" | "right";
}

const VersusFighterCard: React.FC<VersusFighterCardProps> = ({
  label,
  character,
  align,
}) => {
  const accent = getCharacterAccent(character.race);

  return (
    <article
      className={`versus-scene__fighter versus-scene__fighter--${align} arcade-panel`}
      style={{ "--profile-accent": accent } as React.CSSProperties}
    >
      <p className="versus-scene__label">{label}</p>
      <FighterPortrait
        character={character}
        accent={accent}
        className="versus-scene__portrait"
      />
      <h2 className="versus-scene__name">{character.name}</h2>
      <ul className="versus-scene__tags">
        <li>{getRaceLabel(character.race)}</li>
        <li>{getAffiliationLabel(character.affiliation)}</li>
        <li>{getGenderLabel(character.gender)}</li>
      </ul>
      <dl className="versus-scene__stats">
        <div>
          <dt>Ki base</dt>
          <dd>{character.ki}</dd>
        </div>
        <div>
          <dt>Ki máximo</dt>
          <dd>{character.maxKi}</dd>
        </div>
      </dl>
    </article>
  );
};

const VersusSkeleton: React.FC = () => (
  <div className="versus-scene__arena" aria-hidden="true">
    <div className="versus-scene__fighter arcade-panel">
      <Skeleton style={{ height: "0.8rem", width: "30%" }} />
      <Skeleton style={{ height: "clamp(220px, 38vh, 360px)" }} />
      <Skeleton style={{ height: "1.6rem", width: "70%" }} />
    </div>
    <div className="versus-scene__vs" />
    <div className="versus-scene__fighter arcade-panel">
      <Skeleton style={{ height: "0.8rem", width: "30%" }} />
      <Skeleton style={{ height: "clamp(220px, 38vh, 360px)" }} />
      <Skeleton style={{ height: "1.6rem", width: "70%" }} />
    </div>
    <p className="visually-hidden" role="status">
      Cargando el combate
    </p>
  </div>
);

export default function VersusScene(): React.JSX.Element {
  const { p1Id, p2Id } = useParams<{ p1Id: string; p2Id: string }>();
  const navigate = useNavigate();
  const p1 = useCharacterDetail(p1Id);
  const p2 = useCharacterDetail(p2Id);
  const play = useArcadeAudio();
  const isCompact = useMediaQuery("(max-width: 980px)");

  const p1Character = p1.detail ?? p1.summary;
  const p2Character = p2.detail ?? p2.summary;
  const backTo = p1Character ? `/select?focus=${p1Character.id}` : "/select";
  const handleBack = useCallback(() => {
    play("back");
    navigate(backTo);
  }, [backTo, navigate, play]);
  const gamepadConnected = useBackNavigation({ onBack: handleBack });

  useDocumentTitle(
    p1Character && p2Character
      ? `${p1Character.name} vs ${p2Character.name} · Dragonball Arcade`
      : "Combate · Dragonball Arcade",
  );

  if (!p1.id || !p2.id) {
    return (
      <NotFound
        title="Combate no encontrado"
        content="Ese combate necesita dos IDs de luchador válidos."
        backTo="/select"
        backToText="Volver a luchadores"
      />
    );
  }

  if (!p1Character || !p2Character) {
    const failed = [p1, p2].find((entry) => entry.status === "error");

    if (failed) {
      if (isHTTPError(failed.error) && failed.error.status === 400) {
        return (
          <NotFound
            title="Luchador no encontrado"
            content="Uno de los luchadores seleccionados no forma parte de la lista."
            backTo="/select"
            backToText="Volver a luchadores"
          />
        );
      }

      return (
        <StatusPanel
          tone="error"
          title="Combate no disponible"
          message="No se pudo cargar uno de los luchadores. Revisa tu conexión e inténtalo de nuevo."
          actionLabel="Reintentar"
          onAction={() => {
            p1.retry();
            p2.retry();
          }}
        />
      );
    }

    return (
      <section className="versus-scene" aria-label="Cargando el combate">
        <VersusSkeleton />
      </section>
    );
  }

  return (
    <section className="versus-scene" aria-labelledby="versus-heading">
      <h1 id="versus-heading" className="visually-hidden">
        {p1Character.name} vs {p2Character.name}
      </h1>
      <div className="versus-scene__topbar">
        <Link className="versus-scene__back" to={backTo}>
          Volver a luchadores
        </Link>
        <NavigationHint
          variant="versus"
          compact={isCompact}
          gamepadConnected={gamepadConnected}
        />
      </div>

      <div className="versus-scene__arena">
        <VersusFighterCard label="P1" character={p1Character} align="left" />
        <div className="versus-scene__vs" aria-hidden="true">
          VS
        </div>
        <VersusFighterCard label="P2" character={p2Character} align="right" />
      </div>

      <p className="versus-scene__note">
        Los valores de Ki se muestran tal como aparecen en la lista original.
      </p>

      <div className="versus-scene__actions">
        <Link
          className="versus-scene__action"
          to={backTo}
        >
          Cambiar luchadores
        </Link>
        <Link
          className="versus-scene__action versus-scene__action--ghost"
          to={`/fighters/${p1Character.id}`}
        >
          Ver perfil de P1
        </Link>
        <Link
          className="versus-scene__action versus-scene__action--ghost"
          to={`/fighters/${p2Character.id}`}
        >
          Ver perfil de P2
        </Link>
      </div>
    </section>
  );
}

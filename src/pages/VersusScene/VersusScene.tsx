import React, { useCallback, useState } from "react";
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

type DuelSide = "p1" | "p2";
type DuelResult = DuelSide | "tie";
type DuelCardState = "idle" | "win" | "lose" | "tie";

const KI_MULTIPLIERS: Record<string, number> = {
  mil: 1e3,
  million: 1e6,
  millones: 1e6,
  billion: 1e9,
  billon: 1e9,
  trillon: 1e12,
  trillion: 1e12,
  cuadrillon: 1e15,
  quadrillion: 1e15,
  quintillon: 1e18,
  quintillion: 1e18,
  sextillon: 1e21,
  sextillion: 1e21,
  septillon: 1e24,
  septillion: 1e24,
};

const parseKi = (value: string): number => {
  const match = value
    .trim()
    .toLowerCase()
    .match(/^([\d,.]+)\s*([a-zñ]+)?$/);

  if (!match) {
    return 0;
  }

  const rawAmount = match[1];
  const hasMultiplier = Boolean(match[2]);
  const dotCount = (rawAmount.match(/\./g) ?? []).length;
  const usesThousandsSeparator =
    dotCount > 1 || (!hasMultiplier && dotCount === 1 && /\.\d{3}$/.test(rawAmount));
  const amount = usesThousandsSeparator
    ? Number(rawAmount.replace(/\./g, ""))
    : Number(rawAmount.replace(/,/g, "."));
  const multiplier = match[2] ? (KI_MULTIPLIERS[match[2]] ?? 1) : 1;

  return Number.isFinite(amount) ? amount * multiplier : 0;
};

interface VersusFighterCardProps {
  label: string;
  character: CharacterSummary;
  align: "left" | "right";
  duelState: DuelCardState;
}

const VersusFighterCard: React.FC<VersusFighterCardProps> = ({
  label,
  character,
  align,
  duelState,
}) => {
  const accent = getCharacterAccent(character.race);

  return (
    <article
      className={`versus-scene__fighter versus-scene__fighter--${align} versus-scene__fighter--${duelState} arcade-panel`}
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
    <div className="versus-scene__duel-control">
      <div className="versus-scene__vs">
        <span className="versus-scene__vs-glyph">VS</span>
      </div>
      <span className="versus-scene__duel-hint">&nbsp;</span>
    </div>
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
  const [duelRun, setDuelRun] = useState(0);

  const p1Character = p1.detail ?? p1.summary;
  const p2Character = p2.detail ?? p2.summary;
  const backTo = p1Character ? `/select?focus=${p1Character.id}` : "/select";
  const handleBack = useCallback(() => {
    play("back");
    navigate(backTo);
  }, [backTo, navigate, play]);
  const handleDuel = useCallback(() => {
    play("lock-in");
    setDuelRun((run) => run + 1);
  }, [play]);
  const gamepadConnected = useBackNavigation({
    onBack: handleBack,
    onConfirm: handleDuel,
  });

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

  const duelRevealed = duelRun > 0;
  const p1Ki = parseKi(p1Character.ki);
  const p2Ki = parseKi(p2Character.ki);
  const p1Power = parseKi(p1Character.maxKi) || p1Ki;
  const p2Power = parseKi(p2Character.maxKi) || p2Ki;
  const peakPower = Math.max(p1Power, p2Power, 1);
  const p1Level = Math.max(8, Math.round((p1Power / peakPower) * 100));
  const p2Level = Math.max(8, Math.round((p2Power / peakPower) * 100));
  const duelResult: DuelResult =
    p1Power === p2Power
      ? p1Ki === p2Ki
        ? "tie"
        : p1Ki > p2Ki
          ? "p1"
          : "p2"
      : p1Power > p2Power
        ? "p1"
        : "p2";
  const winner =
    duelResult === "tie"
      ? null
      : duelResult === "p1"
        ? p1Character
        : p2Character;
  const outcomeMessage =
    duelResult === "tie"
      ? `Empate técnico: ambos con ${p1Character.maxKi} de Ki máximo.`
      : `Ventaja para ${winner?.name}: ${winner?.maxKi} de Ki máximo.`;
  const cardDuelState = (side: DuelSide): DuelCardState => {
    if (!duelRevealed) {
      return "idle";
    }

    if (duelResult === "tie") {
      return "tie";
    }

    return duelResult === side ? "win" : "lose";
  };

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
        <VersusFighterCard
          label="P1"
          character={p1Character}
          align="left"
          duelState={cardDuelState("p1")}
        />
        <div className="versus-scene__duel-control">
          <button
            type="button"
            className="versus-scene__vs"
            onClick={handleDuel}
            aria-label="Medir el Ki de ambos luchadores"
            aria-describedby="versus-duel-hint"
          >
            <span key={duelRun} className="versus-scene__vs-glyph" aria-hidden="true">
              VS
            </span>
          </button>
          <p id="versus-duel-hint" className="versus-scene__duel-hint">
            {duelRevealed
              ? "Pulsa VS para repetir el duelo"
              : "Pulsa VS para medir el Ki"}
          </p>
        </div>
        <VersusFighterCard
          label="P2"
          character={p2Character}
          align="right"
          duelState={cardDuelState("p2")}
        />
      </div>

      {duelRevealed ? (
        <div
          key={duelRun}
          className={`versus-scene__duel versus-scene__duel--${duelResult}`}
          aria-hidden="true"
        >
          <div className="versus-scene__duel-track versus-scene__duel-track--p1">
            <span
              className="versus-scene__duel-fill"
              style={{ "--ki-level": `${p1Level}%` } as React.CSSProperties}
            />
            {duelResult === "p1" || duelResult === "tie" ? (
              <span className="versus-scene__duel-crown">★</span>
            ) : null}
            <span className="versus-scene__duel-value">{p1Character.maxKi}</span>
          </div>
          <span className="versus-scene__duel-core">KI</span>
          <div className="versus-scene__duel-track versus-scene__duel-track--p2">
            <span
              className="versus-scene__duel-fill"
              style={{ "--ki-level": `${p2Level}%` } as React.CSSProperties}
            />
            {duelResult === "p2" || duelResult === "tie" ? (
              <span className="versus-scene__duel-crown">★</span>
            ) : null}
            <span className="versus-scene__duel-value">{p2Character.maxKi}</span>
          </div>
        </div>
      ) : null}

      <p className="visually-hidden" role="status">
        {duelRevealed ? outcomeMessage : ""}
      </p>

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

import React from "react";
import { Link, useParams } from "react-router";
import { isHTTPError } from "@clients/httpClient";
import { FighterPortrait } from "@components/FighterPortrait/FighterPortrait";
import NotFound from "@components/NotFound/NotFound";
import { Skeleton } from "@components/Skeleton/Skeleton";
import { StatusPanel } from "@components/StatusPanel/StatusPanel";
import { useCharacterDetail } from "@hooks/useCharacterDetail";
import { useDocumentTitle } from "@hooks/useDocumentTitle";
import { getCharacterAccent } from "@utils/characterTheme";
import {
  getAffiliationLabel,
  getGenderLabel,
  getPlanetStatusLabel,
  getRaceLabel,
} from "@utils/characterLabels";
import "./FighterProfileScene.css";

const ProfileSkeleton: React.FC = () => (
  <div className="profile-scene__layout" aria-hidden="true">
    <div className="profile-scene__hero arcade-panel">
      <Skeleton style={{ height: "clamp(240px, 42vh, 400px)" }} />
    </div>
    <div className="profile-scene__panel arcade-panel">
      <Skeleton style={{ height: "0.9rem", width: "30%" }} />
      <Skeleton style={{ height: "2.4rem", width: "60%" }} />
      <Skeleton style={{ height: "1rem", width: "45%" }} />
      <Skeleton style={{ height: "5rem" }} />
      <Skeleton style={{ height: "5rem" }} />
    </div>
    <p className="visually-hidden" role="status">
      Cargando el perfil del luchador
    </p>
  </div>
);

export default function FighterProfileScene(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { id: numericId, summary, detail, status, error, retry } =
    useCharacterDetail(id);

  const character = detail ?? summary;

  useDocumentTitle(
    character
      ? `${character.name} · Dragonball Arcade`
      : "Luchador · Dragonball Arcade",
  );

  if (!numericId) {
    return (
      <NotFound
        title="Luchador no encontrado"
        content="Ese ID de luchador no forma parte de la lista."
        backTo="/select"
        backToText="Volver a luchadores"
      />
    );
  }

  if (!character) {
    if (status === "error") {
      if (isHTTPError(error) && error.status === 400) {
        return (
          <NotFound
            title="Luchador no encontrado"
            content={`Ningún luchador coincide con el ID ${numericId}.`}
            backTo="/select"
            backToText="Volver a luchadores"
          />
        );
      }

      return (
        <StatusPanel
          tone="error"
          title="Luchador no disponible"
          message="No se pudo cargar este luchador. Revisa tu conexión e inténtalo de nuevo."
          actionLabel="Reintentar"
          onAction={retry}
        />
      );
    }

    return (
      <section className="profile-scene" aria-label="Perfil del luchador">
        <ProfileSkeleton />
      </section>
    );
  }

  const accent = getCharacterAccent(character.race);
  const transformations = detail?.transformations ?? [];

  return (
    <section
      className="profile-scene"
      aria-labelledby="profile-name"
      style={{ "--profile-accent": accent } as React.CSSProperties}
    >
      <div className="profile-scene__topbar">
        <Link className="profile-scene__back" to={`/select?focus=${character.id}`}>
          Volver a luchadores
        </Link>
        <span className="profile-scene__record">Luchador #{character.id}</span>
      </div>

      <div className="profile-scene__layout">
        <div className="profile-scene__hero arcade-panel">
          <FighterPortrait
            character={character}
            accent={accent}
            eager
            className="profile-scene__portrait"
          />
        </div>

        <div className="profile-scene__panel arcade-panel">
          <header>
            <p className="profile-scene__eyebrow">
              {getRaceLabel(character.race)}
            </p>
            <h1 id="profile-name" className="profile-scene__name">
              {character.name}
            </h1>
            <ul className="profile-scene__tags">
              <li>{getAffiliationLabel(character.affiliation)}</li>
              <li>{getGenderLabel(character.gender)}</li>
              <li>{getRaceLabel(character.race)}</li>
            </ul>
          </header>

          <dl className="profile-scene__stats">
            <div>
              <dt>Ki base</dt>
              <dd>{character.ki}</dd>
            </div>
            <div>
              <dt>Ki máximo</dt>
              <dd>{character.maxKi}</dd>
            </div>
          </dl>

          <section className="profile-scene__section" aria-labelledby="profile-bio">
            <h2 id="profile-bio">Perfil</h2>
            <p>{character.description}</p>
          </section>

          {detail ? (
            <>
              <section
                className="profile-scene__section"
                aria-labelledby="profile-origin"
              >
                <h2 id="profile-origin">Planeta de origen</h2>
                <div className="profile-scene__planet">
                  {detail.originPlanet.image ? (
                    <img
                      src={detail.originPlanet.image}
                      alt=""
                      loading="lazy"
                      width={96}
                      height={96}
                    />
                  ) : null}
                  <div>
                    <h3>{detail.originPlanet.name}</h3>
                    <p>{detail.originPlanet.description}</p>
                    <p className="profile-scene__planet-status">
                      {getPlanetStatusLabel(detail.originPlanet.isDestroyed)}
                    </p>
                  </div>
                </div>
              </section>

              <section
                className="profile-scene__section"
                aria-labelledby="profile-transformations"
              >
                <h2 id="profile-transformations">Transformaciones</h2>
                {transformations.length > 0 ? (
                  <ul className="profile-scene__transformations">
                    {transformations.map((transformation) => (
                      <li key={transformation.id}>
                        <img
                          src={transformation.image}
                          alt=""
                          loading="lazy"
                          width={48}
                          height={48}
                        />
                        <span>{transformation.name}</span>
                        <span className="profile-scene__transform-ki">
                          {transformation.ki}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="profile-scene__muted">
                    Sin transformaciones registradas.
                  </p>
                )}
              </section>
            </>
          ) : status === "error" ? (
            <StatusPanel
              tone="error"
              title="Información ampliada no disponible"
              message="El perfil se cargó, pero no se pudieron obtener los datos del planeta y las transformaciones."
              actionLabel="Reintentar"
              onAction={retry}
            />
          ) : (
            <div className="profile-scene__detail-loading" aria-hidden="true">
              <Skeleton style={{ height: "1rem", width: "35%" }} />
              <Skeleton style={{ height: "3rem" }} />
              <Skeleton style={{ height: "1rem", width: "35%" }} />
              <Skeleton style={{ height: "3rem" }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

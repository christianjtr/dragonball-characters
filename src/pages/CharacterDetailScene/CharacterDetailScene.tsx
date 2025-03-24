import React, { useMemo } from "react";
import { useParams } from "react-router";
import { Stat } from "@components/Stat/Stat";
import { useFetchCharacterById } from "@hooks/useFetchCharacterById";
import BloodImage from "@assets/blood.png";
import EqualityImage from "@assets/equality.png";
import FistBumpImage from "@assets/fist-bump.png";
import FireImage from "@assets/fire.png";
import "./CharacterDetailScene.css";


export default function CharacterDetailScene(): React.JSX.Element | null {
    const { id } = useParams<{ id: string }>();

    const { character } = useFetchCharacterById(
        useMemo(() => id!, [id]),
    );

    const hasTransFormations = character && character.transformations.length > 0;

    if (!character) {
        return null;
    }

    return (
        <div className="character-details-container">
            <div className="character-details-container__card-container_img-container">
                <img className="character-image" src={character.image} alt={character.name} aria-label="Character image" width="15%" />
            </div>
            <div className="character-details-container__card-container">
                <div>
                    <div className="character-details-container__card-container_heading">
                        <div>
                            <h2>{character.name}</h2>
                            <div className="character-details-container__card-container_subtitle">
                                <img className="subtitle-image" src={FireImage} alt="Fire image" aria-label="Fire image" />
                                <span><strong>Ki (Power level):</strong> {character.ki}</span>
                            </div>
                        </div>
                        <div className="stats-container">
                            <Stat title="People" value={character.gender} icon={EqualityImage} />
                            <Stat title="Origin" value={character.race} icon={BloodImage} />
                            <Stat title="Affiliation" value={character.affiliation} icon={FistBumpImage} />
                        </div>
                    </div>
                    <br />
                    <p>{character.description}</p>
                    <h4>Planet of Origin</h4>
                    <p>
                        <span><strong>Name:</strong> {character.originPlanet.name}</span>
                        <span> | </span>
                        <span><strong>Destroyed:</strong> {character.originPlanet.isDestroyed ? "Yes" : "No"}</span>
                    </p>
                    <p>{character.originPlanet.description}</p>
                    {hasTransFormations && (
                        <React.Fragment>
                            <h4>Transformations</h4>
                            <ul className="transformations">
                                {character.transformations.map((transformation) => (
                                    <li key={transformation.id}>
                                        <span>🔶 {transformation.name}</span>
                                        <span> | </span>
                                        <span><strong>Ki:</strong> {transformation.ki}</span>
                                    </li>
                                ))}
                            </ul>
                        </React.Fragment>
                    )}

                </div>
            </div>
        </div >
    );
}

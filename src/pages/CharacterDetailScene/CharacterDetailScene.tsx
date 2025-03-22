import React, { useMemo } from 'react';
import { useParams } from "react-router";
import { useFetchCharacterById } from '@hooks/useFetchCharacterById';
import './CharacterDetailScene.css';

export default function CharacterDetailScene(): React.JSX.Element | null {
    const { id } = useParams<{ id: string }>();

    const { character } = useFetchCharacterById(
        useMemo(() => id!, [id]),
    );

    if (!character) {
        return null;
    }

    return (
        <div className="character-details">
            <img src={character.image} alt={character.name} />
            <h2>{character.name}</h2>
            <p><strong>Raza:</strong> {character.race}</p>
            <p><strong>Género:</strong> {character.gender}</p>
            <p className="ki">Ki: {character.ki}</p>
            <p className="max-ki">Ki Máximo: {character.maxKi}</p>
            <p><strong>Afiliación:</strong> {character.affiliation}</p>
            <p><strong>Descripción:</strong> {character.description}</p>

            <h3>Planeta de Origen</h3>
            <div className="origin-planet">
                <img src={character.originPlanet.image} alt={character.originPlanet.name} />
                <h4>{character.originPlanet.name}</h4>
                <p><strong>Destruido:</strong> {character.originPlanet.isDestroyed ? 'Sí' : 'No'}</p>
                <p>{character.originPlanet.description}</p>
            </div>

            <h3>Transformaciones</h3>
            <ul className="transformations">
                {character.transformations.map((transformation) => (
                    <li key={transformation.id}>
                        <img src={transformation.image} alt={transformation.name} />
                        <h4>{transformation.name}</h4>
                        <p>Ki: {transformation.ki}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

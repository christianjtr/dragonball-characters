import React from 'react';
import { Link } from 'react-router';
import type { CharacterSummary } from '@services/apis/dragonball/types/Character';
import './CharacterCard.css';

interface CharacterCardProps {
    character: CharacterSummary;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
    const {
        image,
        name,
        race,
        gender,
        ki,
        maxKi,
        affiliation,
        description
    } = character;

    return (
        <Link className="character-card" to={`/characters/${character.id}`}>
            <img src={image} alt={name} />
            <h2>{name}</h2>
            <p><strong>Raza:</strong> {race}</p>
            <p><strong>Género:</strong> {gender}</p>
            <p className="ki">Ki: {ki}</p>
            <p className="max-ki">Ki Máximo: {maxKi}</p>
            <p><strong>Afiliación:</strong> {affiliation}</p>
            <p><strong>Descripción:</strong> {description}</p>
        </Link>
    );
}

export default CharacterCard;
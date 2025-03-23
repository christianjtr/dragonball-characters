import React from "react";
import { Link } from "react-router";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import { Stat } from "@components/Stat/Stat";
import BloodImage from "@assets/blood.png";
import EqualityImage from "@assets/equality.png";
import FistBumpImage from "@assets/fist-bump.png";
import "./CharacterCard.css";

interface CharacterCardProps {
    character: CharacterSummary;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }): React.JSX.Element => {
    const {
        image,
        name,
        race: origin,
        gender: people,
        affiliation,
    } = character;

    return (
        <Link className="character-card" to={`/characters/${character.id}`}>
            <div className="circle-image">
                <img src={image} alt={name} aria-label="Character image" />
            </div>
            <h2>{name}</h2>
            <div className="character-card__stats-container">
                <Stat title="People" value={people} icon={EqualityImage} />
                <Stat title="Origin" value={origin} icon={BloodImage} />
                <Stat title="Affiliation" value={affiliation} icon={FistBumpImage} />
            </div>
        </Link>
    );
}

export default CharacterCard;
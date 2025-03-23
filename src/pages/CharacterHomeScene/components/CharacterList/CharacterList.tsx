import React from "react";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import { CharacterCard } from "../";
import "./CharacterList.css";

interface CharacterListProps {
    characters: CharacterSummary[];
}

const CharacterList: React.FC<CharacterListProps> = ({ characters }): React.JSX.Element => {
    return (
        <div className="grid-container">
            {characters.map((eachCharacter, index) => (
                <CharacterCard key={`character_card_item_${index}`} character={eachCharacter} />
            ))}
        </div>
    );
}

export default CharacterList;
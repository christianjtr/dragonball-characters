import React from 'react';
import type { CharacterSummary } from '@services/apis/dragonball/types/Character';
import { CharacterCard } from '../';
import './CharacterList.css';

interface CharacterListProps {
    characters: CharacterSummary[];
}

const CharacterList: React.FC<CharacterListProps> = ({ characters }) => {
    return (
        <div className='grid-container'>
            {characters.map((eachCharacter, index) => (
                <CharacterCard key={index} character={eachCharacter} />
            ))}
        </div>
    );
}

export default CharacterList;
import React from 'react';
import { useFetchCharacters } from '@hooks/useFetchCharacters';
import { CharacterList } from './components';

export default function CharactersHomeScene(): React.JSX.Element | null {
    const { characters } = useFetchCharacters();

    if (!characters) {
        return null;
    }

    return (
        <React.Fragment>
            <div>CharactersHomeScene</div>
            <CharacterList characters={characters} />
        </React.Fragment>
    );
}

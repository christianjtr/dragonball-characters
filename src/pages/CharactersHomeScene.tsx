import React from 'react';
import { useFetchCharacters } from '@hooks/useFetchCharacters';

export default function CharactersHomeScene(): React.JSX.Element | null {
    const { characters } = useFetchCharacters();

    if (!characters) {
        return null;
    }

    return (
        <React.Fragment>
            <div>CharactersHomeScene</div>
            <div style={{ textAlign: 'left' }}>
                {characters.map((eachCharacter, index) => (
                    <pre key={index}>{JSON.stringify(eachCharacter, null, 2)}</pre>
                ))}
            </div>
        </React.Fragment>
    );
}

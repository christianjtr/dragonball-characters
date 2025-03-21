import React from 'react';
import { useParams } from "react-router";
import { useFetchCharacterById } from '@hooks/useFetchCharacterById';

export default function CharacterDetailScene(): React.JSX.Element | null {
    const { id } = useParams<{ id: string }>();

    const { character } = useFetchCharacterById(id!);

    if (!character) {
        return null;
    }

    return (
        <>
            <div>CharacterDetailScene</div>
            <pre style={{ textAlign: 'left' }}>{JSON.stringify(character, null, 2)}</pre>
        </>
    );
}

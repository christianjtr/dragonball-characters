import React from 'react';
import { useFetchCharacters } from '@hooks/useFetchCharacters';
import { CharacterList } from './components';
import { Pagination } from '@components/Pagination/Pagination';

export default function CharactersHomeScene(): React.JSX.Element | null {
    const { characters, meta, links } = useFetchCharacters();

    if (!characters) {
        return null;
    }

    return (
        <React.Fragment>
            <div>CharactersHomeScene</div>
            <CharacterList characters={characters} />
            <Pagination meta={meta} links={links} onPageChange={() => { }} />
        </React.Fragment>
    );
}

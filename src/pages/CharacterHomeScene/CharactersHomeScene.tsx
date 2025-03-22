import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from "react-router";
import { useFetchCharacters } from '@hooks/useFetchCharacters';
import { ALLOWED_PAGE_SIZES, DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '@app-types/Pagination';
import { Pagination } from '@components/Pagination/Pagination';
import { CharacterList } from './components';

export default function CharactersHomeScene(): React.JSX.Element | null {
    const [searchParam, setSearchParams] = useSearchParams();

    const pageNumberParam = Number(searchParam.get('page'));
    const pageSizeParam = Number(searchParam.get('limit'));

    const [pageNumber, setPageNumber] = useState<number>(pageNumberParam || DEFAULT_CURRENT_PAGE);
    const [pageSize, setPageSize] = useState<number>(ALLOWED_PAGE_SIZES.includes(pageSizeParam) ? pageSizeParam : DEFAULT_PAGE_SIZE);

    const { characters, totalPages, currentPage, itemsPerPage, totalItems } = useFetchCharacters(
        useMemo(() => ({
            pagination: { page: pageNumber, limit: pageSize }
        }), [pageNumber, pageSize]),
    );

    const handleOnChangePage = ((pageNumber: number) => {
        setPageNumber(pageNumber);
    });

    const handleOnChangePageSize = ((pageSize: number) => {
        setPageSize(pageSize);
    });

    useEffect(() => {
        setSearchParams({
            page: String(pageNumber),
            limit: String(pageSize)
        });
    }, [pageNumber, pageSize, setSearchParams]);

    if (!characters || characters.length === 0) {
        return null;
    }

    return (
        <React.Fragment>
            <CharacterList characters={characters} />
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                pageSize={itemsPerPage}
                totalItems={totalItems}
                onChangePage={handleOnChangePage}
                onChangePageSize={handleOnChangePageSize}
            />
        </React.Fragment>
    );
}

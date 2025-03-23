import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useFetchCharacters } from "@hooks/useFetchCharacters";
import { ALLOWED_PAGE_SIZES, DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from "@app-types/Pagination";
import { Pagination } from "@components/Pagination/Pagination";
import { CharacterList, CharacterSorter } from "./components";
import "./CharactersHomeScene.css";

export default function CharactersHomeScene(): React.JSX.Element | null {
    const [searchParam, setSearchParams] = useSearchParams();

    const pageNumberParam = Number(searchParam.get("page"));
    const pageSizeParam = Number(searchParam.get("limit"));

    const [pageNumber, setPageNumber] = useState<number>(pageNumberParam || DEFAULT_CURRENT_PAGE);
    const [pageSize, setPageSize] = useState<number>(ALLOWED_PAGE_SIZES.includes(pageSizeParam) ? pageSizeParam : DEFAULT_PAGE_SIZE);
    const [selectedSortFields, setSelectedSortFields] = useState<string[]>([]);

    const searchFilters = useMemo(() => ({
        pagination: { page: pageNumber, limit: pageSize },
    }), [pageNumber, pageSize]);

    const sortFields = useMemo(() => selectedSortFields, [selectedSortFields]);

    const { characters, totalPages, currentPage, itemsPerPage, totalItems } = useFetchCharacters({
        searchFilters,
        sortFields
    });

    const handleOnChangePage = (pageNumber: number) => {
        setPageNumber(pageNumber);
    };

    const handleOnChangePageSize = (pageSize: number) => {
        setPageSize(pageSize);
    };

    const handleOnApplySortFilters = (fields: string[]) => {
        setSelectedSortFields(fields);
    }

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
        <div className="characters-home-scene">
            <div>
                <CharacterSorter onSort={handleOnApplySortFilters} />
            </div>
            <div>
                <CharacterList characters={characters} />
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    pageSize={itemsPerPage}
                    totalItems={totalItems}
                    onChangePage={handleOnChangePage}
                    onChangePageSize={handleOnChangePageSize}
                />
            </div>
        </div>
    );
}

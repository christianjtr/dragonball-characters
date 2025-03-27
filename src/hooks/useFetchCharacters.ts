import { useEffect, useState, useCallback, useTransition } from "react";
import { sortDataBy } from "@utils/sortDataBy";
import type { DragonballAPI } from "@services/apis/dragonball/types";
import type { GetAllCharactersServiceProps } from "@services/apis/dragonball/characters.services";
import { DragonballCharactersService } from "@services/apis/dragonball";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";

interface UseFetchCharactersProps {
    searchFilters?: GetAllCharactersServiceProps,
    sortFields?: string[];
}

export const useFetchCharacters = (props: UseFetchCharactersProps) => {
    const { searchFilters, sortFields } = props || {};

    const [data, setCharacters] = useState<DragonballAPI.CharactersResponse>();
    const [isLoading, startTransition] = useTransition();
    const [error, setError] = useState<unknown>();

    const shouldSortData = sortFields!.length > 0;

    const fetch = useCallback(() => {
        startTransition(async () => {
            try {
                const data = await DragonballCharactersService.getAll(searchFilters);

                let items = data.items;
                if (shouldSortData) {
                    items = sortDataBy<CharacterSummary>(data.items, sortFields!);
                }

                setCharacters({
                    ...data,
                    items,
                });
            } catch (error) {
                setError(error);
            }
        });
    }, [searchFilters, shouldSortData, sortFields]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return {
        characters: data?.items,
        totalPages: data?.meta.totalPages,
        currentPage: data?.meta.currentPage,
        totalItems: data?.meta.totalItems,
        itemsPerPage: data?.meta.itemsPerPage,
        isLoading,
        error,
        refetch: () => fetch()
    };
}
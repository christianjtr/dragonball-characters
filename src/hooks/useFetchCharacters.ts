import { useEffect, useState, useCallback, useTransition } from "react";
import type { DragonballAPI } from "@services/apis/dragonball/types";
import type { GetAllCharactersServiceProps } from "@services/apis/dragonball/characters.services";
import { DragonballCharactersService } from "@services/apis/dragonball";

export const useFetchCharacters = (searchFilters: GetAllCharactersServiceProps) => {
    const [data, setCharacters] = useState<DragonballAPI.CharactersResponse>();
    const [isLoading, startTransition] = useTransition();
    const [error, setError] = useState<unknown>();

    const fetch = useCallback(() => {
        startTransition(async () => {
            try {
                const data = await DragonballCharactersService.getAll(searchFilters);
                setCharacters(data);
            } catch (error) {
                setError(error);
            }
        });
    }, [searchFilters]);

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
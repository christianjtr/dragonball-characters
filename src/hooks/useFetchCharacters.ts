import { useEffect, useState, useCallback, useTransition } from "react";
import type { DragonballAPI } from "@services/apis/dragonball/types";
import { DragonballCharacters } from "@services/apis/dragonball";

export const useFetchCharacters = () => {
    const [data, setCharacters] = useState<DragonballAPI.CharactersResponse>();
    const [isLoading, startTransition] = useTransition();
    const [error, setError] = useState<unknown>();

    const fetch = useCallback(() => {
        startTransition(async () => {
            try {
                const data = await DragonballCharacters.getAll();
                setCharacters(data);
            } catch (error) {
                setError(error);
            }
        });
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return {
        characters: data?.items,
        meta: data?.meta,
        links: data?.links,
        isLoading,
        error,
        refetch: () => fetch()
    };
}
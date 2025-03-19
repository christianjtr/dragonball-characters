import { useEffect, useState, useCallback, useTransition } from "react";
import type { DragonballAPI } from "@services/apis/dragonball/types";
import { DragonballCharacters } from "@services/apis/dragonball";

export const useFetchCharacters = () => {
    const [characters, setCharacters] = useState<DragonballAPI.CharactersResponse['items']>();
    const [isLoading, startTransition] = useTransition();
    const [error, setError] = useState<unknown>();

    const fetch = useCallback(() => {
        startTransition(async () => {
            try {
                const data = await DragonballCharacters.getAll();
                setCharacters(data.items);
            } catch (error) {
                setError(error);
            }
        });
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return {
        characters,
        isLoading,
        error,
        refetch: () => fetch()
    };
}
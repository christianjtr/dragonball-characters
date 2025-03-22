import { useEffect, useState, useCallback, useTransition } from "react";
import type { DragonballAPI } from "@services/apis/dragonball/types";
import { DragonballCharactersService } from "@services/apis/dragonball";

export const useFetchCharacterById = (id: number | string) => {
    const [character, setCharacter] = useState<DragonballAPI.CharacterResponse>();
    const [isLoading, startTransition] = useTransition();
    const [error, setError] = useState<unknown>();

    const fetch = useCallback(() => {
        startTransition(async () => {
            try {
                const data = await DragonballCharactersService.getById(id);
                setCharacter(data);
            } catch (error) {
                setError(error);
            }
        });
    }, [id]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return {
        character,
        isLoading,
        error,
        refetch: () => fetch()
    };
}
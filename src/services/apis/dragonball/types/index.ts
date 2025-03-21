import type { Character, CharacterSummary } from "./Character";

export type Meta = {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export type Links = {
    first: string;
    previous: string;
    next: string;
    last: string;
}

export namespace DragonballAPI {
    export interface CharactersResponse {
        items: CharacterSummary[];
        meta: Meta;
        links: Links;
    }

    export type CharacterResponse = Character;
}
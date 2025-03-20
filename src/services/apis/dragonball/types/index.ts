import type { Character } from "./Character";

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
        items: Omit<Character, 'originPlanet' | 'transformations'>[];
        meta: Meta;
        links: Links;
    }

    export type CharacterResponse = Character;
}
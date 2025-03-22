import type { Character, CharacterSummary } from "./Character";
import { GENDER } from "./Gender";
import { AFFILIATION } from "./Affiliation";
import { RACE } from "./Race";
export namespace DragonballAPI {
    export type Meta = {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };

    export type Links = {
        first: string;
        previous: string | null;
        next: string | null;
        last: string;
    };
    export interface CharactersResponse {
        items: CharacterSummary[];
        meta: Meta;
        links: Links;
    }

    export type Pagination = {
        page: number;
        limit?: number;
    }

    export type Filters = {
        name?: string;
        gender?: GENDER;
        race?: RACE;
        affiliation?: AFFILIATION;
    }

    export type CharacterResponse = Character;
}
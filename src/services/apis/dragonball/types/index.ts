import type { Pagination } from '@app-types/Pagination';
import type { Character, CharacterSummary } from "./Character";
export namespace DragonballAPI {
    export interface CharactersResponse {
        items: CharacterSummary[];
        meta: Pagination.Meta;
        links: Pagination.Links;
    }

    export type CharacterResponse = Character;
}
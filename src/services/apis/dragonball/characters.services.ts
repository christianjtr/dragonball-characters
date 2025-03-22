import qs from 'qs';
import type { DragonballAPI } from './types';
import { dragonballAPI } from './configuration';

export const baseURL = '/characters';

export interface GetAllCharactersServiceProps {
    pagination?: DragonballAPI.Pagination;
    filters?: DragonballAPI.Filters;
    url?: string;
}

const defaultPagination = {
    page: 1,
    limit: 10,
};

async function getAll(opts?: GetAllCharactersServiceProps): Promise<DragonballAPI.CharactersResponse> {
    const { pagination, filters, url } = opts || { pagination: defaultPagination };
    const queryString = qs.stringify({ ...pagination, ...filters }, { addQueryPrefix: true, skipNulls: true });

    const requestURL = url || `${baseURL}${queryString}`;

    try {
        const result = await dragonballAPI.get<DragonballAPI.CharactersResponse>(requestURL);
        return result;
    } catch (error) {
        console.error('[DRAGON_BALL API][CHARACTERS][ERROR][getAll]', error);
        throw error;
    }
}

async function getById(id: number | string): Promise<DragonballAPI.CharacterResponse> {
    try {
        const result = await dragonballAPI.get<DragonballAPI.CharacterResponse>(`${baseURL}/${id}`);
        return result;
    } catch (error) {
        const payload = { id };
        console.error(`[DRAGON_BALL API][CHARACTERS][ERROR][getById] ${payload}`, error);
        throw error;
    }
}

export const DragonballCharactersService = {
    getAll,
    getById
}

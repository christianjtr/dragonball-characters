// import qs from 'qs';
import type { DragonballAPI } from './types';
import { dragonballAPI } from './configuration';

export const baseURL = '/characters';

async function getAll(): Promise<DragonballAPI.CharactersResponse> {
    try {
        const result = await dragonballAPI.get<DragonballAPI.CharactersResponse>(`${baseURL}`);
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

export default {
    getAll,
    getById
}

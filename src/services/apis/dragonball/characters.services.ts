// import qs from 'qs';
import { dragonballAPI } from './configuration';

export const baseURL = '/characters';

async function getAll(): Promise<unknown> {
    try {
        const response = await dragonballAPI.get(`${baseURL}`);
        const results = await response.json();
        return results;
    } catch (error) {
        console.error('[DRAGON_BALL API][CHARACTERS][ERROR][getAll]', error);
        throw error;
    }
}

async function getById(id: number | string): Promise<unknown> {
    try {
        const response = await dragonballAPI.get(`${baseURL}/${id}`);
        const results = await response.json();
        return results;
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

import { createHTTPClient } from '@clients/httpClient';

const API_CONFIGURATION = {
    BASE_API_URL: 'https://dragonball-api.com/api',
};

export const dragonballAPI = createHTTPClient({
    baseURL: API_CONFIGURATION.BASE_API_URL
});
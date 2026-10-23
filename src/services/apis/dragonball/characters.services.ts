import qs from "qs";
import { ARCADE_CONFIG } from "@config/arcadeConfig";
import type { DragonballAPI } from "./types";
import type { CharacterSummary } from "./types/Character";
import { isAbortError } from "@clients/httpClient";
import { dragonballAPI } from "./configuration";

export const baseURL = "/characters";

export interface GetAllCharactersServiceProps {
  pagination?: DragonballAPI.Pagination;
  filters?: DragonballAPI.Filters;
  url?: string;
}

const defaultPagination: DragonballAPI.Pagination = {
  page: 1,
  limit: 10,
};

async function getAll(
  opts?: GetAllCharactersServiceProps,
  config?: RequestInit,
): Promise<DragonballAPI.CharactersResponse> {
  const { pagination = defaultPagination, filters, url } = opts ?? {};
  const queryString = qs.stringify(
    { ...pagination, ...filters },
    { addQueryPrefix: true, skipNulls: true },
  );

  const requestURL = url || `${baseURL}${queryString}`;

  try {
    const result = await dragonballAPI.get<DragonballAPI.CharactersResponse>(
      requestURL,
      config,
    );
    return result;
  } catch (error) {
    if (!isAbortError(error)) {
      console.error("[DRAGON_BALL API][CHARACTERS][ERROR][getAll]", error);
    }
    throw error;
  }
}

async function getAllRoster(config?: RequestInit): Promise<CharacterSummary[]> {
  const firstPage = await getAll(
    { pagination: { page: 1, limit: ARCADE_CONFIG.roster.pageSize } },
    config,
  );

  const items = [...firstPage.items];
  const totalPages = firstPage.meta?.totalPages ?? 1;

  for (let page = 2; page <= totalPages; page += 1) {
    const nextPage = await getAll(
      { pagination: { page, limit: ARCADE_CONFIG.roster.pageSize } },
      config,
    );
    items.push(...nextPage.items);
  }

  return items.filter((character) => character.deletedAt === null);
}

async function getById(
  id: number | string,
  config?: RequestInit,
): Promise<DragonballAPI.CharacterResponse> {
  try {
    const result = await dragonballAPI.get<DragonballAPI.CharacterResponse>(
      `${baseURL}/${id}`,
      config,
    );
    return result;
  } catch (error) {
    if (!isAbortError(error)) {
      const payload = { id };
      console.error(
        `[DRAGON_BALL API][CHARACTERS][ERROR][getById] ${JSON.stringify(payload)}`,
        error,
      );
    }
    throw error;
  }
}

export const DragonballCharactersService = {
  getAll,
  getAllRoster,
  getById,
};

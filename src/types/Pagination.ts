export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_CURRENT_PAGE = 1;
export const DEFAULT_TOTAL_PAGE = 1;
export const ALLOWED_PAGE_SIZES = [5, 10, 15];

export type Pagination = {
    page: number;
    limit: number;
}
export namespace Pagination {
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
}
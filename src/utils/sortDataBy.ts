import sortBy from "lodash/sortBy";

export const sortDataBy = <TData extends Record<PropertyKey, unknown>>(data: TData[], fields: string[]): TData[] => {
    if (data.length === 0) {
        return data;
    }
    const [itemToCheck] = data;
    const canSort = Object.keys(itemToCheck).every((key) => key in itemToCheck);

    if (canSort) {
        return sortBy(data, fields);
    }

    return data;
}
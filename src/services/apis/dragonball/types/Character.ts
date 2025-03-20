import type { Planet } from "./Planet";
import type { Transformation } from "./Transformation";

export interface Character {
    id: number;
    name: string;
    ki: string;
    maxKi: string;
    race: string;
    gender: string;
    description: string;
    image: string;
    affiliation: string;
    deletedAt: null | string;
    originPlanet: Planet;
    transformations: Transformation[];
}
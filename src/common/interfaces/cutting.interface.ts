import type { Garments } from "./garments.interface";
import type { User } from "./user.interface";

export interface Cutting {
    _id?: string;
    date: string | null;
    productionOrder: number | null;
    garmentCode: Garments | string | null;
    streak: number | null;
    layers: number | null;
    longStroke: number | null;
    unitsPerLayer: number | null;
    initCutter: string | null;
    endCutter: string | null;
    operation: string;
    operator: User | string | null;
}
import type { Operation } from "./operation.interface";
import type { User } from "./user.interface";

export interface Cutting {
    _id?: string;
    date: string | null;
    productionOrder: number | null;
    streak: number | null;
    layers: number | null;
    longStroke: number | null;
    unitsPerLayer: number | null;
    initCutter: string | null;
    endCutter: string | null;
    operation: Operation | string | null;
    operator: User | string | null;
    estimatedTime: number;
    efficiency: string;
}
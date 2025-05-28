import type { Garments } from "./garments.interface";
import type { User } from "./user.interface";

export interface Quality {
    _id?: string;
    date: string | null;
    productionOrder: number | null;
    garmentCode: Garments | string | null;
    operation: string | null;
    unitsChecked: number | null;
    initQuality: string | null;
    endQuality: string | null;
    operator: User | string | null;
}
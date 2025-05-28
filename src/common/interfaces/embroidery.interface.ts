import type { Garments } from "./garments.interface";
import type { User } from "./user.interface";

export interface Embroidery {
    _id?: string;
    date: string | null;
    productionOrder: number | null;
    garmentCode: Garments | string | null;
    initEmbroidery: string | null;
    endEmbroidery: string | null;
    embroideryType: string | null;
    usedHeaders: number | null;
    size: string | null;
    quantity: number | null;
    operator: User | string | null;
}
import type { Garments } from "./garments.interface";
import type { Operation } from "./operation.interface";

export interface Time {
    _id?: string;
    operation: Operation | string | null;
    standardTime: number | null;
    standardReference?: number | null;
    garment: Garments | string | null;
}
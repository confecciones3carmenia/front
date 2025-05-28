import type { Garments } from "./garments.interface";
import type { User } from "./user.interface";

export interface Stamped {
    _id?: string;
    date: string | null;
    productionOrder: number | null;
    garmentCode: Garments | string | null;
    fusedPiece: string | null;
    unitPerPlate: number | null;
    quantity: number | null;
    initStamped: string | null;
    endStamped: string | null;
    operator: User | string | null;
}
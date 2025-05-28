import type { User } from "./user.interface";

export interface ScreenControl {
    id?: string | null;
    user: User | string | Value | null;
    operationTimes: Array<string> | Array<Code> | null;
    timeProvidedUnit: number | null;
    timeTotal?: number | null;
    initOperation?: string | null;
    endOperation?: string | null;
    targetTime?: string | null;
    efficiency?: string | null;
    discount?: number | null;
    operationsToShow?: string | null;
    operationOrder?: string | null;
}

export interface Value {
    value: string | null;
    label: string | null;
}

export interface Code {
    _id: string | null;
    code: string | null;
}
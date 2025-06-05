import type { Garments } from "./garments.interface";
import type { Operation } from "./operation.interface";

export interface Time {
    _id?: string;
    operation: Operation | string | null;
    standardTime: number | null;
    standardReference?: number | null;
    garment: Garments | string | null;
}

export interface TimeCreationPayload {
  operation: string;
  garment: string;
  standardTime: number;
  standardReference?: number | null;
}

export interface TimeExcelRow {
  codigo_operacion?: string;
  codigo_prenda?: string;
  tiempo_estandar?: number;
  tiempo_suplemento?: number;
  [key: string]: unknown; // Allow other potential columns to be ignored
}
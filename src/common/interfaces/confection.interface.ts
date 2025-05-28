import type { Garments } from "./garments.interface";
import type { Operation } from "./operation.interface";
import type { User } from "./user.interface";

export interface Confection {
  id?: string | null;
  operationOrder: string;
  garmentCode: Garments | string;
  operation: Operation | string;
  operator: User | string;
  units: number;
  initConfection: string |null;
  endConfection: string |null;
  estimatedTime: number;
  discountTime: number;
  realWorkTime: number;
  efficiency: string;
  createdAt?: Date | string | null;
}

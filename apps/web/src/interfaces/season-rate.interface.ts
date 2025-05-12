import { IRoom } from "./property.interface";

export interface ISeasonRate {
  id: number;
  tenant_id: number;
  value_type: 'NOMINAL' | 'PERCENTAGE';
  value: number;
  start_date: string;
  end_date: string;
  type: 'INCREASE' | 'DECREASE';
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  status: string;
  roomHasPeakSeasonRates: IRoom[];
}

export interface ISeasonRateCreate {
  value_type: 'NOMINAL' | 'PERCENTAGE';
  value: number;
  start_date: string;
  end_date: string;
  type: 'INCREASE' | 'DECREASE';
  description: string;
  rooms: number[];
} 
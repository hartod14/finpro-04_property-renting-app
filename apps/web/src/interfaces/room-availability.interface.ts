import { IRoom } from "./property.interface";

export interface IRoomAvailability {
  id: number;
  tenant_id: number;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  status: string;
  roomHasUnavailableDates: IRoom[];
}

export interface IRoomAvailabilityCreate {
  start_date: string;
  end_date: string;
  description: string;
  rooms: number[];
}


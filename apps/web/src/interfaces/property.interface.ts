import { ICategory } from "./category.interface";
import { ICity } from "./city.interface";
import { IFacility } from "./facility.interface";

interface IPropertyImage {
  id: number;
  path: string;
  property_id: number;
}

interface IRoomImage {
  id: number;
  path: string;
  room_id: number;
}

interface IRoom {
  id: number;
  name: string;
  base_price: number;
  capacity: number;
  size: number;
  total_room: number;
  facilities: IFacility[];
  images: IRoomImage[];
}

interface ITenant {
  id: number;
  name: string;
  email: string;
}

export interface IProperty {
  id: number;
  name: string;
  description: string | null;
  address: string;
  checkin_time: string | null;
  checkout_time: string | null;
  category: ICategory;
  city: ICity;
  tenant: ITenant;
  facilities: IFacility[];
  images: IPropertyImage[];
  lowestPriceRoom: IRoom | null;
} 
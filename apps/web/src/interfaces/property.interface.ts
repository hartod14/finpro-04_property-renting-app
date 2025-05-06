import { ICategory } from './category.interface';
import { ICity } from './city.interface';
import { IFacility } from './facility.interface';

export interface IPropertyImage {
  id: number;
  path: string;
  property_id: number;
}

export interface IRoomImage {
  id: number;
  path: string;
  room_id: number;
}

export interface IRoom {
  id: number;
  name: string;
  base_price: number;
  capacity: number;
  size: number;
  total_room: number;
  facilities: IFacility[];
  images: IRoomImage[];
  description?: string;
}

export interface ITenant {
  id: number;
  name: string;
  email: string;
  profile_picture: string;
}

export interface IProperty {
  id: number;
  name: string;
  slug: string;
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
  rooms?: IRoom[];
  propertyImages: IPropertyImage[];
}
export interface IPropertyCreate {
  name: string;
  checkin_time: string;
  checkout_time: string;
  description: string;
  address: string;
  city_id: string;
  category_id: string;
  images: string[];
  facilities: number[];
  rooms: {
    name: string;
    base_price: string;
    description: string;
    capacity: string;
    size: string;
    total_room: string;
    images: string[];
    facilities: number[];
  }[];
}

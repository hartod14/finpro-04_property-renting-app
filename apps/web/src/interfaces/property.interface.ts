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
  adjusted_price?: number;
  capacity: number;
  size: number;
  total_room: number;
  facilities: IFacility[];
  roomImages: IRoomImage[];
  description?: string;
  property: IProperty;
  roomHasPeakSeasonRates?: any[];
  roomHasUnavailableDates?: any[];
  bookings?: IBooking[];
  rooms_left?: number;
}

export interface IRoomCreate {
  name: string;
  base_price: string;
  description: string;
  capacity: string;
  size: string;
  total_room: string;
  roomImages: string[];
  facilities: number[];
}

export interface ITenant {
  id: number;
  name: string;
  email: string;
  profile_picture: string;
}


export interface IReview {
  id: number;
  rating: number;
  comment: string;
  reply?: string;
  reply_at?: string;
  created_at: string;
  user: {
    name: string;
    profile_picture: string | null;
  };
  tenant?: {
    name: string;
    profile_picture: string | null;
  };  
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
  reviews: IReview[]; 
  latitude?: string;
  longitude?: string;
}

export interface IPropertyDetail {
  id: number;
  name: string;
  checkin_time: string;
  checkout_time: string;
  description: string;
  address: string;
  city_id: string;
  category_id: string;
  images: IPropertyImage[] | string[];
  facilities: IFacility[] | number[];
  latitude?: string;
  longitude?: string;
  rooms?: {
    id?: number;
    name: string;
    base_price: number | string;
    description: string;
    capacity: number | string;
    size: number | string;
    total_room: number | string;
    roomImages: string[];
    facilities: number[];
  }[];
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
  latitude: string;
  longitude: string;
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

export interface IPropertyUpdate {
  name: string;
  checkin_time: string;
  checkout_time: string;
  description: string;
  address: string;
  city_id: string;
  category_id: string;
  images: string[];
  facilities: number[];
  latitude: string;
  longitude: string;
}

// Extend IRoom to include availability status
export interface IRoomWithAvailability extends IRoom {
  isAvailable: boolean;
  rooms_left: number;
}

export interface IBooking {
  id: number;
  user_id: number;
  room_id: number;
  payment_id: number;
  order_number: string;
  checkin_date: string;
  checkout_date: string;
  status: string;
}

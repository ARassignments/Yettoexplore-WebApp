import { Tour, TourBatch } from './tour.model';
import { User } from './user.model';

export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancel_requested'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface Passenger {
  id?: number;
  full_name: string;
  cnic_passport?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  is_lead?: boolean;
  phone?: string;
  special_requirements?: string;
}

export interface BookingAddon {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Booking {
  id: number;
  booking_number: string;
  user_id: number;
  tour_id: number;
  agency_id: number;
  batch_id: number;
  travel_date: string;
  adults_count: number;
  children_count: number;
  infants_count: number;
  total_passengers: number;
  subtotal: number;
  discount_amount: number;
  coupon_code?: string;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  qr_code_token?: string;
  qr_code_url?: string;
  passengers: Passenger[];
  addons?: BookingAddon[];
  tour?: Tour;
  batch?: TourBatch;
  user?: User;
  created_at: string;
  updated_at?: string;
}

export interface CreateBookingRequest {
  tour_id: number;
  batch_id: number;
  travel_date: string;
  adults_count: number;
  children_count?: number;
  infants_count?: number;
  passengers: Passenger[];
  addons?: { id: number; quantity: number }[];
  coupon_code?: string;
  notes?: string;
}

export interface BookingInitResponse {
  booking: Booking;
  client_secret?: string; // Stripe PaymentIntent client secret
  payment_url?: string;
}

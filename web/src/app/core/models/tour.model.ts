import { Agency } from './agency.model';

export interface Destination {
  id: number;
  name: string;
  slug: string;
  country: string;
  city?: string;
  image?: string;
  description?: string;
  is_featured?: boolean;
}

export interface TourItinerary {
  id: number;
  tour_id: number;
  day_number: number;
  title: string;
  description: string;
  meal_plan?: string;
  hotel_name?: string;
  activities?: string[];
}

export interface TourBatch {
  id: number;
  tour_id: number;
  start_date: string;
  end_date: string;
  total_seats: number;
  available_seats: number;
  price_override?: number;
  status: 'open' | 'filling_fast' | 'sold_out' | 'completed';
}

export interface Tour {
  id: number;
  agency_id: number;
  destination_id: number;
  title: string;
  slug: string;
  category?: string;
  tagline?: string;
  overview: string;
  cover_image: string;
  gallery_images?: string[];
  gallery?: string[];
  highlights?: string[];
  duration_days: number;
  duration_nights: number;
  base_price: number;
  discount_price?: number;
  child_price?: number;
  infant_price?: number;
  max_group_size?: number;
  group_size_max?: number;
  difficulty_level?: 'easy' | 'moderate' | 'challenging' | 'difficult' | string;
  difficulty?: 'easy' | 'moderate' | 'challenging' | 'difficult' | 'Easy' | 'Moderate' | 'Challenging' | 'Strenuous' | string;
  inclusions: string[];
  exclusions: string[];
  meeting_point?: string;
  is_featured: boolean;
  status: 'draft' | 'published' | 'active' | 'archived' | 'sold_out' | string;
  rating: number;
  reviews_count: number;
  agency?: Agency;
  destination?: Destination;
  itineraries?: TourItinerary[];
  batches?: TourBatch[];
  created_at: string;
}

export interface TourFilterParams {
  destination_id?: number;
  category?: string;
  min_price?: number;
  max_price?: number;
  duration_days?: number;
  difficulty?: string;
  start_date?: string;
  search?: string;
  page?: number;
  limit?: number;
}

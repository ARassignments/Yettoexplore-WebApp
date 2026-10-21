export interface Agency {
  id: number;
  user_id: number;
  company_name: string;
  slug: string;
  tagline?: string;
  description?: string;
  logo?: string;
  banner?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  is_verified: boolean;
  commission_rate: number;
  rating: number;
  total_reviews: number;
  total_tours: number;
  plan_id?: number;
  subscription_status?: 'active' | 'trialing' | 'past_due' | 'canceled';
  created_at: string;
}

export interface SaaSPlan {
  id: number;
  name: string;
  slug: string;
  price: number;
  interval: 'monthly' | 'yearly';
  tour_limit: number;
  features: string[];
  is_popular?: boolean;
}

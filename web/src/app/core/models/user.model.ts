export type UserRole =
  | 'super_admin'
  | 'agency_owner'
  | 'agency_agent'
  | 'tour_manager'
  | 'reservation_agent'
  | 'tour_guide'
  | 'agency_accountant'
  | 'customer_support'
  | 'customer'
  | string;

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  agency_id?: number;
  agency?: any;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
  expires_in?: number;
}

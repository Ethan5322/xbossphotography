export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type BookingSource = 'chatbot' | 'admin';
export type PackageId = 'standard' | 'medium' | 'premium' | 'super_premium';

export interface Booking {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  country: string;
  province: string;
  area: string;
  event_type: string;
  event_date: string;
  event_time: string;
  package: PackageId;
  terms_accepted: boolean;
  verification_code: string;
  status: BookingStatus;
  source: BookingSource;
  notes: string | null;
  created_at: string;
}

export interface CreateBookingPayload {
  full_name: string;
  phone: string;
  email: string;
  country: string;
  province: string;
  area: string;
  event_type: string;
  event_date: string;
  event_time: string;
  package: PackageId;
  terms_accepted: true;
  source?: BookingSource;
  notes?: string;
}

export type BookingStep =
  | 'greeting'
  | 'name'
  | 'phone'
  | 'email'
  | 'country'
  | 'province'
  | 'area'
  | 'event_type'
  | 'custom_event'
  | 'event_date'
  | 'event_time'
  | 'package'
  | 'review'
  | 'terms'
  | 'processing'
  | 'complete'
  | 'error';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  messageType: 'text' | 'event-options' | 'package-options' | 'terms' | 'complete';
}

export interface CollectedData {
  full_name?: string;
  phone?: string;
  email?: string;
  country?: string;
  province?: string;
  area?: string;
  event_type?: string;
  event_date?: string;
  event_time?: string;
  package?: PackageId;
}

export interface PackageInfo {
  id: PackageId;
  name: string;
  price: number;
  priceFormatted: string;
  coverage: string;
  photographers: number;
  editedImages: string;
  includes: string[];
  highlight: string;
}

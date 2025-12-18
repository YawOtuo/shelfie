// Enums and types
export type Gender = "MALE" | "FEMALE" | "MIXED";
export type ListingType = "FULL_ANIMAL" | "SHARED_PORTIONS" | "FROZEN";
export type TemplateType = "FULL_ANIMAL" | "SHARED_PORTIONS" | "FROZEN" | "SINGLE";

// Listing status enum
export enum ListingStatus {
  ACTIVE = "active",
  SOLD = "sold",
  PAUSED = "paused",
  EXPIRED = "expired",
  SUSPENDED = "suspended",
  PENDING = "pending",
  REJECTED = "rejected",
  DELETED = "deleted",
}

// Tag interface for listing responses
export interface ListingTag {
  id: number;
  identifier: string;
  name: string;
  description?: string;
  price: number;
  listing_id?: number;
  tag_id?: number;
  tag_name?: string;
  tag_identifier?: string;
  applied_at?: string;
  applied_by?: string | null;
  is_active?: boolean;
}

// Location filter interface
export interface LocationFilter {
  place_id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

// Base interfaces for type-specific listing details
export interface FrozenListingBase {
  weight?: number;
  cut_type?: string;
  packaging_type?: string;
  storage_instructions?: string;
  shelf_life?: string;
  processing_date?: string;
  certification?: string;
}

export interface FullAnimalListingBase {
  age?: number;
  weight?: number;
  gender?: Gender;
  breed?: string;
  health_status?: string;
  vaccination_history?: string;
  feeding_history?: string;
  special_characteristics?: string;
  quantity?: number;
}

export interface SharedPortionListingBase {
  total_weight?: number;
  portion_size?: number;
  portions_available?: number;
  minimum_portion_order?: number;
  cut_preference?: string;
  processing_date?: string;
  packaging_options?: string;
}

// Base listing interface
export interface ListingBase {
  title: string;
  description?: string;
  farm_location?: string;
  farm_email?: string; // Farm contact email
  farm_phone?: string; // Farm contact phone
  category: string; // "poultry" | "cattle" | "goats" | "sheep" | "pigs"
  subcategory?: string;
  breed?: string;
  production_type?: string;
  product_category?: string;
  type: ListingType;
  template: TemplateType;
  cost_price_per_unit?: number;
  selling_price_per_unit?: number;
  commission_fee?: number;
  negotiable: boolean;
  delivery: boolean;
  unit: string;
  location?: string;
  status: ListingStatus;
  rating?: number;
  latitude?: number;
  longitude?: number;
  distance_meters?: number;
  public: boolean;
  slaughterable?: boolean;
  slaughtering_fee?: number;
  slaughtering_notes?: string;
  number_of_portions?: number;
}

// Response interfaces
export interface FrozenListing extends FrozenListingBase {
  id: number;
  listing_id: number;
}

export interface FullAnimalListing extends FullAnimalListingBase {
  id: number;
  listing_id: number;
}

export interface SharedPortionListing extends SharedPortionListingBase {
  id: number;
  listing_id: number;
}

export interface ListingImage {
  id: number;
  listing_id: number;
  image_url: string;
  is_primary: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Listing extends ListingBase {
  id: number;
  user_uid: string;
  farm_id: number;
  farm_name: string;
  created_at: string;
  updated_at?: string;
  images: ListingImage[];
  applied_tags: ListingTag[];

  // Type-specific details
  frozen_details?: FrozenListing;
  full_animal_details?: FullAnimalListing;
  shared_portion_details?: SharedPortionListing;
}

// Legacy type for backward compatibility
export type LivestockCategory = "cattle" | "goats" | "sheep" | "poultry" | "pigs";

// Create and Update types
export interface ListingCreate extends Omit<ListingBase, 'id' | 'user_uid' | 'farm_id' | 'farm_name' | 'created_at' | 'updated_at' | 'images' | 'applied_tags' | 'rating' | 'distance_meters'> {
  image_urls?: string[];
  video_urls?: string[];
  tag_ids?: number[];
}

export interface ListingUpdate extends Partial<Omit<ListingBase, 'id' | 'user_uid' | 'farm_id' | 'farm_name' | 'created_at' | 'updated_at' | 'images' | 'applied_tags' | 'rating' | 'distance_meters'>> {
  image_urls?: string[];
  video_urls?: string[];
  tag_ids?: number[];
}

export interface ListingPauseResponse {
  id: number;
  paused: boolean;
  message: string;
}

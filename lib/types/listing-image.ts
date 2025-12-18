import { ListingImage as ExistingListingImage } from "./listing";

// Response interfaces matching the backend schema
export interface ListingImage {
  id: number;
  listing_id: number;
  image_url: string;
  is_primary: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ListingImageListResponse {
  images: ListingImage[];
  total_count: number;
}

export interface AddImageResponse {
  message: string;
  image: ListingImage;
}

export interface DeleteImageResponse {
  message: string;
  deleted_image_id: number;
}

// Create interface for adding images
export interface AddImageRequest {
  image: File;
  is_primary?: boolean;
}

// Update interface for modifying image properties
export interface UpdateImageRequest {
  is_primary?: boolean;
} 
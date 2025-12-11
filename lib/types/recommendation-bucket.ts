import { Listing } from "./listing";

export interface RecommendationBucket {
  id: number;
  title: string;
  description?: string;
  expires_at?: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
  display_on_homepage: boolean;
  listings: RecommendationBucketListing[];
}

export interface RecommendationBucketListing {
  id: number;
  bucket_id: number;
  listing_id: number;
  listing: Listing;
  created_at: string;
}


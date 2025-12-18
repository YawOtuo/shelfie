import { Listing } from "./listing";
import { Farm } from "./farm";

export interface SavedListingBase {
    listing_id: number;
}

export interface SavedListingCreate extends SavedListingBase {}

export interface SavedListing extends SavedListingBase {
    id: number;
    user_uid: string;
    created_at: string;
    updated_at?: string;
    listing: Listing;
}

export interface SavedFarmBase {
    farm_id: number;
}

export interface SavedFarmCreate extends SavedFarmBase {}

export interface SavedFarm extends SavedFarmBase {
    id: number;
    user_uid: string;
    created_at: string;
    updated_at?: string;
    farm_info: Farm;
} 
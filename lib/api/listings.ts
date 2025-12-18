import { marketplaceAxios } from "../axiosinstance";
import {
  Listing,
  ListingCreate,
  ListingPauseResponse,
  ListingUpdate,
  LocationFilter,
  Gender,
  ListingType,
  TemplateType
} from "../types/listing";

export interface ListingsFilters {
  skip?: number;
  limit?: number;
  user_uid?: string;
  farm_id?: number;
  category?: string | string[]; // "poultry" | "cattle" | "goats" | "sheep" | "pigs"
  subcategory?: string | string[];
  type?: ListingType | ListingType[];
  template?: TemplateType;
  gender?: Gender;
  breed?: string | string[];
  production_type?: string | string[];
  min_price?: number;
  max_price?: number;
  min_age?: number;
  max_age?: number;
  min_weight?: number;
  max_weight?: number;
  delivery?: boolean;
  negotiable?: boolean;
  tags?: string[];
  health_status?: string;
  search_query?: string;
  // User location (from IP)
  user_latitude?: number;
  user_longitude?: number;
  // Additional locations for filtering
  locations?: LocationFilter[];
  max_distance?: number;
}

export async function createListing(data: ListingCreate): Promise<Listing> {
  // Send JSON with image_urls and video_urls as string arrays
  const response = await marketplaceAxios.post<Listing>('/api/listings', data);
  return response.data;
}

export async function getListing(id: number): Promise<Listing> {
  const response = await marketplaceAxios.get<Listing>(`/api/listings/${id}`);
  return response.data;
}

export async function getListings(filters?: ListingsFilters): Promise<Listing[]> {
  const params = new URLSearchParams();
  const headers: Record<string, string> = {};
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        // Handle user location in headers
        if (key === 'user_latitude' || key === 'user_longitude') {
          headers[key] = value.toString();
        }
        // Handle arrays by joining with commas, except for locations which should be JSON
        else if (Array.isArray(value)) {
          if (key === 'locations') {
            const locationsJson = JSON.stringify(value);
            params.append(key, locationsJson);
            console.log(`Adding locations parameter: ${key}=${locationsJson}`);
          } else {
            params.append(key, value.join(','));
          }
        } else {
          params.append(key, value.toString());
        }
      }
    });
  }
  
  const url = `/api/listings?${params.toString()}`;
  console.log("Calling listings API with URL:", url);
  console.log("Headers:", headers);
  
  const response = await marketplaceAxios.get<Listing[]>(url, { headers });
  return response.data;
}

export async function updateListing(id: number, data: ListingUpdate): Promise<Listing> {
  const response = await marketplaceAxios.patch<Listing>(`/api/listings/${id}`, data);
  return response.data;
}

export async function deleteListing(id: number): Promise<void> {
  await marketplaceAxios.delete(`/api/listings/${id}`);
}

export async function pauseListing(id: number, pause: boolean = true): Promise<ListingPauseResponse> {
  const response = await marketplaceAxios.patch<ListingPauseResponse>(`/api/listings/${id}/pause?pause=${pause}`);
  return response.data;
}

export async function getMyListings(params?: {
  skip?: number;
  limit?: number;
  status?: string;
}): Promise<Listing[]> {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const url = `/api/listings/my-listings?${queryParams.toString()}`;
  const response = await marketplaceAxios.get<Listing[]>(url);
  return response.data;
} 

export async function getListingsBulkByIds(listingIds: number[]): Promise<Listing[]> {
  const response = await marketplaceAxios.post<Listing[]>(
    '/api/listings/bulk-by-ids',
    { listing_ids: listingIds }
  );
  return response.data;
}

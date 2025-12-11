import { marketplaceAxios } from "../axiosinstance";
import { Listing } from "../types/listing";

export interface ListingsFilters {
  skip?: number;
  limit?: number;
  user_uid?: string;
  farm_id?: number;
  category?: string | string[];
  subcategory?: string | string[];
  type?: string | string[];
  breed?: string | string[];
  min_price?: number;
  max_price?: number;
  min_age?: number;
  max_age?: number;
  min_weight?: number;
  max_weight?: number;
  delivery?: boolean;
  negotiable?: boolean;
  search_query?: string;
  user_latitude?: number;
  user_longitude?: number;
  max_distance?: number;
}

export async function getListings(filters?: ListingsFilters): Promise<Listing[]> {
  const params = new URLSearchParams();
  const headers: Record<string, string> = {};

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        // Handle user location in headers
        if (key === "user_latitude" || key === "user_longitude") {
          headers[key] = value.toString();
        }
        // Handle arrays by joining with commas
        else if (Array.isArray(value)) {
          params.append(key, value.join(","));
        } else {
          params.append(key, value.toString());
        }
      }
    });
  }

  const url = `api/listings?${params.toString()}`;
  const response = await marketplaceAxios.get<Listing[]>(url, { 
    headers,
    timeout: 10000,
  });
  return response.data;
}

export async function getListing(id: number): Promise<Listing> {
  const response = await marketplaceAxios.get<Listing>(`api/listings/${id}`);
  return response.data;
}


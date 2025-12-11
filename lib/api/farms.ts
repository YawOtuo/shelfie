import { coreAxios } from "../axiosinstance";
import { Farm } from "../types/farm";

export interface FarmFilters {
  search_query?: string;
  limit?: number;
  skip?: number;
  livestock_categories?: string[];
  listing_types?: string[];
  tags?: string[];
  features?: string[];
  min_size?: number;
  max_size?: number;
  country?: string;
  min_rating?: number;
  max_rating?: number;
  user_latitude?: number;
  user_longitude?: number;
  max_distance?: number;
  sort_by?: "popular" | "newest" | "closest" | "rating" | "name";
}

export const getAllFarms = async (filters?: FarmFilters): Promise<Farm[]> => {
  const params = new URLSearchParams();

  if (filters?.search_query) {
    params.set("search_query", filters.search_query);
  }
  if (filters?.limit) {
    params.set("limit", filters.limit.toString());
  }
  if (filters?.skip) {
    params.set("skip", filters.skip.toString());
  }
  
  // Filter arrays
  if (filters?.livestock_categories && filters.livestock_categories.length > 0) {
    filters.livestock_categories.forEach((category) => {
      params.append("livestock_categories", category);
    });
  }
  
  if (filters?.sort_by) {
    params.set("sort_by", filters.sort_by);
  }

  // Headers for user location
  const headers: Record<string, string> = {};
  if (filters?.user_latitude !== undefined) {
    headers["user_latitude"] = filters.user_latitude.toString();
  }
  if (filters?.user_longitude !== undefined) {
    headers["user_longitude"] = filters.user_longitude.toString();
  }

  const response = await coreAxios.get(`api/farms?${params.toString()}`, { headers });
  return response.data;
};

export const getFarmById = async (id: string): Promise<Farm> => {
  const response = await coreAxios.get(`api/farms/${id}`);
  return response.data;
};


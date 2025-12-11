import { useQuery } from "@tanstack/react-query";
import { getListings, getListing, ListingsFilters } from "../api/listings";
import { Listing } from "../types/listing";

export function useListings(filters?: ListingsFilters) {
  const query = useQuery<Listing[], Error>({
    queryKey: ["listings", filters],
    queryFn: () => getListings(filters),
  });

  return {
    listings: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useListing(id: number) {
  const query = useQuery<Listing, Error>({
    queryKey: ["listing", id],
    queryFn: () => getListing(id),
    enabled: !!id,
  });

  return {
    listing: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}


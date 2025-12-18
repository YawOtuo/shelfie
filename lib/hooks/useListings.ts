import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ListingsFilters,
  createListing,
  deleteListing,
  getListing,
  getListings,
  getListingsBulkByIds,
  getMyListings,
  pauseListing,
  updateListing
} from "../api/listings";
import { Listing, ListingUpdate } from "../types/listing";
import { useGetCurrentUser } from "./useGetCurrentUser";

export function useListings(filters?: ListingsFilters) {
  const query = useQuery<Listing[], Error>({
    queryKey: ["listings", filters],
    queryFn: () => getListings(filters),
  });

  return {
    listings: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}

// Hook for getting current user's listings (for farmers)
export function useMyListings(params?: {
  skip?: number;
  limit?: number;
  status?: string;
}) {
  const { user } = useGetCurrentUser();

  const query = useQuery<Listing[], Error>({
    queryKey: ["my-listings", params],
    queryFn: () => getMyListings(params),
    enabled: !!user,
  });

  return {
    listings: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      // Invalidate queries to refresh listings
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
    onError: (error: Error) => {
      // Error handling without toast
      console.error("Failed to create listing:", error);
    },
  });
}

export function useGetListing(listingId: number) {
  return useQuery<Listing, Error>({
    queryKey: ["listings", listingId],
    queryFn: () => getListing(listingId),
    enabled: !!listingId,
  });
}

// Alias for backward compatibility
export const useGetListingById = useGetListing;

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ListingUpdate }) => 
      updateListing(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listings", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (error: Error) => {
      // Error handling without toast
      console.error("Failed to update listing:", error);
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (error: Error) => {
      // Error handling without toast
      console.error("Failed to delete listing:", error);
    },
  });
}

export function usePauseListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, pause }: { id: number; pause: boolean }) => pauseListing(id, pause),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listings", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (error: Error) => {
      // Error handling without toast
      console.error("Failed to pause/unpause listing:", error);
    },
  });
} 

export function useListingsBulkByIds(listingIds: number[] | undefined) {
  const query = useQuery<Listing[], Error>({
    queryKey: ["listings-bulk-by-ids", listingIds],
    queryFn: () => listingIds && listingIds.length > 0 ? getListingsBulkByIds(listingIds) : Promise.resolve([]),
    enabled: !!listingIds && listingIds.length > 0,
  });

  return {
    listings: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}

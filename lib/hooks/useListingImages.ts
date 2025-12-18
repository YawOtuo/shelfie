import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addImageToListing,
  deleteImageFromListing,
  getListingImages
} from "../api/listing-images";
import { AddImageResponse, DeleteImageResponse, ListingImageListResponse } from "../types/listing-image";

// Hook to get listing images
export function useGetListingImages(listingId: number) {
  return useQuery<ListingImageListResponse, Error>({
    queryKey: ["listing-images", listingId],
    queryFn: () => getListingImages(listingId),
    enabled: !!listingId && listingId > 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Hook to add image to listing
export function useAddListingImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      listingId, 
      imageUrl, 
      isPrimary = false 
    }: { 
      listingId: number; 
      imageUrl: string; 
      isPrimary?: boolean; 
    }) => addImageToListing(listingId, imageUrl, isPrimary),
    onSuccess: (data: AddImageResponse, variables) => {
      // Invalidate and refetch listing images
      queryClient.invalidateQueries({ queryKey: ["listing-images", variables.listingId] });
      // Also invalidate the listing itself since it contains images
      queryClient.invalidateQueries({ queryKey: ["listings", variables.listingId] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (error: Error) => {
      console.error("Failed to add image:", error);
    },
  });
}

// Hook to delete image from listing
export function useDeleteListingImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      listingId, 
      imageId 
    }: { 
      listingId: number; 
      imageId: number; 
    }) => deleteImageFromListing(listingId, imageId),
    onSuccess: (data: DeleteImageResponse, variables) => {
      // Invalidate and refetch listing images
      queryClient.invalidateQueries({ queryKey: ["listing-images", variables.listingId] });
      // Also invalidate the listing itself since it contains images
      queryClient.invalidateQueries({ queryKey: ["listings", variables.listingId] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (error: Error) => {
      console.error("Failed to delete image:", error);
    },
  });
} 
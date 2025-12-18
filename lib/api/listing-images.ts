import { marketplaceAxios } from "../axiosinstance";
import { AddImageResponse, DeleteImageResponse, ListingImageListResponse } from "../types/listing-image";

export async function getListingImages(listingId: number): Promise<ListingImageListResponse> {
  const response = await marketplaceAxios.get<ListingImageListResponse>(`/api/listings/${listingId}/images`);
  return response.data;
}

export async function addImageToListing(
  listingId: number,
  imageUrl: string,
  isPrimary: boolean = false
): Promise<AddImageResponse> {
  const response = await marketplaceAxios.post<AddImageResponse>(
    `/api/listings/${listingId}/images`,
    {
      image_url: imageUrl,
      is_primary: isPrimary,
    }
  );
  return response.data;
}

export async function deleteImageFromListing(
  listingId: number,
  imageId: number
): Promise<DeleteImageResponse> {
  const response = await marketplaceAxios.delete<DeleteImageResponse>(
    `/api/listings/${listingId}/images/${imageId}`
  );
  return response.data;
} 
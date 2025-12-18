import { marketplaceAxios } from "../axiosinstance";
import { SavedFarm, SavedListing } from "../types/saved-items";

export async function saveListing(listingId: number): Promise<SavedListing> {
    const response = await marketplaceAxios.post<SavedListing>(`/api/saved-items/listings/${listingId}`);
    return response.data;
}

export async function unsaveListing(listingId: number): Promise<void> {
    await marketplaceAxios.delete(`/api/saved-items/listings/${listingId}`);
}

export async function getSavedListings(skip: number = 0, limit: number = 100): Promise<SavedListing[]> {
    const response = await marketplaceAxios.get<SavedListing[]>(`/api/saved-items/listings?skip=${skip}&limit=${limit}`);
    return response.data;
}

export async function saveFarm(farmId: number): Promise<SavedFarm> {
    const response = await marketplaceAxios.post<SavedFarm>(`/api/saved-items/farms/${farmId}`);
    return response.data;
}

export async function unsaveFarm(farmId: number): Promise<void> {
    await marketplaceAxios.delete(`/api/saved-items/farms/${farmId}`);
}

export async function getSavedFarms(skip: number = 0, limit: number = 100): Promise<SavedFarm[]> {
    const response = await marketplaceAxios.get<SavedFarm[]>(`/api/saved-items/farms?skip=${skip}&limit=${limit}`);
    return response.data;
} 
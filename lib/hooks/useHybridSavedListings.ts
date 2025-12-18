import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthUser } from "../providers/AuthUserProvider";
import { LocalSavedItem, useSavedListingsInLocalStorage } from "../utils/savedItemsStorage";
import { useListingsBulkByIds } from "./useListings";
import {
    useSavedListings,
    useSaveListing,
    useUnsaveListing
} from "./useSavedItems";

// Hybrid hook for saved listings that handles all logic internally
export function useHybridSavedListings(skip: number = 0, limit: number = 100) {
    const { user, loading: userLoading } = useAuthUser();
    const savedListingsInLocalStorage = useSavedListingsInLocalStorage();
    const backendQuery = useSavedListings(skip, limit);

    // Get localStorage data
    const localSavedListings = savedListingsInLocalStorage.getSavedListings();
    const localListingIds = localSavedListings.map((item: LocalSavedItem) => item.id);

    // Use bulk API for logged out users
    const { listings: bulkListings, isLoading: isLoadingBulk } = useListingsBulkByIds(
        !user && !userLoading ? localListingIds : undefined
    );

    // Determine which data to use
    let finalData;
    let isLoading;
    let error;

    if (user && !userLoading) {
        // Logged in: use backend data (SavedItemsSyncProvider handles syncing)
        finalData = backendQuery.data || [];
        isLoading = userLoading || backendQuery.isLoading;
        error = backendQuery.error;
    } else {
        // Logged out: use bulk API data
        finalData = bulkListings.map((listing: any) => ({
            id: listing.id,
            listing_id: listing.id,
            user_uid: 'local',
            created_at: new Date().toISOString(),
            listing: listing
        }));
        // Only show loading if there are actually items to fetch
        isLoading = userLoading || (localListingIds.length > 0 && isLoadingBulk);
        error = null;
    }

    return {
        data: finalData,
        isLoading,
        error,
        refetch: backendQuery.refetch,
        isFromLocalStorage: !user || userLoading
    };
}

// Hybrid save listing hook
export function useHybridSaveListing() {
    const queryClient = useQueryClient();
    const { user, loading: userLoading } = useAuthUser();
    const savedListingsInLocalStorage = useSavedListingsInLocalStorage();
    const backendSaveListing = useSaveListing();

    return useMutation({
        mutationFn: async (listingId: number) => {
            // Always save to localStorage first
            savedListingsInLocalStorage.saveListing(listingId);
            
            // If user is logged in, also save to backend using existing hook
            if (user && !userLoading) {
                return await backendSaveListing.mutateAsync(listingId);
            }
            
            return { id: listingId, listing_id: listingId, user_uid: 'local' };
        },
        onSuccess: (data, listingId) => {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["saved-listings"] });
            queryClient.invalidateQueries({ queryKey: ["hybrid-saved-listings"] });
        },
        onError: (error: Error) => {
            // Remove from localStorage if backend save failed
            savedListingsInLocalStorage.removeListing(Number(error.message.match(/\d+/)?.[0] || 0));
        },
    });
}

// Hybrid unsave listing hook
export function useHybridUnsaveListing() {
    const queryClient = useQueryClient();
    const { user, loading: userLoading } = useAuthUser();
    const savedListingsInLocalStorage = useSavedListingsInLocalStorage();
    const backendUnsaveListing = useUnsaveListing();

    return useMutation({
        mutationFn: async (listingId: number) => {
            // Always remove from localStorage first
            savedListingsInLocalStorage.removeListing(listingId);
            
            // If user is logged in, also remove from backend using existing hook
            if (user && !userLoading) {
                await backendUnsaveListing.mutateAsync(listingId);
            }
            
            return { id: listingId };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-listings"] });
            queryClient.invalidateQueries({ queryKey: ["hybrid-saved-listings"] });
        },
        onError: (error: Error) => {
            // Error handling without toast
        },
    });
}

// Hook to sync localStorage listings to backend when user logs in
export function useSyncLocalSavedListingsToBackend() {
    const { user, loading: userLoading } = useAuthUser();
    const queryClient = useQueryClient();
    const savedListingsInLocalStorage = useSavedListingsInLocalStorage();
    const backendSaveListing = useSaveListing();
    
    const syncMutation = useMutation({
        mutationFn: async () => {
            const listingsToSync = savedListingsInLocalStorage.getListingsToSync();
            const results = [];
            
            for (const item of listingsToSync) {
                try {
                    await backendSaveListing.mutateAsync(item.id);
                    results.push({ success: true, item });
                } catch (error) {
                    results.push({ success: false, item, error });
                }
            }
            
            return results;
        },
        onSuccess: (results) => {
            const successCount = results.filter(r => r.success).length;
            const errorCount = results.length - successCount;
            
            // Refresh queries
            queryClient.invalidateQueries({ queryKey: ["saved-listings"] });
        },
        onError: (error: Error) => {
            // Error handling without toast
        },
    });

    // Auto-sync when user logs in
    useEffect(() => {
        if (user && !userLoading && !syncMutation.isPending) {
            const listingsToSync = savedListingsInLocalStorage.getListingsToSync();
            if (listingsToSync.length > 0) {
                syncMutation.mutate();
            }
        }
    }, [user, userLoading]);

    return {
        syncListings: syncMutation.mutate,
        isSyncing: syncMutation.isPending,
        syncError: syncMutation.error
    };
} 

// Hook to sync backend saved listings to localStorage when user logs in
export function useSyncBackendSavedListingsToLocalStorage() {
    const { user, loading: userLoading } = useAuthUser();
    const savedListingsInLocalStorage = useSavedListingsInLocalStorage();
    const backendQuery = useSavedListings();
    
    const syncMutation = useMutation({
        mutationFn: async () => {
            if (!backendQuery.data) return [];
            
            const backendListingIds = backendQuery.data.map((item: any) => item.listing_id);
            const localListingIds = savedListingsInLocalStorage.getSavedListings().map((item: LocalSavedItem) => item.id);
            
            // Find listings that exist in backend but not in localStorage
            const listingsToAdd = backendListingIds.filter((id: number) => !localListingIds.includes(id));
            
            const results = [];
            for (const listingId of listingsToAdd) {
                try {
                    savedListingsInLocalStorage.saveListing(listingId);
                    results.push({ success: true, listingId });
                } catch (error) {
                    results.push({ success: false, listingId, error });
                }
            }
            
            return results;
        },
        onSuccess: (results) => {
            const successCount = results.filter(r => r.success).length;
            // Sync completed without toast
        },
        onError: (error: Error) => {
            // Error handling without toast
        },
    });

    // Auto-sync when user logs in and backend data is available
    useEffect(() => {
        if (user && !userLoading && backendQuery.data && !syncMutation.isPending) {
            const backendListingIds = backendQuery.data.map((item: any) => item.listing_id);
            const localListingIds = savedListingsInLocalStorage.getSavedListings().map((item: LocalSavedItem) => item.id);
            
            // Only sync if there are backend listings not in localStorage
            const hasNewListings = backendListingIds.some((id: number) => !localListingIds.includes(id));
            
            if (hasNewListings) {
                syncMutation.mutate();
            }
        }
    }, [user, userLoading, backendQuery.data]);

    return {
        syncBackendToLocal: syncMutation.mutate,
        isSyncingBackendToLocal: syncMutation.isPending,
        syncBackendToLocalError: syncMutation.error as Error | null
    };
} 
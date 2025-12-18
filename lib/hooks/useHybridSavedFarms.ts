import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthUser } from "../providers/AuthUserProvider";

import { useSavedFarmsInLocalStorage, LocalSavedItem } from "../utils/savedItemsStorage";
import { useSaveFarm, useUnsaveFarm, useSavedFarms } from "./useSavedItems";
import { useGetAllFarms } from "./useFarms";

// Hybrid hook for saved farms that handles all logic internally
export function useHybridSavedFarms(skip: number = 0, limit: number = 100) {
    const { user, loading: userLoading } = useAuthUser();
    const savedFarmsInLocalStorage = useSavedFarmsInLocalStorage();
    const backendQuery = useGetAllFarms({
        skip,
        limit,
    });

    // Get localStorage data
    const localSavedFarms = savedFarmsInLocalStorage.getSavedFarms();
    const localFarmIds = localSavedFarms.map((item: LocalSavedItem) => item.id);

    // Use bulk API for logged out users
    const { data: bulkFarms = [], isLoading: isLoadingBulk } = useGetAllFarms({
        skip: !user && !userLoading ? localFarmIds.length : 0,
        limit: 100,
        search_query: '',
        sort_by: 'newest',
    });

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
        finalData = bulkFarms.map((farm: any) => ({
            farm_id: farm.id,
            user_uid: 'local',
            created_at: new Date().toISOString(),
            farm_info: farm
        }));
        // Only show loading if there are actually items to fetch
        isLoading = userLoading || (localFarmIds.length > 0 && isLoadingBulk);
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

// Hybrid save farm hook
export function useHybridSaveFarm() {
    const queryClient = useQueryClient();
    const { user, loading: userLoading } = useAuthUser();
    const savedFarmsInLocalStorage = useSavedFarmsInLocalStorage();
    const backendSaveFarm = useSaveFarm();

    return useMutation({
        mutationFn: async (farmId: number) => {
            // Always save to localStorage first
            savedFarmsInLocalStorage.saveFarm(farmId);
            
            // If user is logged in, also save to backend using existing hook
            if (user && !userLoading) {
                return await backendSaveFarm.mutateAsync(farmId);
            }
            
            return { farm_id: farmId, user_uid: 'local' };
        },
        onSuccess: (data, farmId) => {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["saved-farms"] });
            queryClient.invalidateQueries({ queryKey: ["hybrid-saved-farms"] });
        },
        onError: (error: Error) => {
            // Remove from localStorage if backend save failed
            savedFarmsInLocalStorage.removeFarm(Number(error.message.match(/\d+/)?.[0] || 0));
        },
    });
}

// Hybrid unsave farm hook
export function useHybridUnsaveFarm() {
    const queryClient = useQueryClient();
    const { user, loading: userLoading } = useAuthUser();
    const savedFarmsInLocalStorage = useSavedFarmsInLocalStorage();
    const backendUnsaveFarm = useUnsaveFarm ();

    return useMutation({
        mutationFn: async (farmId: number) => {
            // Always remove from localStorage first
            savedFarmsInLocalStorage.removeFarm(farmId);
            
            // If user is logged in, also remove from backend using existing hook
            if (user && !userLoading) {
                await backendUnsaveFarm.mutateAsync(farmId);
            }
            
            return { farm_id: farmId };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-farms"] });
            queryClient.invalidateQueries({ queryKey: ["hybrid-saved-farms"] });
        },
        onError: (error: Error) => {
            // Error handling without toast
        },
    });
}

// Hook to sync localStorage farms to backend when user logs in
export function useSyncLocalSavedFarmsToBackend() {
    const { user, loading: userLoading } = useAuthUser();
    const queryClient = useQueryClient();
    const savedFarmsInLocalStorage = useSavedFarmsInLocalStorage();
    const backendSaveFarm = useSaveFarm();
    
    const syncMutation = useMutation({
        mutationFn: async () => {
            const farmsToSync = savedFarmsInLocalStorage.getFarmsToSync();
            const results = [];
            
            for (const item of farmsToSync) {
                try {
                    await backendSaveFarm.mutateAsync(item.id);
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
            queryClient.invalidateQueries({ queryKey: ["saved-farms"] });
        },
        onError: (error: Error) => {
            // Error handling without toast
        },
    });

    // Auto-sync when user logs in
    useEffect(() => {
        if (user && !userLoading && !syncMutation.isPending) {
            const farmsToSync = savedFarmsInLocalStorage.getFarmsToSync();
            if (farmsToSync.length > 0) {
                syncMutation.mutate();
            }
        }
    }, [user, userLoading]);

    return {
        syncFarms: syncMutation.mutate,
        isSyncing: syncMutation.isPending,
        syncError: syncMutation.error
    };
} 

// Hook to sync backend saved farms to localStorage when user logs in
export function useSyncBackendSavedFarmsToLocalStorage() {
    const { user, loading: userLoading } = useAuthUser();
    const savedFarmsInLocalStorage = useSavedFarmsInLocalStorage();
    const backendQuery = useSavedFarms();
    
    const syncMutation = useMutation({
        mutationFn: async () => {
            if (!backendQuery.data) return [];
            
            const backendFarmIds = backendQuery.data.map((item: any) => item.farm_id);
            const localFarmIds = savedFarmsInLocalStorage.getSavedFarms().map((item: LocalSavedItem) => item.id);
            
            // Find farms that exist in backend but not in localStorage
            const farmsToAdd = backendFarmIds.filter((id: number) => !localFarmIds.includes(id));
            
            const results = [];
            for (const farmId of farmsToAdd) {
                try {
                    savedFarmsInLocalStorage.saveFarm(farmId);
                    results.push({ success: true, farmId });
                } catch (error) {
                    results.push({ success: false, farmId, error });
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
            const backendFarmIds = backendQuery.data.map((item: any) => item.farm_id);
            const localFarmIds = savedFarmsInLocalStorage.getSavedFarms().map((item: LocalSavedItem) => item.id);
            
            // Only sync if there are backend farms not in localStorage
            const hasNewFarms = backendFarmIds.some((id: number) => !localFarmIds.includes(id));
            
            if (hasNewFarms) {
                syncMutation.mutate();
            }
        }
    }, [user, userLoading, backendQuery.data]);

    return {
        syncBackendToLocal: syncMutation.mutate,
        isSyncingBackendToLocal: syncMutation.isPending,
        syncBackendToLocalError: syncMutation.error
    };
} 
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FarmFilters,
  getAllFarms,
  getFarmById,
} from "../api/farms";
import { Farm, FarmCreate, FarmLivestockCategoriesAndSubcategoriesResponse, FarmLivestockCategoryUpdateRequest, FarmLivestockSubcategoryUpdateRequest, FarmUpdate } from "../types/farm";
import { useGetCurrentUser } from "./useGetCurrentUser";

// TODO: These functions need to be implemented in the API
// Stub types for missing functions
interface FarmDocumentListResponse {
  documents: any[];
}

// Stub functions - to be implemented
const createFarm = async (farmData: FarmCreate): Promise<Farm> => {
  throw new Error("createFarm not yet implemented");
};

const updateFarm = async (farmData: FarmUpdate): Promise<Farm> => {
  throw new Error("updateFarm not yet implemented");
};

const getFarmsBulkByIds = async (farmIds: number[]): Promise<Farm[]> => {
  // For now, fetch farms individually
  const farms = await Promise.all(farmIds.map(id => getFarmById(String(id))));
  return farms;
};

const getFarmDocuments = async (documentType?: 'ghana_card' | 'registration'): Promise<FarmDocumentListResponse> => {
  throw new Error("getFarmDocuments not yet implemented");
};

const deleteFarmDocument = async (documentId: number): Promise<void> => {
  throw new Error("deleteFarmDocument not yet implemented");
};

const getFarmLivestockCategoriesAndSubcategories = async (): Promise<FarmLivestockCategoriesAndSubcategoriesResponse> => {
  throw new Error("getFarmLivestockCategoriesAndSubcategories not yet implemented");
};

const updateFarmLivestockCategories = async (data: FarmLivestockCategoryUpdateRequest): Promise<void> => {
  throw new Error("updateFarmLivestockCategories not yet implemented");
};

const updateFarmLivestockSubcategories = async (data: FarmLivestockSubcategoryUpdateRequest): Promise<void> => {
  throw new Error("updateFarmLivestockSubcategories not yet implemented");
};

interface UseFarmsReturn {
  verifyFarm: (farmName: string) => Promise<any>;
  isLoading: boolean;
  error: Error | null;
}

interface UseFarmsOptions {
  onSuccess?: (farm: Farm) => void;
}




export function useGetAllFarms(filters?: FarmFilters) {
  // TODO: Get user location from location store when available
  // For now, use filters as-is
  const apiFilters: FarmFilters = {
    ...filters,
  };

  return useQuery<Farm[], Error>({
    queryKey: ["farms", apiFilters],
    queryFn: () => getAllFarms(apiFilters),
  });
}

export function useGetCurrentFarm() {
  const { user } = useGetCurrentUser();
  
  return useQuery<Farm, Error>({
    queryKey: ["farm", user?.farm_id],
    queryFn: () => {
      return getFarmById(String(user?.farm_id));
    },
    enabled: !!user?.farm_id,
  });
}

export function useGetFarmById(id: string) {
  return useQuery<Farm, Error>({
    queryKey: ["farm", id],
    queryFn: () => getFarmById(id),
    enabled: !!id,
  });
}











export function useFarmsBulkByIds(farmIds: number[] | undefined) {
  const query = useQuery<Farm[], Error>({
    queryKey: ["farms-bulk-by-ids", farmIds],
    queryFn: () => farmIds && farmIds.length > 0 ? getFarmsBulkByIds(farmIds) : Promise.resolve([]),
    enabled: !!farmIds && farmIds.length > 0,
  });

  return {
    farms: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}

// Hook for top rated farms (sorted by rating)
export function useGetTopRatedFarms(filters?: Omit<FarmFilters, 'sort_by'>) {
  // TODO: Get user location from location store when available
  const apiFilters: FarmFilters = {
    ...filters,
    sort_by: 'popular', // Backend maps 'popular' to rating-based sorting
  };

  return useQuery<Farm[], Error>({
    queryKey: ["farms", "top-rated", apiFilters],
    queryFn: () => getAllFarms(apiFilters),
  });
}

// Hook for newest farms (sorted by created_at)
export function useGetNewestFarms(filters?: Omit<FarmFilters, 'sort_by'>) {
  // TODO: Get user location from location store when available
  const apiFilters: FarmFilters = {
    ...filters,
    sort_by: 'newest',
  };

  return useQuery<Farm[], Error>({
    queryKey: ["farms", "newest", apiFilters],
    queryFn: () => getAllFarms(apiFilters),
  });
}

// Hook for closest farms (sorted by distance)
export function useGetClosestFarms(filters?: Omit<FarmFilters, 'sort_by'>) {
  // TODO: Get user location from location store when available
  const apiFilters: FarmFilters = {
    ...filters,
    sort_by: 'closest',
  };

  return useQuery<Farm[], Error>({
    queryKey: ["farms", "closest", apiFilters],
    queryFn: () => getAllFarms(apiFilters),
  });
}



export function useGetFarmDocuments(documentType?: 'ghana_card' | 'registration') {
  return useQuery<FarmDocumentListResponse, Error>({
    queryKey: ["farm-documents", documentType],
    queryFn: () => getFarmDocuments(documentType),
  });
}

export function useDeleteFarmDocument() {
  const queryClient = useQueryClient();
  const { user } = useGetCurrentUser();

  return useMutation({
    mutationFn: (documentId: number) => deleteFarmDocument(documentId),
    onSuccess: () => {
      // Success handling - can add Alert or other notification here
      queryClient.invalidateQueries({ queryKey: ["farm", user?.farm_id] });
      queryClient.invalidateQueries({ queryKey: ["farm-documents"] });
    },
    onError: (error: Error) => {
      // Error handling - can add Alert or other notification here
      console.error("Failed to delete document:", error);
    },
  });
}



export function useGetFarmLivestockCategoriesAndSubcategories() {
  const { user } = useGetCurrentUser();
  
  return useQuery<FarmLivestockCategoriesAndSubcategoriesResponse, Error>({
    queryKey: ["farm-livestock-categories", user?.farm_id],
    queryFn: () => getFarmLivestockCategoriesAndSubcategories(),
    enabled: !!user?.farm_id,
  });
}

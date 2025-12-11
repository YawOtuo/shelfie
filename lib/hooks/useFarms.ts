import { useQuery } from "@tanstack/react-query";
import { getAllFarms, getFarmById, FarmFilters } from "../api/farms";
import { Farm } from "../types/farm";

export function useFarms(filters?: FarmFilters) {
  const query = useQuery<Farm[], Error>({
    queryKey: ["farms", filters],
    queryFn: () => getAllFarms(filters),
  });

  return {
    farms: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useFarm(id: string) {
  const query = useQuery<Farm, Error>({
    queryKey: ["farm", id],
    queryFn: () => getFarmById(id),
    enabled: !!id,
  });

  return {
    farm: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// Hook for top rated farms
export function useTopRatedFarms(filters?: Omit<FarmFilters, "sort_by">) {
  return useFarms({
    ...filters,
    sort_by: "popular",
  });
}

// Hook for newest farms
export function useNewestFarms(filters?: Omit<FarmFilters, "sort_by">) {
  return useFarms({
    ...filters,
    sort_by: "newest",
  });
}

// Hook for closest farms
export function useClosestFarms(filters?: Omit<FarmFilters, "sort_by">) {
  return useFarms({
    ...filters,
    sort_by: "closest",
  });
}


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllInventoryByShop,
  getInventoryGeneralSums,
  getRecentlySoldItems,
  getRecentlyRefilledItems,
  searchInventory,
  getInventoryByItemId,
  createInventory,
  sellInventory,
  refillInventory,
  updateInventory,
  deleteInventory,
} from '../api/inventory';
import {
  CreateInventoryInput,
  UpdateInventoryInput,
} from '../types/inventory';

// Query keys
export const inventoryKeys = {
  all: ['inventories'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...inventoryKeys.lists(), filters] as const,
  details: () => [...inventoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...inventoryKeys.details(), id] as const,
  byShop: (shopId: number, page: number, perPage: number) =>
    [...inventoryKeys.all, 'shop', shopId, page, perPage] as const,
  generalSums: () => [...inventoryKeys.all, 'general-sums'] as const,
  recentlySold: (shopId: number) => [...inventoryKeys.all, 'recently-sold', shopId] as const,
  recentlyRefilled: (shopId: number) => [...inventoryKeys.all, 'recently-refilled', shopId] as const,
  search: (shopId: number, query: string, page: number, perPage: number) =>
    [...inventoryKeys.all, 'search', shopId, query, page, perPage] as const,
  byItemId: (itemId: number) => [...inventoryKeys.all, 'item', itemId] as const,
};

// Hooks
export const useInventoryByShop = (
  shopId: number,
  page: number = 1,
  perPage: number = 25,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: inventoryKeys.byShop(shopId, page, perPage),
    queryFn: () => getAllInventoryByShop(shopId, page, perPage),
    enabled: enabled && !!shopId,
  });
};

export const useInventoryGeneralSums = (enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.generalSums(),
    queryFn: getInventoryGeneralSums,
    enabled,
  });
};

export const useRecentlySoldItems = (shopId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.recentlySold(shopId),
    queryFn: () => getRecentlySoldItems(shopId),
    enabled: enabled && !!shopId,
  });
};

export const useRecentlyRefilledItems = (shopId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.recentlyRefilled(shopId),
    queryFn: () => getRecentlyRefilledItems(shopId),
    enabled: enabled && !!shopId,
  });
};

export const useSearchInventory = (
  shopId: number,
  query: string,
  page: number = 1,
  perPage: number = 25,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: inventoryKeys.search(shopId, query, page, perPage),
    queryFn: () => searchInventory(shopId, query, page, perPage),
    enabled: enabled && !!shopId && !!query,
  });
};

export const useInventoryByItemId = (itemId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: inventoryKeys.byItemId(itemId),
    queryFn: () => getInventoryByItemId(itemId),
    enabled: enabled && !!itemId,
  });
};

// Mutations
export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInventoryInput) => createInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
};

export const useSellInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInventoryInput) => sellInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
};

export const useRefillInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInventoryInput) => refillInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateInventoryInput> }) =>
      updateInventory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(variables.id) });
    },
  });
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteInventory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
};



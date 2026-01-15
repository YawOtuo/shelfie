import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllItems,
  getItemById,
  getItemsBelowRefillLimit,
  searchItems,
  createItem,
  updateItem,
  deleteItem,
} from '../api/items';
import { CreateItemInput } from '../types/item';

// Query keys
export const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...itemKeys.lists(), filters] as const,
  details: () => [...itemKeys.all, 'detail'] as const,
  detail: (id: number) => [...itemKeys.details(), id] as const,
  paginated: (page: number, perPage: number) =>
    [...itemKeys.all, 'paginated', page, perPage] as const,
  belowRefillLimit: (shopId: number) => [...itemKeys.all, 'below-refill-limit', shopId] as const,
  search: (keyword: string) => [...itemKeys.all, 'search', keyword] as const,
};

// Hooks
export const useItems = (page: number = 1, perPage: number = 10, enabled: boolean = true) => {
  return useQuery({
    queryKey: itemKeys.paginated(page, perPage),
    queryFn: () => getAllItems(page, perPage),
    enabled,
  });
};

export const useItem = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: () => getItemById(id),
    enabled: enabled && !!id,
  });
};

export const useItemsBelowRefillLimit = (shopId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: itemKeys.belowRefillLimit(shopId),
    queryFn: () => getItemsBelowRefillLimit(shopId),
    enabled: enabled && !!shopId,
  });
};

export const useSearchItems = (keyword: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: itemKeys.search(keyword),
    queryFn: () => searchItems(keyword),
    enabled: enabled && !!keyword,
  });
};

// Mutations
export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemInput) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateItemInput> }) =>
      updateItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(variables.id) });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
};


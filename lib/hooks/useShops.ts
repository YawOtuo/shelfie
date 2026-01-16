import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  verifyShopByName,
  getShopUsers,
  getShopAcceptedUsers,
  getShopUnacceptedUsers,
  getCurrentUserShop,
} from '../api/shops';
import { CreateShopInput, UpdateShopInput } from '../types/shop';

// Query keys
export const shopKeys = {
  all: ['shops'] as const,
  lists: () => [...shopKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...shopKeys.lists(), filters] as const,
  details: () => [...shopKeys.all, 'detail'] as const,
  detail: (id: number) => [...shopKeys.details(), id] as const,
  users: (shopId: number) => [...shopKeys.all, 'users', shopId] as const,
  acceptedUsers: (shopId: number) => [...shopKeys.all, 'accepted-users', shopId] as const,
  unacceptedUsers: (shopId: number) => [...shopKeys.all, 'unaccepted-users', shopId] as const,
  verify: (name: string) => [...shopKeys.all, 'verify', name] as const,
};

// Hooks
export const useShops = (enabled: boolean = true) => {
  return useQuery({
    queryKey: shopKeys.lists(),
    queryFn: getAllShops,
    enabled,
  });
};

export const useShop = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: shopKeys.detail(id),
    queryFn: () => getShopById(id),
    enabled: enabled && !!id,
  });
};

export const useCurrentUserShop = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [...shopKeys.all, 'current-user'] as const,
    queryFn: getCurrentUserShop,
    enabled,
  });
};

export const useShopUsers = (shopId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: shopKeys.users(shopId),
    queryFn: () => getShopUsers(shopId),
    enabled: enabled && !!shopId,
  });
};

export const useShopAcceptedUsers = (shopId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: shopKeys.acceptedUsers(shopId),
    queryFn: () => getShopAcceptedUsers(shopId),
    enabled: enabled && !!shopId,
  });
};

export const useShopUnacceptedUsers = (shopId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: shopKeys.unacceptedUsers(shopId),
    queryFn: () => getShopUnacceptedUsers(shopId),
    enabled: enabled && !!shopId,
  });
};

export const useVerifyShopByName = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: shopKeys.verify(name),
    queryFn: () => verifyShopByName(name),
    enabled: enabled && !!name,
  });
};

// Mutations
export const useCreateShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateShopInput) => createShop(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.all });
    },
  });
};

export const useUpdateShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateShopInput }) =>
      updateShop(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shopKeys.all });
      queryClient.invalidateQueries({ queryKey: shopKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: [...shopKeys.all, 'current-user'] });
    },
  });
};

export const useDeleteShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteShop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopKeys.all });
    },
  });
};



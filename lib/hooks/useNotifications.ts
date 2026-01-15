import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllNotifications,
  getShopNotifications,
  getUnreadNotificationsCount,
  createNotification,
  updateNotification,
  deleteNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api/notifications';
import { CreateNotificationInput } from '../types/notification';

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...notificationKeys.lists(), filters] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: number) => [...notificationKeys.details(), id] as const,
  byShop: (shopId: number) => [...notificationKeys.all, 'shop', shopId] as const,
  unreadCount: (shopId: number) => [...notificationKeys.all, 'unread-count', shopId] as const,
};

// Hooks
export const useNotifications = (enabled: boolean = true) => {
  return useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: getAllNotifications,
    enabled,
  });
};

export const useShopNotifications = (shopId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: notificationKeys.byShop(shopId),
    queryFn: () => getShopNotifications(shopId),
    enabled: enabled && !!shopId,
  });
};

export const useUnreadNotificationsCount = (shopId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(shopId),
    queryFn: () => getUnreadNotificationsCount(shopId),
    enabled: enabled && !!shopId,
  });
};

// Mutations
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNotificationInput) => createNotification(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationKeys.byShop(variables.shopId) });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(variables.shopId) });
    },
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateNotificationInput> }) =>
      updateNotification(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationKeys.detail(variables.id) });
      if (variables.data.shopId) {
        queryClient.invalidateQueries({ queryKey: notificationKeys.byShop(variables.data.shopId) });
        queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(variables.data.shopId) });
      }
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shopId: number) => markAllNotificationsAsRead(shopId),
    onSuccess: (_, shopId) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      queryClient.invalidateQueries({ queryKey: notificationKeys.byShop(shopId) });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(shopId) });
    },
  });
};



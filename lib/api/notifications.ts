import { inventoryAxios } from '../axiosinstance';
import {
  Notification,
  CreateNotificationInput,
  UpdateNotificationInput,
  UnreadNotificationsCount,
} from '../types/notification';

export const getAllNotifications = async (): Promise<Notification[]> => {
  const response = await inventoryAxios.get<Notification[]>('/notifications');
  return response.data;
};

export const getShopNotifications = async (
  shopId: number
): Promise<Notification[]> => {
  const response = await inventoryAxios.get<Notification[]>(
    `/notifications/shops/${shopId}`
  );
  return response.data;
};

export const getUnreadNotificationsCount = async (
  shopId: number
): Promise<UnreadNotificationsCount> => {
  const response = await inventoryAxios.get<UnreadNotificationsCount>(
    `/notifications/unread-count/${shopId}`
  );
  return response.data;
};

export const createNotification = async (
  data: CreateNotificationInput
): Promise<Notification> => {
  const response = await inventoryAxios.post<Notification>('/notifications', data);
  return response.data;
};

export const updateNotification = async (
  id: number,
  data: Partial<CreateNotificationInput>
): Promise<Notification> => {
  const response = await inventoryAxios.put<Notification>(
    `/notifications/${id}`,
    data
  );
  return response.data;
};

export const deleteNotification = async (id: number): Promise<void> => {
  await inventoryAxios.delete(`/notifications/${id}`);
};

export const markNotificationAsRead = async (
  id: number
): Promise<Notification> => {
  const response = await inventoryAxios.post<Notification>(
    `/notifications/${id}/mark-as-read`
  );
  return response.data;
};

export const markAllNotificationsAsRead = async (
  shopId: number
): Promise<void> => {
  await inventoryAxios.post(`/notifications/mark-all-as-read/${shopId}`);
};



import { inventoryAxios } from '../axiosinstance';
import { Shop, CreateShopInput, UpdateShopInput } from '../types/shop';
import { User } from '../types/user';

export const getAllShops = async (): Promise<Shop[]> => {
  const response = await inventoryAxios.get<Shop[]>('/shops');
  return response.data;
};

export const getShopById = async (id: number): Promise<Shop> => {
  const response = await inventoryAxios.get<Shop>(`/shops/${id}`);
  return response.data;
};

export const createShop = async (data: CreateShopInput): Promise<Shop> => {
  const response = await inventoryAxios.post<Shop>('/shops', data);
  return response.data;
};

export const updateShop = async (
  id: number,
  data: Partial<CreateShopInput>
): Promise<Shop> => {
  const response = await inventoryAxios.put<Shop>(`/shops/${id}`, data);
  return response.data;
};

export const deleteShop = async (id: number): Promise<void> => {
  await inventoryAxios.delete(`/shops/${id}`);
};

export const verifyShopByName = async (name: string): Promise<Shop | { exists: boolean; message: string }> => {
  const response = await inventoryAxios.get<Shop | { exists: boolean; message: string }>(
    `/shops/verify/${name}`
  );
  return response.data;
};

export const getShopUsers = async (shopId: number): Promise<User[]> => {
  const response = await inventoryAxios.get<User[]>(`/shops/${shopId}/users`);
  return response.data;
};

export const getShopAcceptedUsers = async (shopId: number): Promise<User[]> => {
  const response = await inventoryAxios.get<User[]>(
    `/shops/${shopId}/users/accepted/yes`
  );
  return response.data;
};

export const getShopUnacceptedUsers = async (shopId: number): Promise<User[]> => {
  const response = await inventoryAxios.get<User[]>(
    `/shops/${shopId}/users/accepted/no`
  );
  return response.data;
};

export const getCurrentUserShop = async (): Promise<Shop> => {
  const response = await inventoryAxios.get<Shop>('/shops/me/current');
  return response.data;
};

export const getUserShops = async (): Promise<Shop[]> => {
  const response = await inventoryAxios.get<Shop[]>('/shops/me/shops');
  return response.data;
};



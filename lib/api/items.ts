import { inventoryAxios } from '../axiosinstance';
import { CreateItemInput, Item, PaginatedItemsResponse } from '../types/item';

export const getAllItems = async (
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedItemsResponse> => {
  const response = await inventoryAxios.get<PaginatedItemsResponse>('/items', {
    params: { page, perPage },
  });
  return response.data;
};

export const getItemById = async (id: number): Promise<Item> => {
  const response = await inventoryAxios.get<Item>(`/items/${id}`);
  return response.data;
};

export const getItemsBelowRefillLimit = async (
  shopId: number
): Promise<Item[]> => {
  const response = await inventoryAxios.get<Item[]>(
    `/items/op/below-optimum/shops/${shopId}`
  );
  return response.data;
};

export const searchItems = async (keyword: string): Promise<Item[]> => {
  const response = await inventoryAxios.get<Item[]>('/items/search/search', {
    params: { keyword },
  });
  return response.data;
};

export const createItem = async (data: CreateItemInput): Promise<Item> => {
  const response = await inventoryAxios.post<Item>('/items', data);
  return response.data;
};

export const updateItem = async (
  id: number,
  data: Partial<CreateItemInput>
): Promise<Item> => {
  const response = await inventoryAxios.put<Item>(`/items/${id}`, data);
  return response.data;
};

export const deleteItem = async (id: number): Promise<void> => {
  await inventoryAxios.delete(`/items/${id}`);
};



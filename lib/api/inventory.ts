import { inventoryAxios } from '../axiosinstance';
import {
  Inventory,
  InventoryWithRelations,
  CreateInventoryInput,
  UpdateInventoryInput,
  InventoryGeneralSums,
  PaginatedInventoryResponse,
  InventoryByItemIdResponse,
} from '../types/inventory';

export const getAllInventoryByShop = async (
  shopId: number,
  page: number = 1,
  perPage: number = 25
): Promise<PaginatedInventoryResponse> => {
  const response = await inventoryAxios.get<PaginatedInventoryResponse>(
    `/inventories/shops/${shopId}`,
    {
      params: { page, perPage },
    }
  );
  return response.data;
};

export const getInventoryGeneralSums = async (): Promise<InventoryGeneralSums> => {
  const response = await inventoryAxios.get<InventoryGeneralSums>(
    '/inventories/general-sums'
  );
  return response.data;
};

export const getRecentlySoldItems = async (
  shopId: number
): Promise<InventoryWithRelations[]> => {
  const response = await inventoryAxios.get<InventoryWithRelations[]>(
    `/inventories/recently-sold/shops/${shopId}`
  );
  return response.data;
};

export const getRecentlyRefilledItems = async (
  shopId: number
): Promise<InventoryWithRelations[]> => {
  const response = await inventoryAxios.get<InventoryWithRelations[]>(
    `/inventories/recently-refilled/shops/${shopId}`
  );
  return response.data;
};

export const searchInventory = async (
  shopId: number,
  query: string,
  page: number = 1,
  perPage: number = 25
): Promise<PaginatedInventoryResponse> => {
  const response = await inventoryAxios.get<PaginatedInventoryResponse>(
    `/inventories/search/shops/${shopId}`,
    {
      params: { qitem: query, page, perPage },
    }
  );
  return response.data;
};

export const getInventoryByItemId = async (
  itemId: number
): Promise<InventoryByItemIdResponse> => {
  const response = await inventoryAxios.get<InventoryByItemIdResponse>(
    `/inventories/by-item-id/${itemId}`
  );
  return response.data;
};

export const createInventory = async (
  data: CreateInventoryInput
): Promise<Inventory> => {
  const response = await inventoryAxios.post<Inventory>('/inventories', data);
  return response.data;
};

export const sellInventory = async (
  data: CreateInventoryInput
): Promise<Inventory> => {
  const response = await inventoryAxios.post<Inventory>('/inventories/sell', data);
  return response.data;
};

export const refillInventory = async (
  data: CreateInventoryInput
): Promise<Inventory> => {
  const response = await inventoryAxios.post<Inventory>('/inventories/refill', data);
  return response.data;
};

export const updateInventory = async (
  id: number,
  data: Partial<CreateInventoryInput>
): Promise<Inventory> => {
  const response = await inventoryAxios.put<Inventory>(`/inventories/${id}`, data);
  return response.data;
};

export const deleteInventory = async (id: number): Promise<void> => {
  await inventoryAxios.delete(`/inventories/${id}`);
};



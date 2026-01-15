import { Item } from './item';
import { User } from './user';

export interface Inventory {
  id: number;
  action: 'sell' | 'refill';
  quantity: number;
  date: string;
  cost: number;
  itemId: number;
  userId: number;
  shopId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryWithRelations extends Inventory {
  Item?: Item;
  User?: User;
}

export interface CreateInventoryInput {
  action: 'sell' | 'refill';
  quantity: number;
  date?: string;
  cost: number;
  itemId: number;
  userId: number;
  shopId?: number;
}

export interface UpdateInventoryInput extends Partial<CreateInventoryInput> {
  id: number;
}

export interface InventoryGeneralSums {
  daySum: number | null;
  weekSum: number | null;
  monthSum: number | null;
}

export interface PaginatedInventoryResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  items: InventoryWithRelations[];
}

export interface InventoryByItemIdResponse {
  totalItems: number;
  inventory: InventoryWithRelations[];
}



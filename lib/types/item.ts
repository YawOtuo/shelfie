export interface Item {
  id: number;
  name: string;
  description?: string;
  category?: string;
  quantity: number;
  unit_price: number;
  refill_count?: number;
  image_url?: string;
  shopId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemInput {
  name: string;
  description?: string;
  category?: string;
  quantity: number;
  unit_price: number;
  refill_count?: number;
  image_url?: string;
  shopId?: number;
}

export interface UpdateItemInput extends Partial<CreateItemInput> {
  id: number;
}

export interface PaginatedItemsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  items: Item[];
}


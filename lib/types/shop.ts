export interface Shop {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateShopInput {
  name: string;
}

export interface UpdateShopInput {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}



export interface Shop {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateShopInput {
  name: string;
}

export interface UpdateShopInput extends Partial<CreateShopInput> {
  id: number;
}



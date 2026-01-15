export interface User {
  id: number;
  username: string;
  uid: string;
  shopId: number | null;
  acceptedIntoShop: boolean;
  permission?: string;
  email?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  username: string;
  uid: string;
  shopId?: number;
  acceptedIntoShop?: boolean;
  permission?: string;
  email?: string;
  phoneNumber?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: number;
}



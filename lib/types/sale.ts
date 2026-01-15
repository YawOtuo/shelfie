export interface SaleItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  customerName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleInput {
  items: Omit<SaleItem, "total">[];
  customerName?: string;
  notes?: string;
}


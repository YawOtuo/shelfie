import { Sale } from "../types/sale";

export const mockSales: Sale[] = [
  {
    id: "1",
    items: [
      {
        itemId: "1",
        itemName: "Premium Coffee Beans",
        quantity: 2,
        unitPrice: 15.99,
        total: 31.98,
      },
      {
        itemId: "2",
        itemName: "Organic Honey",
        quantity: 1,
        unitPrice: 12.50,
        total: 12.50,
      },
    ],
    totalAmount: 44.48,
    customerName: "John Doe",
    notes: "Regular customer",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    items: [
      {
        itemId: "3",
        itemName: "Artisan Bread",
        quantity: 3,
        unitPrice: 5.99,
        total: 17.97,
      },
    ],
    totalAmount: 17.97,
    customerName: "Jane Smith",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    items: [
      {
        itemId: "1",
        itemName: "Premium Coffee Beans",
        quantity: 1,
        unitPrice: 15.99,
        total: 15.99,
      },
    ],
    totalAmount: 15.99,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];


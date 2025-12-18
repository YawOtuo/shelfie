import { Listing } from "./listing";

// Cart status enum to match backend schema
export enum CartStatus {
  ACTIVE = "active",
  CHECKED_OUT = "checked_out",
  ABANDONED = "abandoned"
}

// Base interfaces for cart items
export interface CartItemBase {
  listing_id: number;
  quantity: number;
  type_specific_details?: Record<string, any>; // Store frozen/full_animal/shared_portion details
}

// Create interfaces
export interface CartItemCreate extends CartItemBase {
  // Additional fields can be added here if needed
}

export interface CartItemUpdate {
  quantity?: number;
  type_specific_details?: Record<string, any>;
}

// Response interfaces
export interface CartItem extends CartItemBase {
  id: number;
  cart_id: number;
  listing_title: string;
  listing_type: string;
  listing_primary_image?: string;
  seller_uid: string;
  seller_name: string;
  seller_email?: string;
  seller_phone?: string;
  unit_price: number; // NOTE: Cart API uses 'unit_price', while Listing API uses 'selling_price_per_unit'
  total_price: number;
  created_at: string;
  updated_at?: string;
}

// Cart item with full listing details (for detailed views)
export interface CartItemWithListing extends CartItem {
  listing?: Listing; // Full listing details if needed
}

// Base cart interface
export interface CartBase {
  // Empty base interface for future extensions
}

// Create interfaces
export interface CartCreate extends CartBase {
  // Additional fields can be added here if needed
}

export interface CartUpdate {
  status?: CartStatus;
}

// Response interfaces
export interface Cart extends CartBase {
  id: number;
  buyer_uid: string;
  buyer_name: string;
  status: CartStatus;
  total_items: number;
  total_price: number;
  created_at: string;
  updated_at?: string;
  last_accessed_at: string;
  cart_items: CartItem[];
}

// Cart checkout schema
// Note: In the new secure flow, orders are created with PENDING payment status first,
// then payment is processed, and backend webhooks update the payment status
export interface CartCheckout {
  shipping_address?: Record<string, any>; // JSON object for delivery address
  delivery_instructions?: string;
  create_separate_orders?: boolean; // Create separate orders for each seller
  payment_reference?: string; // Custom payment reference for tracking
  payment_method?: string; // Payment method used (e.g., "paystack")
}

// Checkout response - now returns a single order instead of an array
export interface CartCheckoutResponse {
  order_id: string;
  seller_uid: string;
  seller_name: string;
  items: CartItem[];
  total_amount: number;
  status: string;
  created_at: string;
  message?: string;
}

// API request/response types for consistency with existing patterns
export interface AddToCartRequest {
  listing_id: number;
  quantity: number;
  type_specific_details?: Record<string, any>;
}

export interface UpdateCartItemRequest {
  cart_item_id: number;
  quantity?: number;
  type_specific_details?: Record<string, any>;
}

export interface CartResponse {
  cart: Cart;
  message?: string;
}

// Error response type
export interface CartErrorResponse {
  detail: string;
  error_code?: string;
}

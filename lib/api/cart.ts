import { marketplaceAxios } from "../axiosinstance";
import { 
  Cart, 
  CartItem, 
  CartItemCreate, 
  CartItemUpdate,
  CartCheckout,
  CartCheckoutResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
  CartResponse
} from "../types/cart";

export async function getCart(): Promise<Cart> {
  const response = await marketplaceAxios.get<Cart>('/api/cart');
  return response.data;
}

export async function addItemToCart(cartItem: CartItemCreate): Promise<CartItem> {
  const response = await marketplaceAxios.post<CartItem>('/api/cart/items', cartItem);
  return response.data;
}

export async function updateCartItem(
  cartItemId: number, 
  cartItemUpdate: CartItemUpdate
): Promise<CartItem> {
  const response = await marketplaceAxios.patch<CartItem>(
    `/api/cart/items/${cartItemId}`, 
    cartItemUpdate
  );
  return response.data;
}

export async function removeCartItem(cartItemId: number): Promise<void> {
  await marketplaceAxios.delete(`/api/cart/items/${cartItemId}`);
}

export async function clearCart(): Promise<void> {
  await marketplaceAxios.delete('/api/cart/clear');
}

export async function checkoutCart(checkoutData: CartCheckout): Promise<CartCheckoutResponse> {
  const response = await marketplaceAxios.post<CartCheckoutResponse>(
    '/api/cart/checkout', 
    checkoutData
  );
  return response.data;
}

// Legacy API functions for backward compatibility
export const cartApi = {
  // Add item to cart
  async addToCart(data: AddToCartRequest): Promise<CartItem> {
    return addItemToCart({
      listing_id: data.listing_id,
      quantity: data.quantity,
      type_specific_details: data.type_specific_details
    });
  },

  // Get user's cart
  async getCart(): Promise<CartResponse> {
    const cart = await getCart();
    return {
      cart,
      message: "Cart retrieved successfully"
    };
  },

  // Update cart item quantity
  async updateCartItem(data: UpdateCartItemRequest): Promise<CartItem> {
    return updateCartItem(data.cart_item_id, {
      quantity: data.quantity,
      type_specific_details: data.type_specific_details
    });
  },

  // Remove item from cart
  async removeFromCart(itemId: number): Promise<void> {
    return removeCartItem(itemId);
  },

  // Clear entire cart
  async clearCart(): Promise<void> {
    return clearCart();
  },

  // Create order from cart
  async createOrder(data: CartCheckout): Promise<CartCheckoutResponse> {
    return checkoutCart(data);
  },

  // Sync local cart with server
  async syncCart(localItems: CartItem[]): Promise<CartResponse> {
    // This would need to be implemented based on your sync strategy
    // For now, just return the current cart
    return cartApi.getCart();
  },
};

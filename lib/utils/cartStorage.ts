import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { CartItemCreate } from "../types/cart";

const CART_STORAGE_KEY = "livestockly-cart";
const CART_SYNC_KEY = "livestockly-cart-sync";

export interface LocalCartItem {
  id: number;
  listing_id: number;
  quantity: number;
  type_specific_details?: Record<string, any>;
  added_at: string;
  synced: boolean;
  // Store listing details for display purposes
  listing_title?: string;
  listing_type?: string;
  listing_primary_image?: string;
  unit_price?: number; // NOTE: Stored as 'unit_price' to match Cart API schema, maps to 'selling_price_per_unit' in Listing
  unit?: string;
  seller_uid?: string;
  seller_name?: string;
  seller_email?: string;
  seller_phone?: string;
}

export interface LocalCart {
  id: string;
  buyer_uid: string;
  buyer_name: string;
  status: string;
  total_items: number;
  total_price: number;
  created_at: string;
  updated_at?: string;
  last_accessed_at: string;
  cart_items: LocalCartItem[];
}

export function useCartStorage() {
  // Use useState with AsyncStorage for cart state management
  const [cart, setCartState] = useState<LocalCart | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          setCartState(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading cart from storage:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  const saveCart = useCallback(async (newCart: LocalCart | null) => {
    try {
      setCartState(newCart);
      if (newCart) {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      } else {
        await AsyncStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  }, []);

  // Get cart from state
  const getCart = (): LocalCart | null => {
    return cart;
  };

  // Create new local cart
  const createLocalCart = (buyerUid: string, buyerName: string): LocalCart => {
    const now = new Date().toISOString();
    return {
      id: `local-${Date.now()}`,
      buyer_uid: buyerUid,
      buyer_name: buyerName,
      status: "active",
      total_items: 0,
      total_price: 0,
      created_at: now,
      last_accessed_at: now,
      cart_items: []
    };
  };

  // Add item to local cart
  const addItemToLocalCart = async (cartItem: CartItemCreate, listingDetails?: {
    title?: string;
    type?: string;
    primary_image?: string;
    selling_price_per_unit?: number;
    unit?: string;
    seller_uid?: string;
    seller_name?: string;
  }): Promise<LocalCart | null> => {
    const cart = getCart();
    if (!cart) return null;

    // Ensure cart_items exists
    if (!cart.cart_items) {
      cart.cart_items = [];
    }

    const existingItem = cart.cart_items.find(
      item => item.listing_id === cartItem.listing_id
    );

    if (existingItem) {
      // Update existing item
      cart.cart_items = cart.cart_items.map(item =>
        item.listing_id === cartItem.listing_id
          ? {
              ...item,
              quantity: item.quantity + cartItem.quantity,
              synced: false,
              // Update listing details if provided
              ...(listingDetails && {
                listing_title: listingDetails.title,
                listing_type: listingDetails.type,
                listing_primary_image: listingDetails.primary_image,
                unit_price: listingDetails.selling_price_per_unit,
                unit: listingDetails.unit,
                seller_uid: listingDetails.seller_uid,
                seller_name: listingDetails.seller_name,
              })
            }
          : item
      );
    } else {
      // Add new item
      const newItem: LocalCartItem = {
        id: Date.now(),
        listing_id: cartItem.listing_id,
        quantity: cartItem.quantity,
        type_specific_details: cartItem.type_specific_details,
        added_at: new Date().toISOString(),
        synced: false,
        // Store listing details if provided
        ...(listingDetails && {
          listing_title: listingDetails.title,
          listing_type: listingDetails.type,
          listing_primary_image: listingDetails.primary_image,
          unit_price: listingDetails.selling_price_per_unit,
          unit: listingDetails.unit,
          seller_uid: listingDetails.seller_uid,
          seller_name: listingDetails.seller_name,
        })
      };
      cart.cart_items.push(newItem);
    }

    // Recalculate totals
    cart.total_items = cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
    cart.total_price = cart.cart_items.reduce((sum, item) => sum + (item.quantity * (item.unit_price || 0)), 0);
    cart.updated_at = new Date().toISOString();
    cart.last_accessed_at = new Date().toISOString();

    await saveCart(cart);
    return cart;
  };

  // Update item in local cart
  const updateItemInLocalCart = async (cartItemId: number, updates: Partial<CartItemCreate>): Promise<LocalCart | null> => {
    const cart = getCart();
    if (!cart || !cart.cart_items) return null;

    cart.cart_items = cart.cart_items.map(item =>
      item.id === cartItemId
        ? { ...item, ...updates, synced: false }
        : item
    );

    // Recalculate totals
    cart.total_items = cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
    cart.total_price = cart.cart_items.reduce((sum, item) => sum + (item.quantity * (item.unit_price || 0)), 0);
    cart.updated_at = new Date().toISOString();
    cart.last_accessed_at = new Date().toISOString();

    await saveCart(cart);
    return cart;
  };

  // Remove item from local cart
  const removeItemFromLocalCart = async (cartItemId: number): Promise<LocalCart | null> => {
    const cart = getCart();
    if (!cart || !cart.cart_items) return null;

    cart.cart_items = cart.cart_items.filter(item => item.id !== cartItemId);

    // Recalculate totals
    cart.total_items = cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
    cart.total_price = cart.cart_items.reduce((sum, item) => sum + (item.quantity * (item.unit_price || 0)), 0);
    cart.updated_at = new Date().toISOString();
    cart.last_accessed_at = new Date().toISOString();

    await saveCart(cart);
    return cart;
  };

  // Clear local cart
  const clearLocalCart = async (): Promise<void> => {
    const cart = getCart();
    if (!cart) return;

    cart.cart_items = [];
    cart.total_items = 0;
    cart.total_price = 0;
    cart.updated_at = new Date().toISOString();
    cart.last_accessed_at = new Date().toISOString();

    await saveCart(cart);
  };

  // Get items that need syncing
  const getItemsToSync = (): LocalCartItem[] => {
    const cart = getCart();
    if (!cart || !cart.cart_items) return [];
    return cart.cart_items.filter(item => !item.synced);
  };

  // Mark items as synced
  const markItemsAsSynced = async (itemIds: number[]): Promise<void> => {
    const cart = getCart();
    if (!cart || !cart.cart_items) return;

    cart.cart_items = cart.cart_items.map(item =>
      itemIds.includes(item.id) ? { ...item, synced: true } : item
    );

    await saveCart(cart);
  };

  // Sync backend cart to local storage (preserves all display data for offline viewing)
  const syncBackendCartToLocal = async (backendCart: any): Promise<void> => {
    const localCart: LocalCart = {
      id: backendCart.id.toString(),
      buyer_uid: backendCart.buyer_uid,
      buyer_name: backendCart.buyer_name,
      status: backendCart.status,
      total_items: backendCart.total_items,
      total_price: backendCart.total_price,
      created_at: backendCart.created_at,
      updated_at: backendCart.updated_at,
      last_accessed_at: backendCart.last_accessed_at,
      cart_items: (backendCart.cart_items || []).map((item: any) => ({
        id: item.id,
        listing_id: item.listing_id,
        quantity: item.quantity,
        type_specific_details: item.type_specific_details,
        added_at: item.created_at,
        synced: true,
        // Preserve all display data for offline viewing
        listing_title: item.listing_title,
        listing_type: item.listing_type,
        listing_primary_image: item.listing_primary_image,
        unit_price: item.unit_price,
        unit: item.unit, // Preserve unit field if available
        seller_uid: item.seller_uid,
        seller_name: item.seller_name,
        seller_email: item.seller_email,
        seller_phone: item.seller_phone,
      }))
    };

    await saveCart(localCart);
  };

  // Clear all cart data
  const clearAllCartData = async (): Promise<void> => {
    await saveCart(null);
    try {
      await AsyncStorage.removeItem(CART_SYNC_KEY);
    } catch (error) {
      console.error("Error clearing cart sync data:", error);
    }
  };

  return {
    getCart,
    saveCart,
    createLocalCart,
    addItemToLocalCart,
    updateItemInLocalCart,
    removeItemFromLocalCart,
    clearLocalCart,
    getItemsToSync,
    markItemsAsSynced,
    syncBackendCartToLocal,
    clearAllCartData
  };
}

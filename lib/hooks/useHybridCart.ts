import { useAuthUser } from "../providers/AuthUserProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  addItemToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem
} from "../api/cart";
import {
  Cart,
  CartItemCreate,
  CartItemUpdate
} from "../types/cart";
import { useCartStorage } from "../utils/cartStorage";

// Hybrid hook for cart that handles all logic internally
export function useHybridCart() {
  const { user, loading: userLoading } = useAuthUser();
  const cartStorage = useCartStorage();
  const backendQuery = useQuery<Cart, Error>({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user && !userLoading,
  });

  // Get localStorage data
  const localCart = cartStorage.getCart();

  // Sync backend data to localStorage for offline viewing (one-way: backend → local)
  // This happens automatically when backend data is successfully fetched
  useEffect(() => {
    if (backendQuery.data && !backendQuery.isLoading && !backendQuery.error && user && !userLoading) {
      cartStorage.syncBackendCartToLocal(backendQuery.data);
    }
  }, [backendQuery.data, backendQuery.isLoading, backendQuery.error, user, userLoading]);

  // Determine which data to use
  let finalData: Cart | null;
  let isLoading: boolean;
  let error: Error | null;

  if (user && !userLoading) {
    // Logged in: use backend data, fallback to localStorage if backend fails
    if (backendQuery.error || (!backendQuery.isLoading && !backendQuery.data && localCart)) {
      // Backend failed or returned no data, use localStorage cache for offline viewing
      if (localCart) {
        finalData = {
          id: parseInt(localCart.id),
          buyer_uid: localCart.buyer_uid,
          buyer_name: localCart.buyer_name,
          status: localCart.status as any,
          total_items: localCart.total_items,
          total_price: localCart.total_price,
          created_at: localCart.created_at,
          updated_at: localCart.updated_at,
          last_accessed_at: localCart.last_accessed_at,
          cart_items: (localCart.cart_items || []).map((item: any) => ({
            id: item.id,
            cart_id: parseInt(localCart.id),
            listing_id: item.listing_id,
            quantity: item.quantity,
            type_specific_details: item.type_specific_details,
            listing_title: item.listing_title || "",
            listing_type: item.listing_type || "",
            listing_primary_image: item.listing_primary_image,
            seller_uid: item.seller_uid || "",
            seller_name: item.seller_name || "",
            seller_email: item.seller_email,
            seller_phone: item.seller_phone,
            unit_price: item.unit_price || 0,
            total_price: (item.unit_price || 0) * item.quantity,
            created_at: item.added_at,
            updated_at: undefined
          }))
        };
        isLoading = false;
        error = null;
      } else {
        finalData = null;
        isLoading = false;
        error = null;
      }
    } else {
      finalData = backendQuery.data || null;
      isLoading = userLoading || backendQuery.isLoading;
      error = backendQuery.error;
    }
  } else {
    // Logged out: use localStorage data
    finalData = localCart ? {
      id: parseInt(localCart.id),
      buyer_uid: localCart.buyer_uid,
      buyer_name: localCart.buyer_name,
      status: localCart.status as any,
      total_items: localCart.total_items,
      total_price: localCart.total_price,
      created_at: localCart.created_at,
      updated_at: localCart.updated_at,
      last_accessed_at: localCart.last_accessed_at,
      cart_items: (localCart.cart_items || []).map((item: any) => ({
        id: item.id,
        cart_id: parseInt(localCart.id),
        listing_id: item.listing_id,
        quantity: item.quantity,
        type_specific_details: item.type_specific_details,
        listing_title: item.listing_title || "",
        listing_type: item.listing_type || "",
        listing_primary_image: item.listing_primary_image,
        seller_uid: item.seller_uid || "",
        seller_name: item.seller_name || "",
        unit_price: item.unit_price || 0,
        total_price: (item.unit_price || 0) * item.quantity,
        created_at: item.added_at,
        updated_at: undefined
      }))
    } : null;
    isLoading = userLoading;
    error = null;
  }

  return {
    cart: finalData,
    isLoading,
    error,
    refetch: backendQuery.refetch,
    isFromLocalStorage: !user || userLoading
  };
}

// Hybrid add to cart hook
export function useHybridAddToCart() {
  const queryClient = useQueryClient();
  const { user, loading: userLoading } = useAuthUser();
  const cartStorage = useCartStorage();
  const backendAddToCart = useMutation({
    mutationFn: addItemToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return useMutation({
    mutationFn: async (cartItem: CartItemCreate & { listingDetails?: any }) => {
      const { listingDetails, ...cartItemData } = cartItem;
      
      // Always save to localStorage first
      if (!user || userLoading) {
        // For logged out users, create local cart if it doesn't exist
        let localCart = cartStorage.getCart();
        if (!localCart) {
          localCart = cartStorage.createLocalCart("guest", "Guest User");
        }
        cartStorage.addItemToLocalCart(cartItemData, listingDetails);
        return { id: Date.now(), ...cartItemData };
      }

      // For logged in users, also save to backend
      try {
        const result = await backendAddToCart.mutateAsync(cartItemData);
        // Also save to localStorage for offline access
        cartStorage.addItemToLocalCart(cartItemData, listingDetails);
        return result;
      } catch (error) {
        // If backend fails, still save to localStorage
        cartStorage.addItemToLocalCart(cartItemData, listingDetails);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => {
      // toast({
      //   title: "Error",
      //   description: error.message || "Failed to add item to cart. Please try again.",
      //   variant: "destructive",
      // });
    },
  });
}

// Hybrid update cart item hook
export function useHybridUpdateCartItem() {
  const queryClient = useQueryClient();
  const { user, loading: userLoading } = useAuthUser();
  const cartStorage = useCartStorage();
  const backendUpdateCartItem = useMutation({
    mutationFn: ({ cartItemId, cartItemUpdate }: { cartItemId: number; cartItemUpdate: CartItemUpdate }) =>
      updateCartItem(cartItemId, cartItemUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return useMutation({
    mutationFn: async ({ cartItemId, cartItemUpdate }: { cartItemId: number; cartItemUpdate: CartItemUpdate }) => {
      // Always update localStorage first
      cartStorage.updateItemInLocalCart(cartItemId, cartItemUpdate);

      // If user is logged in, also update backend
      if (user && !userLoading) {
        try {
          return await backendUpdateCartItem.mutateAsync({ cartItemId, cartItemUpdate });
        } catch (error) {
          // If backend fails, localStorage update still happened
          throw error;
        }
      }

      return { id: cartItemId, ...cartItemUpdate };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => {
      // toast({
      //   title: "Error",
      //   description: error.message || "Failed to update cart item. Please try again.",
      //   variant: "destructive",
      // });
    },
  });
}

// Hybrid remove cart item hook
export function useHybridRemoveCartItem() {
  const queryClient = useQueryClient();
  const { user, loading: userLoading } = useAuthUser();
  const cartStorage = useCartStorage();
  const backendRemoveCartItem = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return useMutation({
    mutationFn: async (cartItemId: number) => {
      // Always remove from localStorage first
      cartStorage.removeItemFromLocalCart(cartItemId);

      // If user is logged in, also remove from backend
      if (user && !userLoading) {
        try {
          await backendRemoveCartItem.mutateAsync(cartItemId);
        } catch (error) {
          // If backend fails, localStorage removal still happened
          throw error;
        }
      }

      return { id: cartItemId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => {
      // toast({
      //   title: "Error",
      //   description: error.message || "Failed to remove item from cart. Please try again.",
      //   variant: "destructive",
      // });
    },
  });
}

// Hybrid clear cart hook
export function useHybridClearCart() {
  const queryClient = useQueryClient();
  const { user, loading: userLoading } = useAuthUser();
  const cartStorage = useCartStorage();
  const backendClearCart = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return useMutation({
    mutationFn: async () => {
      // Always clear localStorage first
      cartStorage.clearLocalCart();

      // If user is logged in, also clear backend
      if (user && !userLoading) {
        try {
          await backendClearCart.mutateAsync();
        } catch (error) {
          // If backend fails, localStorage clear still happened
          throw error;
        }
      }

      return {};
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => {
      // toast({
      //   title: "Error",
      //   description: error.message || "Failed to clear cart. Please try again.",
      //   variant: "destructive",
      // });
    },
  });
}

// Hook to sync localStorage cart to backend when user logs in
export function useSyncLocalCartToBackend() {
  const { user, loading: userLoading } = useAuthUser();
  const queryClient = useQueryClient();
  const cartStorage = useCartStorage();
  const backendAddToCart = useMutation({
    mutationFn: addItemToCart,
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const localCart = cartStorage.getCart();
      if (!localCart || !localCart.cart_items || localCart.cart_items.length === 0) return [];

      const results = [];
      
      for (const item of localCart.cart_items) {
        try {
          await backendAddToCart.mutateAsync({
            listing_id: item.listing_id,
            quantity: item.quantity,
            type_specific_details: item.type_specific_details
          } as any);
          results.push({ success: true, item });
        } catch (error) {
          results.push({ success: false, item, error });
        }
      }
      
      return results;
    },
    onSuccess: (results) => {
      const successCount = results.filter(r => r.success).length;
      
      // Mark successfully synced items
      const syncedItemIds = results
        .filter(r => r.success)
        .map(r => r.item.id);
      cartStorage.markItemsAsSynced(syncedItemIds);
      
      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => {
      // Error handling without toast
    },
  });

  // Auto-sync when user logs in
  useEffect(() => {
    if (user && !userLoading && !syncMutation.isPending) {
      const localCart = cartStorage.getCart();
      const itemsToSync = cartStorage.getItemsToSync();
      if (itemsToSync.length > 0) {
        syncMutation.mutate();
      }
    }
  }, [user, userLoading]);

  return {
    syncCart: syncMutation.mutate,
    isSyncing: syncMutation.isPending,
    syncError: syncMutation.error
  };
}

// Hook to sync backend cart to localStorage when user logs in
export function useSyncBackendCartToLocalStorage() {
  const { user, loading: userLoading } = useAuthUser();
  const cartStorage = useCartStorage();
  const backendQuery = useQuery<Cart, Error>({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user && !userLoading,
  });
  
  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!backendQuery.data) return null;
      
      // Sync backend cart to localStorage
      cartStorage.syncBackendCartToLocal(backendQuery.data);
      
      return backendQuery.data;
    },
    onSuccess: (data) => {
      // Sync completed
    },
    onError: (error: Error) => {
      // Error handling without toast
    },
  });

  // Auto-sync when user logs in and backend data is available
  useEffect(() => {
    if (user && !userLoading && backendQuery.data && !syncMutation.isPending) {
      syncMutation.mutate();
    }
  }, [user, userLoading, backendQuery.data]);

  return {
    syncBackendToLocal: syncMutation.mutate,
    isSyncingBackendToLocal: syncMutation.isPending,
    syncBackendToLocalError: syncMutation.error
  };
}

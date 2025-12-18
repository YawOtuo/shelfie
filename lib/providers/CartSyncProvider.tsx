import React, { createContext, useContext } from "react";

// These hooks would need to be created if they don't exist
// import { 
//   useSyncLocalCartToBackend, 
//   useSyncBackendCartToLocalStorage 
// } from "../hooks/useHybridCart";

interface CartSyncContextType {
  isSyncing: boolean;
  isSyncingBackendToLocal: boolean;
  syncError: Error | null;
  syncBackendToLocalError: Error | null;
}

const CartSyncContext = createContext<CartSyncContextType | null>(null);

export function useCartSync() {
  const context = useContext(CartSyncContext);
  if (!context) {
    throw new Error("useCartSync must be used within a CartSyncProvider");
  }
  return context;
}

export default function CartSyncProvider({ children }: { children: React.ReactNode }) {

  // Sync local cart to backend when user logs in (one-way sync only)
  // const {
  //   isSyncing,
  //   syncError
  // } = useSyncLocalCartToBackend();
  
  // Disabled: One-way sync only (localStorage → backend)
  // Backend cart is synced to localStorage automatically when backend data is fetched
  // This happens in useHybridCart hook when backend data is available
  // const {
  //   isSyncingBackendToLocal,
  //   syncBackendToLocalError
  // } = useSyncBackendCartToLocalStorage();

  const contextValue: CartSyncContextType = {
    isSyncing: false, // Set to false until hooks are implemented
    isSyncingBackendToLocal: false, // Disabled for one-way sync
    syncError: null,
    syncBackendToLocalError: null
  };

  return (
    <CartSyncContext.Provider value={contextValue}>
      {children}
    </CartSyncContext.Provider>
  );
}


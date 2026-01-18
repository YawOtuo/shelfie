import Constants from 'expo-constants';

// API URL Configuration
// Using DEV URLs from environment variables or app config

// Simple network URL helper - returns URL as-is for now
const getNetworkUrl = (url: string): string => url;

// Get URL from Constants (baked into build) or fallback to process.env (for dev)
const getInventoryBackendUrl = (): string => {
  // Prioritize DEV URL for development (process.env takes precedence in dev)
  if (process.env.EXPO_PUBLIC_DEV_INVENTORY_BACKEND_URL) {
    return process.env.EXPO_PUBLIC_DEV_INVENTORY_BACKEND_URL;
  }
  
  // In standalone builds, use Constants.expoConfig.extra (uses PROD URL)
  if (Constants.expoConfig?.extra?.inventoryBackendUrl) {
    return Constants.expoConfig.extra.inventoryBackendUrl;
  }
  
  // Fallback to other env vars or default
  return process.env.EXPO_PUBLIC_PROD_INVENTORY_BACKEND_URL ||
         process.env.EXPO_PUBLIC_INVENTORY_BACKEND_URL || 
         "http://localhost:3000";
};

const inventory_backend_url_raw = getInventoryBackendUrl();

// Apply network URL transformation for physical devices
export const inventory_backend_url = getNetworkUrl(inventory_backend_url_raw);


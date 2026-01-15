import axios, { AxiosInstance } from "axios";
import { API_CONFIG } from "./config";
import { setupInterceptors } from "./interceptors";
export { tokenManager } from "./tokenManager";
export { RefreshQueue } from "./refreshQueue";
export { API_CONFIG } from "./config";

// Create an axios instance with the provided baseURL
const createAxiosInstance = (baseURL: string, isAuthInstance: boolean = false): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: API_CONFIG.DEFAULT_HEADERS,
    withCredentials: true // Important for sending/receiving cookies
  });

  if (!isAuthInstance) {
    // Create the auth instance for token refresh (using same baseURL for inventory backend)
    const authInstance: AxiosInstance = createAxiosInstance(API_CONFIG.INVENTORY_BACKEND_URL, true);
    return setupInterceptors(instance, authInstance);
  }

  return instance;
};

// Create instances with different base URLs
export const coreAxios = createAxiosInstance(API_CONFIG.CORE_URL);
export const marketplaceAxios = createAxiosInstance(API_CONFIG.MARKETPLACE_URL);
export const recordKeeperAxios = createAxiosInstance(API_CONFIG.RECORDKEEPER_URL);
export const paymentServiceAxios = createAxiosInstance(API_CONFIG.PAYMENT_SERVICE_URL);
export const inventoryAxios = createAxiosInstance(API_CONFIG.INVENTORY_BACKEND_URL);

// Export marketplace instance as default for backward compatibility
export default marketplaceAxios; 
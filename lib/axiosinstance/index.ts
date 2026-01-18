import axios, { AxiosInstance } from "axios";
import { API_CONFIG } from "./config";
import { setupInterceptors } from "./interceptors";
export { API_CONFIG } from "./config";
export { RefreshQueue } from "./refreshQueue";
export { tokenManager } from "./tokenManager";

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

// Create inventory axios instance
export const inventoryAxios = createAxiosInstance(API_CONFIG.INVENTORY_BACKEND_URL);

// Export inventory instance as default
export default inventoryAxios; 
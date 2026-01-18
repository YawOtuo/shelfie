import { inventory_backend_url } from '../../weburl';

export const API_CONFIG = {
  INVENTORY_BACKEND_URL: inventory_backend_url || "http://localhost:3000",
  DEFAULT_HEADERS: {
    "Content-Type": "application/json"
  }
} as const; 

import { core_url, marketplace_url, recordkeeper_url, payment_service_url, inventory_backend_url } from '../../weburl';

export const API_CONFIG = {
  CORE_URL: core_url || "http://localhost:8000",
  MARKETPLACE_URL: marketplace_url || "http://localhost:8001",
  RECORDKEEPER_URL: recordkeeper_url || "http://localhost:8002",
  PAYMENT_SERVICE_URL: payment_service_url || "http://localhost:8100",
  INVENTORY_BACKEND_URL: inventory_backend_url || "http://localhost:3000",
  DEFAULT_HEADERS: {
    "Content-Type": "application/json"
  }
} as const; 

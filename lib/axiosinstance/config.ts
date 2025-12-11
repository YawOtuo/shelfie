import { core_url, marketplace_url, recordkeeper_url, payment_service_url } from '../../weburl';

export const API_CONFIG = {
  CORE_URL: core_url || "http://localhost:8000",
  MARKETPLACE_URL: marketplace_url || "http://localhost:8001",
  RECORDKEEPER_URL: recordkeeper_url || "http://localhost:8002",
  PAYMENT_SERVICE_URL: payment_service_url || "http://localhost:8100",
  DEFAULT_HEADERS: {
    "Content-Type": "application/json"
  }
} as const; 

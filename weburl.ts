// API URL Configuration
// Using DEV URLs from environment variables
import { getNetworkUrl } from './lib/utils/network';

const core_url_raw = process.env.EXPO_PUBLIC_DEV_CORE_URL || process.env.EXPO_PUBLIC_CORE_URL || "http://localhost:8000";
const marketplace_url_raw = process.env.EXPO_PUBLIC_DEV_MARKETPLACE_URL || process.env.EXPO_PUBLIC_MARKETPLACE_URL || "http://localhost:8001";
const recordkeeper_url_raw = process.env.EXPO_PUBLIC_DEV_RECORDKEEPER_URL || process.env.EXPO_PUBLIC_RECORDKEEPER_URL || "http://localhost:8002";
const payment_service_url_raw = process.env.EXPO_PUBLIC_DEV_PAYMENT_SERVICE_URL || process.env.EXPO_PUBLIC_PAYMENT_SERVICE_URL || "http://localhost:8100";

// Apply network URL transformation for physical devices
export const core_url = getNetworkUrl(core_url_raw);
export const marketplace_url = getNetworkUrl(marketplace_url_raw);
export const recordkeeper_url = getNetworkUrl(recordkeeper_url_raw);
export const payment_service_url = getNetworkUrl(payment_service_url_raw);


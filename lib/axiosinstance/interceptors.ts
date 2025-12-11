import { AxiosInstance } from "axios";
import { RefreshQueue } from "./refreshQueue";

// Create a global refresh queue instance
const refreshQueue = new RefreshQueue();

export const setupInterceptors = (
  instance: AxiosInstance,
  authInstance: AxiosInstance
) => {
  // Request interceptor: enforce cookie-based auth model
  instance.interceptors.request.use(
    async (config) => {
      // Always send credentials for cookie-based auth
      config.withCredentials = true;

      // Only allow Authorization header for login/signup where Cognito ID token is required
      const authHeaderAllowedEndpoints = [
        '/api/auth/login/buyer',
        '/api/auth/login/seller',
        '/api/auth/signup/seller'
      ];

      const isAuthHeaderAllowed = authHeaderAllowedEndpoints.some(endpoint =>
        config.url?.includes(endpoint)
      );

      // Strip Authorization header for all non-auth app requests
      if (!isAuthHeaderAllowed && config.headers) {
        // Axios headers can be a plain object or AxiosHeaders; support both
        try {
          if (config.headers["Authorization"]) {
            delete config.headers["Authorization"];
          }
        } catch {
          // no-op
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: handle 401 errors with automatic refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if this is a 401 error and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Skip refresh for auth endpoints (login/signup)
        const authEndpoints = [
          '/api/auth/login/buyer',
          '/api/auth/login/seller',
          '/api/auth/signup/seller',
          '/api/auth/token/refresh'
        ];
        
        const isAuthEndpoint = authEndpoints.some(endpoint =>
          originalRequest.url?.includes(endpoint)
        );

        if (isAuthEndpoint) {
          return Promise.reject(error);
        }

        // Mark this request as retried to prevent infinite loops
        originalRequest._retry = true;

        // If we're already refreshing, queue this request
        if (refreshQueue.refreshing) {
          try {
            await refreshQueue.addToQueue();
            // Retry the original request
            return instance(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        // Start the refresh process
        refreshQueue.refreshing = true;

        try {
          // Call the refresh endpoint using the auth instance
          const refreshResponse = await authInstance.post('/api/auth/token/refresh');
          
          // Process any queued requests
          refreshQueue.processQueue(null, refreshResponse.data.access_token);
          
          // Retry the original request
          return instance(originalRequest);
        } catch (refreshError: any) {
          // Refresh failed, process queue with error
          refreshQueue.processQueue(refreshError);
          
          // // If refresh fails with 401, clear the user from store
          // if (refreshError?.response?.status === 401 && typeof window !== 'undefined') {
          //   // Use dynamic import to avoid circular dependency
          //   import("../stores/authUserStore").then(({ useAuthUserStore }) => {
          //     const { clearUser } = useAuthUserStore.getState();
          //     clearUser();
          //     console.error('Token refresh failed with 401, user cleared');
          //   }).catch((err) => {
          //     console.error('Failed to clear user after 401:', err);
          //   });
          // }
          
          // If refresh fails, redirect to login or handle as needed
          if (typeof window !== 'undefined') {
            // You can customize this behavior based on your app's needs
            console.error('Token refresh failed:', refreshError);
            // Optionally redirect to login page
            // window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        } finally {
          refreshQueue.refreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

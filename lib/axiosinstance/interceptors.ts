import { AxiosError, AxiosInstance } from "axios";
import { useAuthStore } from "../stores/authStore";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupInterceptors = (
  instance: AxiosInstance,
  authInstance: AxiosInstance
) => {
  // Request interceptor: Add JWT token to requests
  instance.interceptors.request.use(
    async (config) => {
      // Always send credentials for cookie-based auth (if needed)
      config.withCredentials = true;

      // Get access token from auth store
      const accessToken = useAuthStore.getState().accessToken;

      // Add Authorization header if token exists
      if (accessToken && config.headers) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      // Skip auth header for auth endpoints
      const authEndpoints = ['/auth/register', '/auth/login', '/auth/refresh'];
      const isAuthEndpoint = authEndpoints.some(endpoint =>
        config.url?.includes(endpoint)
      );

      if (isAuthEndpoint && config.headers) {
        delete config.headers["Authorization"];
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: Handle 401 errors with token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      // Skip refresh for auth endpoints
      const authEndpoints = [
        '/auth/register',
        '/auth/login',
        '/auth/refresh',
        '/auth/logout'
      ];
      const isAuthEndpoint = authEndpoints.some(endpoint =>
        originalRequest?.url?.includes(endpoint)
      );

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      // Handle 401 Unauthorized
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const { refreshToken: storedRefreshToken, clearAuth } = useAuthStore.getState();

        if (!storedRefreshToken) {
          isRefreshing = false;
          processQueue(error as any, null);
          await clearAuth();
          return Promise.reject(error);
        }

        try {
          // Call refresh token endpoint
          const response = await authInstance.post('/auth/refresh', {
            refreshToken: storedRefreshToken,
          });

          const { accessToken: newAccessToken } = response.data;

          // Update access token in store
          const currentUser = useAuthStore.getState().user;
          if (currentUser && newAccessToken) {
            await useAuthStore.getState().setAuth({
              accessToken: newAccessToken,
              refreshToken: storedRefreshToken,
              user: currentUser,
            });
          }

          // Process queued requests
          processQueue(null, newAccessToken);

          // Retry original request with new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          isRefreshing = false;
          return instance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError as any, null);
          await clearAuth();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

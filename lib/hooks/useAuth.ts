import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  connectToShop,
  getCurrentUser,
  login,
  logout,
  refreshToken,
  register,
} from '../api/auth';
import { useAuthStore } from '../stores/authStore';
import { ConnectToShopInput, LoginInput, RegisterInput } from '../types/auth';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
};

// Hooks
export const useLogin = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => login(data),
    onSuccess: async (data) => {
      await setAuth(data);
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      // Navigation will be handled in the component based on shopId
    },
    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterInput) => register(data),
    onSuccess: async (data) => {
      await setAuth(data);
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      // Navigation will be handled in the component based on shopId
    },
    onError: (error: any) => {
      console.error('Register error:', error);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await clearAuth();
      queryClient.clear();
      router.replace('/login');
    },
    onError: async (error: any) => {
      console.error('Logout error:', error);
      // Clear auth even if logout API call fails
      await clearAuth();
      queryClient.clear();
      router.replace('/login');
    },
  });
};

export const useCurrentUser = () => {
  const { accessToken, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    enabled: isAuthenticated && !!accessToken,
    retry: false,
  });
};

export const useRefreshToken = () => {
  const { refreshToken: storedRefreshToken, setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }
      return refreshToken(storedRefreshToken);
    },
    onSuccess: async (data) => {
      // Update access token in store
      const currentUser = queryClient.getQueryData(authKeys.currentUser());
      if (currentUser) {
        const authData = {
          accessToken: data.accessToken,
          refreshToken: storedRefreshToken!,
          user: currentUser as any,
        };
        await setAuth(authData);
      }
    },
  });
};

export const useConnectToShop = () => {
  const { updateUser, setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConnectToShopInput) => connectToShop(data),
    onSuccess: async (data) => {
      // If response includes tokens, update auth completely
      if (data.accessToken && data.refreshToken) {
        await setAuth({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        });
      } else {
        // Otherwise just update user
        await updateUser(data.user);
      }
      queryClient.setQueryData(authKeys.currentUser(), data.user);
    },
  });
};



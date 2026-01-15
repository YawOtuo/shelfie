import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';
import { AuthResponse } from '../types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (authData: AuthResponse) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
  initialize: () => Promise<void>;
}

const STORAGE_KEYS = {
  USER: '@auth_user',
  ACCESS_TOKEN: '@auth_access_token',
  REFRESH_TOKEN: '@auth_refresh_token',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (authData: AuthResponse) => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER, JSON.stringify(authData.user)],
        [STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken],
      ]);

      set({
        user: authData.user,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error saving auth data:', error);
      set({ isLoading: false });
    }
  },

  updateUser: async (user: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  },

  clearAuth: async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error clearing auth data:', error);
      set({ isLoading: false });
    }
  },

  initialize: async () => {
    try {
      const [userStr, accessToken, refreshToken] = await AsyncStorage.multiGet([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);

      const user = userStr[1] ? JSON.parse(userStr[1]) : null;

      if (user && accessToken[1] && refreshToken[1]) {
        set({
          user,
          accessToken: accessToken[1],
          refreshToken: refreshToken[1],
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error initializing auth store:', error);
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));



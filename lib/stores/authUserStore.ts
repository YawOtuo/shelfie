import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  [key: string]: any;
}

export interface AuthUserState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthUserStore = create<AuthUserState>()(
  persist(
    (set) => ({
      user: null as User | null,
      loading: false,
      setUser: (user: User | null) => set({ user }),
      clearUser: () => set({ user: null }),
      refreshUser: async () => {
        set({ loading: true });
        try {
          // Refresh user logic can be implemented here
          // For now, just set loading to false
          set({ loading: false });
        } catch (error) {
          console.warn('Could not refresh user:', error);
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

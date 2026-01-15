import { inventoryAxios } from '../axiosinstance';
import {
    AuthResponse,
    ConnectToShopInput,
    ConnectToShopResponse,
    LoginInput,
    RefreshTokenResponse,
    RegisterInput,
} from '../types/auth';
import { User } from '../types/user';

export const register = async (data: RegisterInput): Promise<AuthResponse> => {
  const response = await inventoryAxios.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await inventoryAxios.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await inventoryAxios.post<RefreshTokenResponse>('/auth/refresh', {
    refreshToken,
  });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await inventoryAxios.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await inventoryAxios.get<User>('/auth/me');
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const response = await inventoryAxios.put<{ message: string }>('/auth/password', data);
  return response.data;
};

export const connectToShop = async (data: ConnectToShopInput): Promise<ConnectToShopResponse> => {
  const response = await inventoryAxios.post<ConnectToShopResponse>('/auth/connect-shop', data);
  return response.data;
};


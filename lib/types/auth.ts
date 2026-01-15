export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

import { User } from './user';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ConnectToShopInput {
  shopId: number;
}

export interface ConnectToShopResponse {
  message: string;
  user: User;
}


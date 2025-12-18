import { coreAxios } from "../axiosinstance";

export interface LoginBuyerResponse {
  access_token: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
    [key: string]: any;
  };
}

export interface SignupBuyerResponse {
  access_token: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
    [key: string]: any;
  };
}

/**
 * Login buyer with Cognito ID token
 */
export async function loginBuyer(
  idToken: string,
  username?: string,
  loginMethod?: string
): Promise<LoginBuyerResponse> {
  const response = await coreAxios.post<LoginBuyerResponse>(
    '/api/auth/login/buyer',
    {
      username,
      login_method: loginMethod,
    },
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

/**
 * Signup buyer with Cognito ID token
 */
export async function signupBuyer(
  idToken: string,
  username?: string,
  loginMethod?: string
): Promise<SignupBuyerResponse> {
  const response = await coreAxios.post<SignupBuyerResponse>(
    '/api/auth/signup/buyer',
    {
      username,
      login_method: loginMethod,
    },
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

export interface LoginSellerResponse {
  access_token: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
    [key: string]: any;
  };
}

export interface SignupSellerResponse {
  access_token: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
    [key: string]: any;
  };
}

/**
 * Login seller with Cognito ID token
 */
export async function loginSeller(
  idToken: string,
  farmId: string,
  farmName: string,
  username?: string,
  loginMethod?: string
): Promise<LoginSellerResponse> {
  const response = await coreAxios.post<LoginSellerResponse>(
    '/api/auth/login/seller',
    {
      farm_id: farmId,
      farm_name: farmName,
      username,
      login_method: loginMethod,
    },
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

/**
 * Signup seller with Cognito ID token
 */
export async function signupSeller(
  idToken: string,
  farmData: any,
  username?: string,
  loginMethod?: string
): Promise<SignupSellerResponse> {
  const response = await coreAxios.post<SignupSellerResponse>(
    '/api/auth/signup/seller',
    {
      ...farmData,
      username,
      login_method: loginMethod,
    },
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}


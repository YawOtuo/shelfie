import { useRouter } from "expo-router";
import { coreAxios } from "../../axiosinstance";
import { signOut } from "./cognito";
import { useAuthUser } from "../../providers/AuthUserProvider";
import { User } from "../../stores/authUserStore";

export interface UserTokenResponse extends User {
  access_token?: string;
  [key: string]: any;
}

type AuthOptions = {
  redirect?: boolean;
  isSeller?: boolean;
  username?: string;
  requireVerification?: boolean;
  userType?: "buyer" | "seller";
  user?: UserTokenResponse;
};

export const useTokenManager = () => {
  const router = useRouter();
  const { clearUser, setUser } = useAuthUser();

  const handleTokenAndRedirect = async (_access_token: string, options: AuthOptions = {}) => {
    // Set the user data from the login response if available
    if (options?.user) {
      setUser(options.user);
    }
    
    if (options?.redirect) {
      // Default to buyer dashboard
      // Profile selection can be implemented later if needed
      router.replace("/(tabs)" as any);
    }
    
    return null;
  };

  const logout = async () => {
    try {
      // Sign out from Cognito
      await signOut();
      // Call backend logout to clear cookies
      await coreAxios.post('/api/auth/token/logout');
      // Clear cached user
      clearUser();
      router.replace("/login" as any);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const logoutWithoutRerouting = async () => {
    try {
      await signOut();
      await coreAxios.post('/api/auth/token/logout');
      clearUser();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return {
    handleTokenAndRedirect,
    logout,
    logoutWithoutRerouting
  };
}; 
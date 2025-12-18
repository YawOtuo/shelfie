import { useState } from "react";
import { signupSeller } from "../../api/auth";
import { FarmCreate } from "../../types/farm";
import { getAuthErrorMessage } from "../../utils/authErrors";
import { createOAuthState } from "../../utils/oauth";
import { formatPhoneNumber } from "../../utils/phone";
import { handleAuthSession, handleCognitoSignOut } from "./authUtils";
import { signIn as cognitoSignIn, signUp as cognitoSignUp, fetchAuthSession, signInWithRedirect } from "./cognito";
import { useTokenManager } from "./useTokenManager";

type SellerAuthOptions = {
  redirect?: boolean;
  loginMethod?: string;
  customState?: string;
};

type SellerSignupProps = {
  email: string;
  password: string;
  username: string;
  options?: SellerAuthOptions;
  farmData?: FarmCreate;
  isExistingUser?: boolean;
};

type SellerPhoneSignupProps = {
  phone: string;
  password: string;
  username: string;
  options?: SellerAuthOptions;
  farmData: NonNullable<SellerSignupProps['farmData']>;
  isExistingUser?: boolean;
};

export const useSellerSignup = () => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string>();
  const { handleTokenAndRedirect } = useTokenManager();

  const clearError = () => {
    setErrorText(undefined);
  };

  const signUpWithGoogle = async (options?: SellerAuthOptions, farmData?: SellerSignupProps['farmData']) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
      if (!farmData) {
        throw new Error("farm-data-required");
      }

      await handleCognitoSignOut();

      // Create OAuth state with explicit metadata that survives redirect
      // Include farmDataKey so OAuthProvider knows where to find farm data after redirect
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      const isAuthPage = currentPath.startsWith('/login') || currentPath.startsWith('/sign-up');
      const redirectTo = !isAuthPage && typeof window !== 'undefined'
        ? `${currentPath}${window.location.search}`
        : undefined;

      const oauthState = createOAuthState({
        userType: 'seller',
        flowType: 'signup',
        redirectTo,
        farmDataKey: 'farm-form-data' // localStorage key where farm data is stored
      });
        
      await signInWithRedirect({ 
        provider: 'Google' as any,
        customState: oauthState,
        options: {
          // Force Google to always show account selection
          prompt: 'SELECT_ACCOUNT' as any
        }
      });
      return null as any;
    } catch (error: any) {
      setErrorText(getAuthErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCallback = async (options?: SellerAuthOptions, farmData?: SellerSignupProps['farmData']) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
      if (!farmData) {
        throw new Error("farm-data-required");
      }

      const session = await handleAuthSession();
      const token = session.tokens.idToken.toString();
      
      const response = await signupSeller(token, farmData, undefined, 'google');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      return await handleTokenAndRedirect(response.access_token, {
        ...options,
        userType: 'seller',
        user: response.user
      });
    } catch (error: any) {
      setErrorText(getAuthErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmailAndPassword = async ({ email, password, username, options, farmData, isExistingUser }: SellerSignupProps) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
      if (!farmData) {
        throw new Error("farm-data-required");
      }

      await handleCognitoSignOut();

      if (isExistingUser) {
        await cognitoSignIn({ username: email, password });
      } else {
        try {
          await cognitoSignUp({ username: email, password, options: { userAttributes: { email } } as any });
          try {
            await cognitoSignIn({ username: email, password });
          } catch (err) {
            if ((err as any)?.name === 'UserNotConfirmedException') {
              throw new Error('ACCOUNT_NOT_CONFIRMED');
            }
            throw err;
          }
        } catch (signUpError: any) {
          // Handle UsernameExistsException specifically
          if (signUpError?.name === 'UsernameExistsException' || 
              signUpError?.__type === 'UsernameExistsException' ||
              signUpError?.message?.includes('User already exists') ||
              signUpError?.message?.includes('UsernameExistsException')) {
            throw signUpError; // Re-throw to be handled by the form
          }
          throw signUpError;
        }
      }

      const session = await fetchAuthSession();
      const token = session?.tokens?.idToken?.toString();
      if (!token) throw new Error('INVALID_TOKEN');

      const response = await signupSeller(token, farmData, username, options?.loginMethod);
      return await handleTokenAndRedirect(response.access_token, {
        ...options,
        userType: 'seller',
        user: response.user
      });
    } catch (error: any) {
      setErrorText(getAuthErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithPhoneAndPassword = async ({ phone, password, username, options, farmData, isExistingUser }: SellerPhoneSignupProps) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
      if (!farmData) {
        throw new Error("farm-data-required");
      }

      await handleCognitoSignOut();

      const formattedPhone = formatPhoneNumber(phone);
      if (isExistingUser) {
        await cognitoSignIn({ username: formattedPhone, password } as any);
      } else {
        try {
          await cognitoSignUp({ username: formattedPhone, password, options: { userAttributes: { phone_number: formattedPhone } } as any });
          try {
            await cognitoSignIn({ username: formattedPhone, password } as any);
          } catch (err) {
            if ((err as any)?.name === 'UserNotConfirmedException') {
              throw new Error('ACCOUNT_NOT_CONFIRMED');
            }
            throw err;
          }
        } catch (signUpError: any) {
          // Handle UsernameExistsException specifically
          if (signUpError?.name === 'UsernameExistsException' || 
              signUpError?.__type === 'UsernameExistsException' ||
              signUpError?.message?.includes('User already exists') ||
              signUpError?.message?.includes('UsernameExistsException')) {
            throw signUpError; // Re-throw to be handled by the form
          }
          throw signUpError;
        }
      }

      const session = await fetchAuthSession();
      const token = session?.tokens?.idToken?.toString();
      if (!token) throw new Error('INVALID_TOKEN');

      const response = await signupSeller(token, farmData, username, options?.loginMethod);
      return await handleTokenAndRedirect(response.access_token, {
        ...options,
        userType: 'seller',
        user: response.user
      });
    } catch (error: any) {
      setErrorText(getAuthErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorText,
    signUpWithGoogle,
    handleGoogleCallback,
    registerWithEmailAndPassword,
    registerWithPhoneAndPassword,
    clearError,
  };
}; 
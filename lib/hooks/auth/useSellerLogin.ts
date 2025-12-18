import { createOAuthState } from "../../utils/oauth";
import { formatPhoneNumber } from "../../utils/phone";
import { getAuthErrorMessage } from "../../utils/authErrors";
import { loginSeller } from "../../api/auth";
import { useState } from "react";
import { handleAuthSession, handleCognitoSignOut } from "./authUtils";
import { signIn as cognitoSignIn, fetchAuthSession, signInWithRedirect } from "./cognito";
import { useTokenManager } from "./useTokenManager";

type SellerAuthOptions = {
  redirect?: boolean;
  username?: string;
  farmId: string;
  farmName: string;
  loginMethod?: string;
  customState?: string;
};

type SellerLoginProps = {
  email: string;
  password: string;
  options: SellerAuthOptions;
};

type SellerPhoneLoginProps = {
  phone: string;
  password: string;
  options: SellerAuthOptions;
};

export const useSellerLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string>();
  const { handleTokenAndRedirect } = useTokenManager();

  const loginWithGoogle = async (options: SellerAuthOptions) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
      if (!options.farmId || !options.farmName) {
        throw new Error("farm-data-required");
      }

      await handleCognitoSignOut();

      // Create OAuth state with explicit metadata that survives redirect
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      const isAuthPage = currentPath.startsWith('/login') || currentPath.startsWith('/sign-up');
      const redirectTo = !isAuthPage && typeof window !== 'undefined'
        ? `${currentPath}${window.location.search}`
        : undefined;

      const oauthState = createOAuthState({
        userType: 'seller',
        flowType: 'login',
        redirectTo
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

  const handleGoogleCallback = async (options: SellerAuthOptions) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
      if (!options.farmId || !options.farmName) {
        throw new Error("farm-data-required");
      }

      const session = await handleAuthSession();
      const token = session.tokens.idToken.toString();
      
      const response = await loginSeller(
        token, 
        options.farmId, 
        options.farmName, 
        options.username, 
        'google'
      );
      
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

  const logInWithEmailAndPassword = async ({ email, password, options }: SellerLoginProps) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
      if (!options.farmId || !options.farmName) {
        throw new Error("farm-data-required");
      }

      await handleCognitoSignOut();

      const result = await cognitoSignIn({ username: email, password });

      if (!result.isSignedIn) {
        const step = result.nextStep?.signInStep;
        if (step === 'CONFIRM_SIGN_UP') {
          throw new Error('ACCOUNT_NOT_CONFIRMED');
        }
        if (step === 'RESET_PASSWORD') {
          throw new Error('RESET_PASSWORD_REQUIRED');
        }
        if (step && step.startsWith('CONFIRM_SIGN_IN')) {
          throw new Error('MFA_REQUIRED');
        }
        throw new Error('unknown-error');
      }

      const session = await fetchAuthSession();
      const token = session?.tokens?.idToken?.toString();
      if (!token) throw new Error('INVALID_TOKEN');
      
      const response = await loginSeller(token, options.farmId, options.farmName, options.username, options.loginMethod);
      
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

  const logInWithPhoneAndPassword = async ({ phone, password, options }: SellerPhoneLoginProps) => {
    setLoading(true);
    setErrorText(undefined);

    try {
      if (!options.farmId || !options.farmName) {
        throw new Error("farm-data-required");
      }

      await handleCognitoSignOut();

      const formattedPhone = formatPhoneNumber(phone);
      const result = await cognitoSignIn({ username: formattedPhone, password } as any);

      if (!result.isSignedIn) {
        const step = (result as any)?.nextStep?.signInStep;
        if (step === 'CONFIRM_SIGN_UP') {
          throw new Error('ACCOUNT_NOT_CONFIRMED');
        }
        if (step === 'RESET_PASSWORD') {
          throw new Error('RESET_PASSWORD_REQUIRED');
        }
        if (step && step.startsWith('CONFIRM_SIGN_IN')) {
          throw new Error('MFA_REQUIRED');
        }
        throw new Error('unknown-error');
      }

      const session = await fetchAuthSession();
      const token = session?.tokens?.idToken?.toString();
      if (!token) throw new Error('INVALID_TOKEN');

      const response = await loginSeller(token, options.farmId, options.farmName, options.username, options.loginMethod);
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
    loginWithGoogle,
    handleGoogleCallback,
    logInWithEmailAndPassword,
    logInWithPhoneAndPassword,
  };
}; 
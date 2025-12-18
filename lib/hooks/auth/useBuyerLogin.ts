import { useState } from "react";
import { loginBuyer } from "../../api/auth";
import { getAuthErrorMessage } from "../../utils/authErrors";
import { createOAuthState, parseOAuthState } from "../../utils/oauth";
import { formatPhoneNumber } from "../../utils/phone";
import { handleAuthSession, handleCognitoSignOut } from "./authUtils";
import { signIn as cognitoSignIn, fetchAuthSession, signInWithRedirect } from "./cognito";
import { useTokenManager } from "./useTokenManager";

type BuyerAuthOptions = {
  redirect?: boolean;
  requireVerification?: boolean;
  loginMethod?: string;
  customState?: string;
};

type BuyerLoginProps = {
  email: string;
  password: string;
  options?: BuyerAuthOptions;
};

type BuyerPhoneLoginProps = {
  phone: string;
  password: string;
  options?: BuyerAuthOptions;
};

export const useBuyerLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string>();
  const { handleTokenAndRedirect } = useTokenManager();

  const loginWithGoogle = async (options?: BuyerAuthOptions) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
      await handleCognitoSignOut();

      // Create OAuth state with explicit metadata that survives redirect
      // For React Native, we'll use a default redirect
      const redirectTo = undefined;

      const oauthState = createOAuthState({
        userType: 'buyer',
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
      console.error('Login error (Google Callback):', {
        error,
        name: error?.name,
        message: error?.message,
        underlyingError: error?.underlyingError,
        cause: error?.cause,
        __type: error?.__type,
        recoverySuggestion: error?.recoverySuggestion,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
      });
      setErrorText(getAuthErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCallback = async (options?: BuyerAuthOptions, state?: string) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
      const session = await handleAuthSession();
      const token = session.tokens.idToken.toString();
      
      const response = await loginBuyer(token, undefined, 'google');
      
      // Parse the state to extract redirect URL
      let redirectToPath: string | null = null;
      if (state) {
        const parsedState = parseOAuthState(state);
        if (parsedState?.redirectTo && typeof parsedState.redirectTo === 'string') {
          redirectToPath = parsedState.redirectTo;
        }
      }
      
      // Store the token and redirect
      const result = await handleTokenAndRedirect(
        response.access_token,
        {
          ...options,
          // prevent default dashboard redirect if we have an explicit target
          redirect: redirectToPath ? false : options?.redirect,
          userType: 'buyer',
          user: response.user
        }
      );
      
      return result;
    } catch (error: any) {
      console.error('Login error (Google):', {
        error,
        name: error?.name,
        message: error?.message,
        underlyingError: error?.underlyingError,
        cause: error?.cause,
        __type: error?.__type,
        recoverySuggestion: error?.recoverySuggestion,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
      });
      setErrorText(getAuthErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logInWithEmailAndPassword = async ({ email, password, options }: BuyerLoginProps) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
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
      
      const response = await loginBuyer(token, undefined, options?.loginMethod);
      
      return await handleTokenAndRedirect(response.access_token, {
        ...options,
        requireVerification: options?.requireVerification,
        userType: 'buyer',
        user: response.user
      });
    } catch (error: any) {
      console.error('Login error (Email/Password):', {
        error,
        name: error?.name,
        message: error?.message,
        underlyingError: error?.underlyingError,
        cause: error?.cause,
        __type: error?.__type,
        recoverySuggestion: error?.recoverySuggestion,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
      });
      setErrorText(getAuthErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logInWithPhoneAndPassword = async ({ phone, password, options }: BuyerPhoneLoginProps) => {
    setLoading(true);
    setErrorText(undefined);

    try {
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

      const response = await loginBuyer(token, undefined, options?.loginMethod);
      return await handleTokenAndRedirect(response.access_token, {
        ...options,
        userType: 'buyer',
        user: response.user
      });
    } catch (error: any) {
      console.error('Login error (Phone/Password):', {
        error,
        name: error?.name,
        message: error?.message,
        underlyingError: error?.underlyingError,
        cause: error?.cause,
        __type: error?.__type,
        recoverySuggestion: error?.recoverySuggestion,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
      });
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
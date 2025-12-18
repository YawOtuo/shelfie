import { createOAuthState, parseOAuthState } from "../../utils/oauth";
import { formatPhoneNumber } from "../../utils/phone";
import { getAuthErrorMessage } from "../../utils/authErrors";
import { signupBuyer } from "../../api/auth";
import { useState } from "react";
import { handleAuthSession, handleCognitoSignOut } from "./authUtils";
import { signIn as cognitoSignIn, signUp as cognitoSignUp, fetchAuthSession, signInWithRedirect } from "./cognito";
import { useTokenManager } from "./useTokenManager";

type BuyerAuthOptions = {
  redirect?: boolean;
  requireVerification?: boolean;
  loginMethod?: string;
  customState?: string;
};

type BuyerSignupProps = {
  email: string;
  password: string;
  username: string;
  options?: BuyerAuthOptions;
};

type BuyerPhoneSignupProps = {
  phone: string;
  password: string;
  username: string;
  options?: BuyerAuthOptions;
};

export const useBuyerSignup = () => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string>();
  const { handleTokenAndRedirect } = useTokenManager();

  const clearError = () => {
    setErrorText(undefined);
  };

  const signUpWithGoogle = async (options?: BuyerAuthOptions) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
      await handleCognitoSignOut();

      // Create OAuth state with explicit metadata that survives redirect
      // For React Native, we'll use a default redirect
      const redirectTo = undefined;

      const oauthState = createOAuthState({
        userType: 'buyer',
        flowType: 'signup',
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

  const handleGoogleCallback = async (options?: BuyerAuthOptions, state?: string) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
      const session = await handleAuthSession();
      const token = session.tokens.idToken.toString();
      
      const response = await signupBuyer(token, undefined, 'google');
      
      // Parse the state to extract redirect URL
      let redirectToPath: string | null = null;
      if (state) {
        const parsedState = parseOAuthState(state);
        if (parsedState?.redirectTo && typeof parsedState.redirectTo === 'string') {
          redirectToPath = parsedState.redirectTo;
        }
      }
      
      const user = await handleTokenAndRedirect(
        response.access_token,
        {
          ...options,
          // prevent default dashboard redirect if we have an explicit target
          redirect: redirectToPath ? false : options?.redirect,
          userType: 'buyer',
          user: response.user
        }
      );
      
      return user;
      
    } catch (error: any) {
      setErrorText(getAuthErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmailAndPassword = async ({ email, password, username, options }: BuyerSignupProps) => {
    setLoading(true);
    setErrorText(undefined);
    
    try {
      await handleCognitoSignOut();

      try {
        await cognitoSignUp({ username: email, password, options: { userAttributes: { email } } as any });
        // Attempt sign-in right away; many pools require confirmation and will block token issuance
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

      const session = await fetchAuthSession();
      const token = session?.tokens?.idToken?.toString();
      if (!token) throw new Error('ACCOUNT_NOT_CONFIRMED');

      const response = await signupBuyer(token, username, options?.loginMethod);
      
      return await handleTokenAndRedirect(response.access_token, {
        ...options,
        requireVerification: options?.requireVerification,
        userType: 'buyer',
        user: response.user
      });
    } catch (error: any) {
      setErrorText(getAuthErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithPhoneAndPassword = async ({ phone, password, username, options }: BuyerPhoneSignupProps) => {
    setLoading(true);
    setErrorText(undefined);

    try {
      await handleCognitoSignOut();

      const formatted = formatPhoneNumber(phone);
      try {
        await cognitoSignUp({ username: formatted, password, options: { userAttributes: { phone_number: formatted } } as any });
        await cognitoSignIn({ username: formatted, password } as any);
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

      const session = await fetchAuthSession();
      const token = session?.tokens?.idToken?.toString();
      if (!token) throw new Error('INVALID_TOKEN');

      const response = await signupBuyer(token, username, options?.loginMethod);
      return await handleTokenAndRedirect(response.access_token, {
        ...options,
        userType: 'buyer',
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
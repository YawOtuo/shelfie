import { getAuthErrorMessage } from "../../utils/authErrors";
import { signOut } from "./cognito";

/**
 * Centralized sign out logic
 */
export const handleCognitoSignOut = async (): Promise<void> => {
  try {
    await signOut();
  } catch (signOutError) {
    // Ignore sign out errors - user might not be signed in
  }
};

/**
 * Session fetching with retry logic
 * Polls for session to be available (Cognito needs time to process OAuth code)
 */
export const handleAuthSession = async (maxAttempts: number = 10): Promise<any> => {
  let session = null;
  let attempts = 0;

  while (!session?.tokens?.idToken && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const { fetchAuthSession } = await import("aws-amplify/auth");
      session = await fetchAuthSession();
    } catch (e) {
      // Session fetch failed, continue polling
    }
    attempts++;
  }

  if (!session?.tokens?.idToken) {
    throw new Error('Failed to get authentication session after OAuth callback');
  }

  return session;
};

/**
 * Unified error handling for auth operations
 */
export const handleAuthError = (error: any, setErrorText?: (error: string | undefined) => void): void => {
  const errorMessage = getAuthErrorMessage(error);
  if (setErrorText) {
    setErrorText(errorMessage);
  }
  throw error;
};


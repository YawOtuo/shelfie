import { Amplify } from "aws-amplify";
import {
  confirmResetPassword,
  confirmSignIn,
  confirmSignUp,
  fetchAuthSession,
  resendSignUpCode,
  resetPassword,
  signIn,
  signInWithRedirect,
  signOut,
  signUp,
  updateUserAttributes,
} from "aws-amplify/auth";
import Constants from "expo-constants";

// Get environment variables - use EXPO_PUBLIC_ prefix for React Native
const userPoolId = Constants.expoConfig?.extra?.cognitoUserPoolId || 
  process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID;
const userPoolClientId = Constants.expoConfig?.extra?.cognitoWebClientId || 
  process.env.EXPO_PUBLIC_COGNITO_WEB_CLIENT_ID;
const cognitoDomain = Constants.expoConfig?.extra?.cognitoDomain || 
  process.env.EXPO_PUBLIC_COGNITO_DOMAIN;

// Warn early if required env vars are missing
if (!userPoolId || !userPoolClientId) {
  console.warn(
    "Cognito UserPool config missing. Set EXPO_PUBLIC_COGNITO_USER_POOL_ID and EXPO_PUBLIC_COGNITO_WEB_CLIENT_ID in your environment variables or app.json extra config."
  );
}

// For React Native, we'll use deep linking for OAuth redirects
// You'll need to configure these in your app.json and Cognito console
const redirectSignInUrls = (
  Constants.expoConfig?.extra?.cognitoRedirectSignIn || 
  process.env.EXPO_PUBLIC_COGNITO_REDIRECT_SIGNIN || 
  "livestockly://auth/callback"
)
  .split(",")
  .map((s: string) => s.trim())
  .filter(Boolean);

const redirectSignOutUrls = (
  Constants.expoConfig?.extra?.cognitoRedirectSignOut || 
  process.env.EXPO_PUBLIC_COGNITO_REDIRECT_SIGNOUT || 
  "livestockly://auth/signout"
)
  .split(",")
  .map((s: string) => s.trim())
  .filter(Boolean);

// Configure Amplify
if (userPoolId && userPoolClientId) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        ...(cognitoDomain && {
          loginWith: {
            oauth: {
              domain: cognitoDomain,
              scopes: ["email", "openid", "profile"],
              redirectSignIn: redirectSignInUrls,
              redirectSignOut: redirectSignOutUrls,
              responseType: "code",
            },
          },
        }),
      },
    },
  });
}

export {
  confirmResetPassword,
  confirmSignIn,
  confirmSignUp,
  fetchAuthSession,
  resendSignUpCode,
  resetPassword,
  signIn,
  signInWithRedirect,
  signOut,
  signUp,
  updateUserAttributes
};

export const getCurrentIdToken = async (): Promise<string> => {
  const session = await fetchAuthSession();
  const idToken = session?.tokens?.idToken?.toString();
  return idToken || "";
};

// Note: Email and phone verification APIs would need to be implemented
// based on your backend API structure
export const markEmailAsVerified = async (email: string, code: string) => {
  // This would call your backend API to verify email
  // Implementation depends on your API structure
  throw new Error("Email verification not yet implemented");
};

export const markPhoneAsVerified = async (phone: string, code: string) => {
  // This would call your backend API to verify phone
  // Implementation depends on your API structure
  throw new Error("Phone verification not yet implemented");
};

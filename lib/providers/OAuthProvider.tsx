import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { handleAuthSession } from "../hooks/auth/authUtils";
import { useBuyerLogin } from "../hooks/auth/useBuyerLogin";
import { useSellerLogin } from "../hooks/auth/useSellerLogin";
import { useSellerSignup } from "../hooks/auth/useSellerSignup";
import { parseOAuthState } from "../utils/oauth";

interface OAuthContextType {
  isProcessingOAuth: boolean;
}

const OAuthContext = createContext<OAuthContextType>({ isProcessingOAuth: false });

export const useOAuth = () => useContext(OAuthContext);

export function OAuthProvider({ children }: { children: React.ReactNode }) {
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const [hasProcessedCallback, setHasProcessedCallback] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string; state?: string; error?: string }>();
  const { handleGoogleCallback: handleBuyerCallback } = useBuyerLogin();
  const { handleGoogleCallback: handleSellerLoginCallback } = useSellerLogin();
  const { handleGoogleCallback: handleSellerSignupCallback } = useSellerSignup();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = params.code;
      const state = params.state;
      const error = params.error;

      // Set processing state immediately when code/state params are detected to show loading screen
      if (code && state && !hasProcessedCallback) {
        setIsProcessingOAuth(true);
      }

      if (error) {
        console.error("OAuth error:", error);
        Alert.alert("Authentication Error", `Authentication error: ${error}`);
        setIsProcessingOAuth(false);
        return;
      }

      if (code && state && !hasProcessedCallback) {
        setHasProcessedCallback(true);
        // Parse the state to get explicit flow metadata (survives redirect)
        const parsedState = parseOAuthState(state);
        const { userType, flowType, redirectTo, farmDataKey } = parsedState || {};

        // Use explicit metadata from state instead of guessing from URLs
        const isSellerSignup = userType === 'seller' && flowType === 'signup';
        const isSellerLogin = userType === 'seller' && flowType === 'login';

        try {
          // Use shared utility to get auth session with retry logic
          const session = await handleAuthSession();

          if (isSellerSignup) {
            // For seller signup, get farm data using key from OAuth state
            const farmDataKeyToUse = farmDataKey || 'farm-form-data';
            const farmDataString = await AsyncStorage.getItem(farmDataKeyToUse);
            if (!farmDataString) {
              throw new Error('Farm data not found for seller signup. Please complete the farm setup form first.');
            }

            let farmStoreData;
            try {
              farmStoreData = JSON.parse(farmDataString);
            } catch (e) {
              throw new Error('Invalid farm data format for seller signup');
            }

            // Extract the state from Zustand store format
            const farmState = farmStoreData?.state || farmStoreData;
            if (!farmState?.name || !farmState?.location) {
              throw new Error('Incomplete farm data for seller signup. Please complete the farm setup form first.');
            }

            // Transform farm data to match the expected format for handleSellerSignupCallback
            const farmData = {
              name: farmState.name,
              location: farmState.location,
              location_json: farmState.location_json || { address: farmState.location },
              country: farmState.country,
              latitude: farmState.latitude || farmState.location_json?.latitude,
              longitude: farmState.longitude || farmState.location_json?.longitude,
              owners_name: farmState.ownerName,
              owners_email: farmState.ownerEmail,
              owners_contact: farmState.ownerContact,
              livestock_categories: farmState.livestockTypes || [],
              livestock_subcategories: farmState.livestockSubcategories || [],
            };

            await handleSellerSignupCallback({
              redirect: false,
              loginMethod: 'google'
            }, farmData);
          } else if (isSellerLogin) {
            // For seller login, get farm data from AsyncStorage
            const farmDataString = await AsyncStorage.getItem('livestockly-marketplace-farm-login');
            if (!farmDataString) {
              throw new Error('Farm data not found for seller authentication');
            }

            const farmData = JSON.parse(farmDataString);
            if (!farmData?.id || !farmData?.name) {
              throw new Error('Invalid farm data for seller authentication');
            }

            await handleSellerLoginCallback({
              redirect: false,
              loginMethod: 'google',
              farmId: farmData.id,
              farmName: farmData.name
            });
          } else {
            // Handle buyer authentication (default if state parsing fails)
            await handleBuyerCallback({ redirect: false, loginMethod: 'google' }, state);
          }

          // Wait a moment for user state to be updated in the store by handleTokenAndRedirect
          await new Promise(resolve => setTimeout(resolve, 500));

          // Check if user has seller profiles to determine redirect
          let finalRedirectTo: string;

          // If redirectTo is specified and not an auth page, use it
          const isAuthPageRedirect = redirectTo && (redirectTo.startsWith('/login') || redirectTo.startsWith('/sign-up'));

          if (redirectTo && !isAuthPageRedirect) {
            finalRedirectTo = redirectTo;
          } else {
            // Default to buyer dashboard
            // Profile selection can be implemented later if needed
            finalRedirectTo = '/(tabs)';
          }

          // Navigate using expo-router
          router.replace(finalRedirectTo as any);
          // Exit early - don't set isProcessingOAuth to false since we're redirecting
          return;

        } catch (authError: any) {
          console.error('Authentication failed:', authError);
          Alert.alert("Authentication Failed", `Authentication failed: ${authError.message}`);
          setHasProcessedCallback(false); // Reset on error to allow retry
          setIsProcessingOAuth(false); // Hide loading screen on error
        }
      }
    };

    handleOAuthCallback();
  }, [params, handleBuyerCallback, handleSellerLoginCallback, handleSellerSignupCallback, hasProcessedCallback, router]);

  if (isProcessingOAuth) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <View className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full items-center">
          {/* Logo/Brand area */}
          <View className="mb-6 items-center">
            <View className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full items-center justify-center">
              <Text className="text-white text-2xl">🔒</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">Authenticating</Text>
            <Text className="text-gray-600 text-center">Please wait while we verify your credentials</Text>
          </View>

          {/* Loading indicator */}
          <View className="mb-6">
            <ActivityIndicator size="large" color="#11964a" />
          </View>

          {/* Status message */}
          <Text className="text-sm text-gray-500">Securing your account...</Text>
        </View>
      </View>
    );
  }

  return (
    <OAuthContext.Provider value={{ isProcessingOAuth }}>
      {children}
    </OAuthContext.Provider>
  );
}


import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
import { QueryProvider } from "../lib/providers/QueryProvider";
import { AuthGuard } from "../components/AuthGuard";
import { useAuthStore } from "../lib/stores/authStore";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const { initialize, isLoading } = useAuthStore();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    // Initialize app resources
    const prepareApp = async () => {
      try {
        // Initialize auth store from AsyncStorage
        await initialize();
        
        // Wait for fonts to load
        if (!fontsLoaded) {
          return;
        }
        
        // Hide the native splash screen
        await SplashScreen.hideAsync();
        
        // Wait for a moment to show the custom loading screen
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set app as ready
        setIsReady(true);
      } catch (error) {
        console.warn(error);
        setIsReady(true);
      }
    };

    prepareApp();
  }, [fontsLoaded, initialize]);

  // Show loading screen while app is preparing
  if (!isReady) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#A0826D" />
      </View>
    );
  }

  return (
    <QueryProvider>
      <AuthGuard>
        <View className="flex-1 bg-white">
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="select-shop" options={{ headerShown: false }} />
            <Stack.Screen name="create-shop" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
      </AuthGuard>
    </QueryProvider>
  );
}
  
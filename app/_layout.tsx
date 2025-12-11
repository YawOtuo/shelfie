import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { LoadingScreen } from "../components/LoadingScreen";
import "../global.css";
import { QueryProvider } from "../lib/providers/QueryProvider";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    // Simulate loading resources
    const prepareApp = async () => {
      try {
        // Wait for fonts to load
        if (!fontsLoaded) {
          return;
        }
        
        // Hide the native splash screen
        await SplashScreen.hideAsync();
        
        // Wait for a moment to show the custom loading screen
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Set app as ready
        setIsReady(true);
      } catch (error) {
        console.warn(error);
        setIsReady(true);
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  // Show loading screen while app is preparing
  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1 bg-white">
      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </QueryProvider>
    </View>
  );
}
  
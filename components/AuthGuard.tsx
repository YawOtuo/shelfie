import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "../lib/stores/authStore";
import { Text } from "./ui/Text";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user, isLoading, initialize } = useAuthStore();
  const segments = useRouter();
  const router = useRouter();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Ensure store is initialized
      if (!isAuthReady) {
        await initialize();
        setIsAuthReady(true);
      }
    };
    checkAuth();
  }, [initialize, isAuthReady]);

  useEffect(() => {
    if (!isAuthReady || isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)" || segments[0] === "login" || segments[0] === "signup";
    const inPublicGroup = segments[0] === "login" || segments[0] === "signup";

    // If not authenticated and trying to access protected routes
    if (!isAuthenticated && !inPublicGroup) {
      router.replace("/login");
      return;
    }

    // If authenticated and on auth pages, redirect based on shop status
    if (isAuthenticated && inPublicGroup) {
      if (user?.shopId) {
        router.replace("/(tabs)");
      } else {
        router.replace("/select-shop");
      }
      return;
    }

    // If authenticated but no shop and trying to access tabs
    if (isAuthenticated && !user?.shopId && segments[0] === "(tabs)") {
      router.replace("/select-shop");
      return;
    }
  }, [isAuthenticated, isAuthReady, isLoading, user?.shopId, segments, router]);

  // Show loading while checking auth
  if (!isAuthReady || isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#A0826D" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}


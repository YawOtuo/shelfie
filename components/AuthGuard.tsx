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
  const segments = useSegments();
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

    const currentSegment = segments[0] || "";
    const inPublicGroup = currentSegment === "login" || currentSegment === "signup";

    // If not authenticated and trying to access protected routes
    if (!isAuthenticated && !inPublicGroup && currentSegment !== "select-shop") {
      router.replace("/login");
      return;
    }

    // If authenticated and on signup page, redirect based on shop status
    if (isAuthenticated && currentSegment === "signup") {
      if (user?.shopId) {
        router.replace("/(tabs)");
      } else {
        router.replace("/select-shop");
      }
      return;
    }

    // Allow authenticated users to stay on login page to see shop selection
    // (They will see shop selection inline after login)

    // If authenticated but no shop and trying to access tabs
    if (isAuthenticated && !user?.shopId && currentSegment === "(tabs)") {
      router.replace("/select-shop");
      return;
    }
  }, [isAuthenticated, isAuthReady, isLoading, user?.shopId, segments, router]);

  // Show loading while checking auth
  if (!isAuthReady || isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#b49a67" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}





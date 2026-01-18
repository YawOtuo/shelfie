import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "../components/ui/Text";
import { useAuthStore } from "../lib/stores/authStore";

export default function IndexScreen() {
  const { isAuthenticated, user, isLoading, initialize } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initialize();
      setIsReady(true);
    };
    init();
  }, [initialize]);

  if (!isReady || isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#b49a67" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
      </View>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // If authenticated but no shop, redirect to shop selection
  if (isAuthenticated && !user?.shopId) {
    return <Redirect href="/select-shop" />;
  }

  // If authenticated with shop, redirect to tabs
  return <Redirect href="/(tabs)" />;
}


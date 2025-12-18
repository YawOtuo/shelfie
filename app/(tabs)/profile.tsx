import { useRouter } from "expo-router";
import { Bell, Settings } from "lucide-react-native";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingScreen } from "../../components/LoadingScreen";
import {
  LogoutButton,
  ProfileMenu,
} from "../../components/profile";
import { Text } from "../../components/ui/Text";
import { useTokenManager } from "../../lib/hooks/auth/useTokenManager";
import { useGetCurrentUser } from "../../lib/hooks/useGetCurrentUser";
import { useHybridSavedFarms } from "../../lib/hooks/useHybridSavedFarms";
import { useHybridSavedListings } from "../../lib/hooks/useHybridSavedListings";

export default function ProfileScreen() {
  const router = useRouter();
  
  // Get actual user data
  const { user, loading: userLoading } = useGetCurrentUser();
  
  // Get saved items and farms counts
  const { data: savedListings = [], isLoading: savedListingsLoading } = useHybridSavedListings();
  const { data: savedFarms = [], isLoading: savedFarmsLoading } = useHybridSavedFarms();

  // Get logout function
  const { logout } = useTokenManager();

  // Calculate dashboard stats from actual data
  const dashboardStats = {
    totalOrders: 0, // TODO: Replace with actual orders API when available
    savedItems: savedListings.length,
    savedFarms: savedFarms.length,
  };

  const handleLogout = async () => {
    await logout();
  };

  // Show loading screen while user data is loading
  if (userLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={['left', 'right']}>
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false} style={{ backgroundColor: '#FFFFFF' }}>
        {/* Simplified Header */}
        <View className="bg-white px-5 pt-2 pb-6" style={{ backgroundColor: '#FFFFFF' }}>
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-2xl font-bold text-gray-900" variant="bold">
              Profile
            </Text>
            <View className="flex-row" style={{ gap: 8 }}>
              <TouchableOpacity
                onPress={() => router.push("/notifications")}
                className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center"
              >
                <Bell color="#6B7280" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/settings")}
                className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center"
              >
                <Settings color="#6B7280" size={20} />
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-sm text-gray-600 mt-1">
            {user?.email || ""}
          </Text>
        </View>

        {/* Quick Stats - Simplified */}
        {(savedListingsLoading || savedFarmsLoading) ? (
          <View className="mx-5 mb-6 items-center py-8">
            <ActivityIndicator size="large" color="#11964a" />
          </View>
        ) : (
          <View className="px-5 mb-6">
            <View className="flex-row" style={{ gap: 12 }}>
              <TouchableOpacity
                onPress={() => router.push("/orders")}
                activeOpacity={0.7}
                className="flex-1 bg-gray-50 rounded-2xl p-4"
              >
                <Text className="text-3xl font-bold text-gray-900 mb-1">
                  {dashboardStats.totalOrders}
                </Text>
                <Text className="text-xs text-gray-600">Orders</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/saved")}
                activeOpacity={0.7}
                className="flex-1 bg-gray-50 rounded-2xl p-4"
              >
                <Text className="text-3xl font-bold text-gray-900 mb-1">
                  {dashboardStats.savedItems}
                </Text>
                <Text className="text-xs text-gray-600">Saved</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/farms")}
                activeOpacity={0.7}
                className="flex-1 bg-gray-50 rounded-2xl p-4"
              >
                <Text className="text-3xl font-bold text-gray-900 mb-1">
                  {dashboardStats.savedFarms}
                </Text>
                <Text className="text-xs text-gray-600">Farms</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <ProfileMenu />

        {/* Logout Button */}
        <LogoutButton onLogout={handleLogout} />

        {/* App Version */}
        <View className="items-center pb-6 mt-4">
          <Text className="text-gray-400 text-xs">Livestockly v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


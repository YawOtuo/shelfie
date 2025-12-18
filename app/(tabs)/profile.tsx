import { useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingScreen } from "../../components/LoadingScreen";
import {
  DashboardStats,
  LogoutButton,
  ProfileMenu,
  UserInfoCard,
} from "../../components/profile";
import { Text } from "../../components/ui/Text";
import { useTokenManager } from "../../lib/hooks/auth/useTokenManager";
import { useGetCurrentUser } from "../../lib/hooks/useGetCurrentUser";
import { useHybridSavedFarms } from "../../lib/hooks/useHybridSavedFarms";
import { useHybridSavedListings } from "../../lib/hooks/useHybridSavedListings";
import { useListings } from "../../lib/hooks/useListings";
import { Listing } from "../../lib/types/listing";

interface Order {
  id: string;
  orderNumber: string;
  listingTitle: string;
  listingImage?: string;
  farmName: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
}

export default function ProfileScreen() {
  const router = useRouter();
  
  // Get actual user data
  const { user, loading: userLoading } = useGetCurrentUser();
  
  // Get saved items and farms counts
  const { data: savedListings = [], isLoading: savedListingsLoading } = useHybridSavedListings();
  const { data: savedFarms = [], isLoading: savedFarmsLoading } = useHybridSavedFarms();
  
  // Fetch recommended listings
  const { listings } = useListings({ limit: 10 });

  // Get logout function
  const { logout } = useTokenManager();

  // Calculate dashboard stats from actual data
  const dashboardStats = {
    totalOrders: 0, // TODO: Replace with actual orders API when available
    savedItems: savedListings.length,
    savedFarms: savedFarms.length,
  };

  // Mock pending orders - replace with actual API data when available
  const pendingOrders: Order[] = [];

  // Get recommended listings (first 5 from fetched listings)
  const recommendedListings: Listing[] = listings.slice(0, 5);

  const handleLogout = async () => {
    await logout();
  };

  // Show loading screen while user data is loading
  if (userLoading) {
    return <LoadingScreen />;
  }

  // Get user display name - fallback to email or "User" if name is not available
  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const firstName = userName.split(" ")[0];

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={['left', 'right']}>
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false} style={{ backgroundColor: '#FFFFFF' }}>
        {/* Header with Welcome and Settings */}
        <View className="bg-white px-5 pt-2 pb-3 border-b border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900" variant="bold">
                Welcome back, {firstName}
              </Text>
              <Text className="text-xs text-gray-600 mt-1">
                {user?.email || "N/A"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
            >
              <Settings color="#11964a" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info Card - Always show with N/A for missing fields */}
        <View className="mt-4">
          <UserInfoCard
            email={user?.email || "N/A"}
            phone={user?.phone || "N/A"}
            location="N/A" // TODO: Add location to user model if available
          />
        </View>

        {/* Dashboard Stats */}
        {(savedListingsLoading || savedFarmsLoading) ? (
          <View className="mx-4 mt-4 items-center py-8">
            <ActivityIndicator size="large" color="#11964a" />
            <Text className="text-gray-600 mt-4">Loading dashboard...</Text>
          </View>
        ) : (
          <DashboardStats
            totalOrders={dashboardStats.totalOrders}
            savedItems={dashboardStats.savedItems}
            savedFarms={dashboardStats.savedFarms}
            pendingOrders={pendingOrders}
            recommendedListings={recommendedListings}
          />
        )}

        {/* Menu Items */}
        <ProfileMenu />

        {/* Logout Button */}
        <LogoutButton onLogout={handleLogout} />

        {/* App Version */}
        <View className="items-center pb-6">
          <Text className="text-gray-400 text-xs">Livestockly v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


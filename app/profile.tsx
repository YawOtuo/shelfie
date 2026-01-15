import { useRouter } from "expo-router";
import { Building2, Heart, LogOut, Mail, MapPin, Package, Phone, Settings, User as UserIcon } from "lucide-react-native";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { Card } from "../components/ui/Card";
import { Text } from "../components/ui/Text";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuthStore } from "../lib/stores/authStore";
import { useLogout } from "../lib/hooks/useAuth";
import { useItems } from "../lib/hooks/useItems";
import { useRecentlySoldItems } from "../lib/hooks/useInventory";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const shopId = user?.shopId;

  // Fetch stats
  const { data: itemsData } = useItems(1, 100, !!shopId);
  const { data: soldItemsData } = useRecentlySoldItems(shopId || 0, !!shopId);

  // Calculate stats
  const dashboardStats = {
    totalOrders: soldItemsData?.length || 0,
    savedItems: 0, // Not available in backend
    inventory: itemsData?.items.length || 0,
  };

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={["left", "right"]}>
        <Header showBack={true} />
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" />
          <Text className="text-gray-600 mt-4">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={["left", "right"]}>
      <Header showBack={true} />
      <ScrollView
        className="flex-1 bg-white"
        style={{ backgroundColor: '#FFFFFF' }}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4">
          {/* User Profile Header */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-primary items-center justify-center mr-4">
                <UserIcon color="#FFFFFF" size={32} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-0.5" variant="bold">
                  {user.username || "User"}
                </Text>
                <Text className="text-sm text-gray-600">
                  {user.email || "No email"}
                </Text>
              </View>
            </View>

            {/* Contact Information */}
            <View style={{ gap: 10 }}>
              <View className="flex-row items-center py-2">
                <Mail color="#6B7280" size={18} />
                <Text className="ml-3 text-gray-700 flex-1 text-sm">
                  {user.email || "N/A"}
                </Text>
              </View>
              {user.phoneNumber && (
                <View className="flex-row items-center py-2">
                  <Phone color="#6B7280" size={18} />
                  <Text className="ml-3 text-gray-700 flex-1 text-sm">
                    {user.phoneNumber}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Quick Stats */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-900 mb-3">Overview</Text>
            <View className="flex-row" style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => router.push("/orders")}
                activeOpacity={0.7}
                className="flex-1 bg-gray-50 rounded-xl p-3"
              >
                <Package color="#D2B48C" size={18} />
                <Text className="text-xl font-bold text-gray-900 mt-1.5 mb-0.5">
                  {dashboardStats.totalOrders}
                </Text>
                <Text className="text-xs text-gray-600">Orders</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/index")}
                activeOpacity={0.7}
                className="flex-1 bg-gray-50 rounded-xl p-3"
              >
                <Heart color="#D2B48C" size={18} />
                <Text className="text-xl font-bold text-gray-900 mt-1.5 mb-0.5">
                  {dashboardStats.savedItems}
                </Text>
                <Text className="text-xs text-gray-600">Saved</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/index")}
                activeOpacity={0.7}
                className="flex-1 bg-gray-50 rounded-xl p-3"
              >
                <Building2 color="#D2B48C" size={18} />
                <Text className="text-xl font-bold text-gray-900 mt-1.5 mb-0.5">
                  {dashboardStats.inventory}
                </Text>
                <Text className="text-xs text-gray-600">Inventory</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Menu Section */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-900 mb-3">Account</Text>
            <Card className="mb-3" padding="md">
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/settings")}
                activeOpacity={0.7}
                className="flex-row items-center"
              >
                <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-3">
                  <Settings color="#6B7280" size={18} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-900">
                    Settings
                  </Text>
                </View>
              </TouchableOpacity>
            </Card>

            <Card className="mb-3" padding="md">
              <TouchableOpacity
                onPress={handleLogout}
                activeOpacity={0.7}
                className="flex-row items-center"
              >
                <View className="w-9 h-9 rounded-full bg-red-100 items-center justify-center mr-3">
                  <LogOut color="#EF4444" size={18} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-red-600">
                    Logout
                  </Text>
                </View>
              </TouchableOpacity>
            </Card>
          </View>

          {/* App Version */}
          <View className="items-center mt-4">
            <Text className="text-gray-400 text-xs">Shelfie v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

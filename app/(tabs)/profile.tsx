import { ScrollView, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { Text } from "../../components/ui/Text";
import {
  DashboardStats,
  ProfileMenu,
  LogoutButton,
} from "../../components/profile";
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
  
  // Mock user data - replace with actual user data from API/context
  const user = {
    name: "John Doe",
  };

  // Fetch recommended listings
  const { listings } = useListings({ limit: 10 });

  // Mock dashboard stats - replace with actual API data
  const dashboardStats = {
    totalOrders: 12,
    savedItems: 8,
    savedFarms: 5,
  };

  // Mock pending orders - replace with actual API data
  const pendingOrders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-2024-003",
      listingTitle: "Free Range Chickens - Organic",
      listingImage: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80",
      farmName: "Happy Hens Farm",
      totalPrice: 900,
      status: "pending",
    },
    {
      id: "2",
      orderNumber: "ORD-2024-004",
      listingTitle: "Dorper Sheep - Quality Breed",
      farmName: "Mountain View Farm",
      totalPrice: 3600,
      status: "pending",
    },
  ];

  // Get recommended listings (first 5 from fetched listings)
  const recommendedListings: Listing[] = listings.slice(0, 5);

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logout");
  };

  // Get first name for welcome message
  const firstName = user.name.split(" ")[0];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Header with Welcome and Settings */}
        <View className="bg-white px-4 pt-6 pb-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                Welcome back, {firstName}
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

        {/* Dashboard Stats */}
        <DashboardStats
          totalOrders={dashboardStats.totalOrders}
          savedItems={dashboardStats.savedItems}
          savedFarms={dashboardStats.savedFarms}
          pendingOrders={pendingOrders}
          recommendedListings={recommendedListings}
        />

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


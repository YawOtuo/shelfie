import { TouchableOpacity, View, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { Package, Heart, Building2, Clock, ChevronRight } from "lucide-react-native";
import { Text } from "../ui/Text";
import { Card } from "../ui/Card";
import { ListingCard } from "../ListingCard";
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

interface DashboardStatsProps {
  totalOrders: number;
  savedItems: number;
  savedFarms: number;
  pendingOrders: Order[];
  recommendedListings: Listing[];
}

export function DashboardStats({
  totalOrders,
  savedItems,
  savedFarms,
  pendingOrders,
  recommendedListings,
}: DashboardStatsProps) {
  const router = useRouter();

  const stats = [
    {
      id: "orders",
      icon: Package,
      label: "Total Orders",
      value: totalOrders.toString(),
      onPress: () => router.push("/orders"),
    },
    {
      id: "saved",
      icon: Heart,
      label: "Saved Items",
      value: savedItems.toString(),
      onPress: () => router.push("/(tabs)/saved"),
    },
    {
      id: "farms",
      icon: Building2,
      label: "Saved Farms",
      value: savedFarms.toString(),
      onPress: () => router.push("/(tabs)/farms"),
    },
  ];

  const renderPendingOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      onPress={() => router.push("/orders")}
      activeOpacity={0.7}
      className="mr-3"
      style={{ width: 256 }}
    >
      <Card className="w-full" padding="md">
        <View className="flex-row">
          <View className="w-16 h-16 rounded-xl bg-gray-100 mr-3 overflow-hidden">
            {item.listingImage ? (
              <Image
                source={{ uri: item.listingImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Package color="#9CA3AF" size={24} />
              </View>
            )}
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-900 mb-1" numberOfLines={1}>
              {item.listingTitle}
            </Text>
            <Text className="text-xs text-gray-600 mb-2" numberOfLines={1}>
              {item.farmName}
            </Text>
            <View className="flex-row items-center">
              <Clock color="#F59E0B" size={12} />
              <Text className="text-xs text-gray-600 ml-1">Pending</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderRecommendedListing = ({ item }: { item: Listing }) => (
    <View className="mr-4">
      <ListingCard
        listing={item}
        onPress={() => router.push(`/listing/${item.id}`)}
        isHandpicked={false}
        width={200}
      />
    </View>
  );

  return (
    <View className="mt-4">
      {/* Stats Summary */}
      <Card className="mx-4 mb-4" padding="md">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900">Dashboard</Text>
        </View>

        <View className="flex-row" style={{ gap: 12 }}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <TouchableOpacity
                key={stat.id}
                onPress={stat.onPress}
                activeOpacity={0.7}
                className="flex-1"
              >
                <View className="bg-gray-50 p-4 rounded-2xl items-center">
                  <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mb-2">
                    <Icon color="#11964a" size={20} />
                  </View>
                  <Text className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </Text>
                  <Text className="text-xs text-gray-600 text-center">{stat.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <View className="mb-4">
          <View className="px-4 mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">Pending Orders</Text>
            <TouchableOpacity onPress={() => router.push("/orders")}>
              <Text className="text-primary text-sm">View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={pendingOrders}
            renderItem={renderPendingOrder}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />
        </View>
      )}

      {/* Recommended Listings */}
      {recommendedListings.length > 0 && (
        <View className="mb-4">
          <View className="px-4 mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">You Might Like</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/")}>
              <Text className="text-primary text-sm">View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recommendedListings}
            renderItem={renderRecommendedListing}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>
      )}
    </View>
  );
}


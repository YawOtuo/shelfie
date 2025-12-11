import { ScrollView, TouchableOpacity, View, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Package,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  ChevronRight,
} from "lucide-react-native";
import { Text } from "../components/ui/Text";
import { Card } from "../components/ui/Card";
import { DetailHeader } from "../components/DetailHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  orderNumber: string;
  listingTitle: string;
  listingImage?: string;
  farmName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  orderDate: string;
  deliveryDate?: string;
  location: string;
}

// Mock orders data - replace with actual API call
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    listingTitle: "Healthy Angus Cattle - Premium Quality",
    listingImage: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80",
    farmName: "Green Valley Farm",
    quantity: 2,
    unitPrice: 12500,
    totalPrice: 25000,
    status: "delivered",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-20",
    location: "Kumasi, Ashanti Region",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    listingTitle: "Boer Goats - Ready for Sale",
    listingImage: "https://images.unsplash.com/photo-1583512603806-077998240c7a?w=800&q=80",
    farmName: "Sunrise Livestock",
    quantity: 5,
    unitPrice: 850,
    totalPrice: 4250,
    status: "shipped",
    orderDate: "2024-01-18",
    deliveryDate: "2024-01-25",
    location: "Accra, Greater Accra",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    listingTitle: "Free Range Chickens - Organic",
    listingImage: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80",
    farmName: "Happy Hens Farm",
    quantity: 20,
    unitPrice: 45,
    totalPrice: 900,
    status: "processing",
    orderDate: "2024-01-20",
    location: "Cape Coast, Central Region",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    listingTitle: "Dorper Sheep - Quality Breed",
    farmName: "Mountain View Farm",
    quantity: 3,
    unitPrice: 1200,
    totalPrice: 3600,
    status: "pending",
    orderDate: "2024-01-22",
    location: "Tamale, Northern Region",
  },
];

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return { color: "#F59E0B", bgColor: "#FEF3C7", icon: Clock, label: "Pending" };
    case "confirmed":
      return { color: "#3B82F6", bgColor: "#DBEAFE", icon: CheckCircle, label: "Confirmed" };
    case "processing":
      return { color: "#8B5CF6", bgColor: "#EDE9FE", icon: Package, label: "Processing" };
    case "shipped":
      return { color: "#06B6D4", bgColor: "#CFFAFE", icon: Truck, label: "Shipped" };
    case "delivered":
      return { color: "#10B981", bgColor: "#D1FAE5", icon: CheckCircle, label: "Delivered" };
    case "cancelled":
      return { color: "#EF4444", bgColor: "#FEE2E2", icon: XCircle, label: "Cancelled" };
    default:
      return { color: "#6B7280", bgColor: "#F3F4F6", icon: Clock, label: "Unknown" };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
};

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleOrderPress = (orderId: string) => {
    // Navigate to order details
    console.log("Navigate to order details:", orderId);
  };

  const renderOrderCard = (order: Order) => {
    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;

    return (
      <Card key={order.id} className="mb-4" padding="none">
        <TouchableOpacity
          onPress={() => handleOrderPress(order.id)}
          activeOpacity={0.7}
        >
          <View className="flex-row p-4">
            {/* Listing Image */}
            <View className="w-20 h-20 rounded-xl bg-gray-100 mr-3 overflow-hidden">
              {order.listingImage ? (
                <Image
                  source={{ uri: order.listingImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Package color="#9CA3AF" size={24} />
                </View>
              )}
            </View>

            {/* Order Info */}
            <View className="flex-1">
              <View className="flex-row items-start justify-between mb-1">
                <Text className="text-sm font-semibold text-gray-900 flex-1" numberOfLines={2}>
                  {order.listingTitle}
                </Text>
                <ChevronRight color="#9CA3AF" size={18} />
              </View>

              <Text className="text-xs text-gray-600 mb-2">{order.farmName}</Text>

              <View className="flex-row items-center mb-2">
                <MapPin color="#6B7280" size={12} />
                <Text className="text-xs text-gray-600 ml-1" numberOfLines={1}>
                  {order.location}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <Calendar color="#6B7280" size={12} />
                  <Text className="text-xs text-gray-600 ml-1">
                    {formatDate(order.orderDate)}
                  </Text>
                </View>
                <Text className="text-sm font-semibold text-gray-900">
                  {formatCurrency(order.totalPrice)}
                </Text>
              </View>

              {/* Status Badge */}
              <View
                className="flex-row items-center self-start px-2 py-1 rounded-full"
                style={{ backgroundColor: statusConfig.bgColor }}
              >
                <StatusIcon color={statusConfig.color} size={12} />
                <Text
                  className="text-xs ml-1"
                  style={{ color: statusConfig.color }}
                >
                  {statusConfig.label}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <DetailHeader title="My Orders" showBack={true} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-4">
          {orders.length === 0 ? (
            <EmptyState
              iconType="package"
              title="No Orders Yet"
              message="You haven't placed any orders yet. Start browsing livestock listings to make your first purchase."
              action={
                <Button
                  onPress={() => router.push("/(tabs)/")}
                  variant="primary"
                >
                  Browse Listings
                </Button>
              }
            />
          ) : (
            <>
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-900">
                  Order History
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {orders.length} {orders.length === 1 ? "order" : "orders"}
                </Text>
              </View>
              {orders.map((order) => renderOrderCard(order))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


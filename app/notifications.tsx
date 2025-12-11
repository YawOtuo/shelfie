import { ScrollView, TouchableOpacity, View, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import {
  Bell,
  Package,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Heart,
  Truck,
} from "lucide-react-native";
import { Text } from "../components/ui/Text";
import { Card } from "../components/ui/Card";
import { DetailHeader } from "../components/DetailHeader";
import { EmptyState } from "../components/ui/EmptyState";

type NotificationType = "order" | "promotion" | "system" | "saved" | "shipping";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Mock notifications data - replace with actual API call
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "Order Confirmed",
    message: "Your order ORD-2024-003 has been confirmed and is being processed.",
    timestamp: "2024-01-22T10:30:00Z",
    read: false,
  },
  {
    id: "2",
    type: "shipping",
    title: "Order Shipped",
    message: "Your order ORD-2024-002 has been shipped and is on its way.",
    timestamp: "2024-01-20T14:15:00Z",
    read: false,
  },
  {
    id: "3",
    type: "order",
    title: "Order Delivered",
    message: "Your order ORD-2024-001 has been delivered successfully.",
    timestamp: "2024-01-20T09:00:00Z",
    read: true,
  },
  {
    id: "4",
    type: "promotion",
    title: "Special Offer",
    message: "Get 15% off on all cattle listings this week! Limited time offer.",
    timestamp: "2024-01-19T16:45:00Z",
    read: false,
  },
  {
    id: "5",
    type: "saved",
    title: "Price Drop Alert",
    message: "A listing you saved has dropped in price. Check it out now!",
    timestamp: "2024-01-18T11:20:00Z",
    read: true,
  },
  {
    id: "6",
    type: "system",
    title: "Welcome to Livestockly",
    message: "Thank you for joining Livestockly! Start browsing livestock listings now.",
    timestamp: "2024-01-15T08:00:00Z",
    read: true,
  },
];

const getNotificationIcon = (type: NotificationType) => {
  const iconProps = { size: 20, color: "#11964a" };
  switch (type) {
    case "order":
      return <Package {...iconProps} />;
    case "shipping":
      return <Truck {...iconProps} />;
    case "promotion":
      return <AlertCircle {...iconProps} />;
    case "saved":
      return <Heart {...iconProps} />;
    case "system":
      return <Info {...iconProps} />;
    default:
      return <Bell {...iconProps} />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "order":
      return "#3B82F6";
    case "shipping":
      return "#06B6D4";
    case "promotion":
      return "#F59E0B";
    case "saved":
      return "#EF4444";
    case "system":
      return "#11964a";
    default:
      return "#6B7280";
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Handle navigation if actionUrl exists
    if (notification.actionUrl) {
      console.log("Navigate to:", notification.actionUrl);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderNotification = (notification: Notification) => {
    const iconColor = getNotificationColor(notification.type);

    return (
      <Card
        key={notification.id}
        className={`mb-3 ${!notification.read ? "bg-blue-50" : ""}`}
        padding="md"
      >
        <View className="flex-row">
          {/* Icon */}
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            {getNotificationIcon(notification.type)}
          </View>

          {/* Content */}
          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-1">
              <Text
                className={`text-base flex-1 ${!notification.read ? "font-semibold" : ""} text-gray-900`}
              >
                {notification.title}
              </Text>
              {!notification.read && (
                <View className="w-2 h-2 rounded-full bg-primary ml-2 mt-1" />
              )}
            </View>
            <Text className="text-sm text-gray-600 mb-2">
              {notification.message}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-gray-500">
                {formatTimestamp(notification.timestamp)}
              </Text>
              <TouchableOpacity
                onPress={() => handleDeleteNotification(notification.id)}
                className="p-1"
              >
                <X color="#9CA3AF" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <DetailHeader title="Notifications" showBack={true} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-4">
          {notifications.length === 0 ? (
            <EmptyState
              iconType="package"
              title="No Notifications"
              message="You're all caught up! We'll notify you when there's something new."
            />
          ) : (
            <>
              {unreadCount > 0 && (
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-sm text-gray-600">
                    {unreadCount} {unreadCount === 1 ? "unread notification" : "unread notifications"}
                  </Text>
                  <TouchableOpacity onPress={handleMarkAllAsRead}>
                    <Text className="text-primary text-sm font-medium">
                      Mark all as read
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  onPress={() => handleNotificationPress(notification)}
                  activeOpacity={0.7}
                >
                  {renderNotification(notification)}
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


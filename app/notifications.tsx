import { useRouter } from "expo-router";
import {
  AlertCircle,
  Bell,
  Heart,
  Info,
  Package,
  Truck,
  X
} from "lucide-react-native";
import { useMemo } from "react";
import { Alert, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { NoShopConnected } from "../components/NoShopConnected";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Text } from "../components/ui/Text";
import { useDeleteNotification, useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useShopNotifications } from "../lib/hooks/useNotifications";
import { useAuthStore } from "../lib/stores/authStore";
import { Notification } from "../lib/types/notification";

type NotificationType = "order" | "promotion" | "system" | "saved" | "shipping";

// Map backend notification type to UI notification type
const mapNotificationType = (type?: string): NotificationType => {
  if (!type) return "system";
  const lowerType = type.toLowerCase();
  if (lowerType.includes("order") || lowerType.includes("sale")) return "order";
  if (lowerType.includes("promotion") || lowerType.includes("offer")) return "promotion";
  if (lowerType.includes("shipping") || lowerType.includes("delivery")) return "shipping";
  if (lowerType.includes("saved") || lowerType.includes("favorite")) return "saved";
  return "system";
};

const getNotificationIcon = (type: NotificationType) => {
  const iconProps = { size: 20, color: "#b49a67" };
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
      return "#b49a67";
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
  const router = useRouter();
  const { user } = useAuthStore();
  const shopId = user?.shopId;

  // Fetch notifications
  const { data: notificationsData, isLoading, error, refetch } = useShopNotifications(
    shopId || 0,
    !!shopId
  );

  // Mutations
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  // Convert backend notifications to UI format
  interface UINotification extends Notification {
    uiType: NotificationType;
    title: string;
    timestamp: string;
  }

  const notifications: UINotification[] = useMemo(() => {
    if (!notificationsData) return [];
    return notificationsData.map((notif: Notification) => ({
      ...notif,
      uiType: mapNotificationType(notif.type),
      title: notif.subject,
      timestamp: notif.createdAt || new Date().toISOString(),
    }));
  }, [notificationsData]);

  const onRefresh = async () => {
    refetch();
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markAsReadMutation.mutateAsync(notification.id);
      } catch (error: any) {
        Alert.alert("Error", error?.response?.data?.message || "Failed to mark as read");
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!shopId) return;
    try {
      await markAllAsReadMutation.mutateAsync(shopId);
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Failed to mark all as read");
    }
  };

  const handleDeleteNotification = async (id: number) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNotificationMutation.mutateAsync(id);
            } catch (error: any) {
              Alert.alert("Error", error?.response?.data?.message || "Failed to delete notification");
            }
          },
        },
      ]
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Show loading state
  if (isLoading && !notifications.length) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={["left", "right"]}>
        <Header showBack={true} />
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" />
          <Text className="text-gray-600 mt-4">Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error && !notifications.length) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={["left", "right"]}>
        <Header showBack={true} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 text-center mb-4">
            {error instanceof Error ? error.message : "Failed to load notifications"}
          </Text>
          <Button onPress={() => refetch()} size="lg">
            Retry
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // Show message if no shop
  if (!shopId) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={["left", "right"]}>
        <Header showBack={true} />
        <NoShopConnected message="Please connect to a shop or create one to view notifications" />
      </SafeAreaView>
    );
  }

  const renderNotification = (notification: UINotification) => {
    const iconColor = getNotificationColor(notification.uiType);

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
            {getNotificationIcon(notification.uiType)}
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
                onPress={() => handleDeleteNotification(Number(notification.id))}
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
    <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={["left", "right"]}>
      <Header showBack={true} />
      <ScrollView
        className="flex-1 bg-white"
        style={{ backgroundColor: '#FFFFFF' }}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
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
                  <Button
                    onPress={handleMarkAllAsRead}
                    variant="ghost"
                    size="sm"
                    textClassName="text-primary text-sm font-medium"
                  >
                    Mark all as read
                  </Button>
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


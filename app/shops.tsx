import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { CreateShopButton, ShopListItem } from "../components/shops";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Text } from "../components/ui/Text";
import { useToast } from "../components/ui/ToastProvider";
import { colors } from "../lib/colors";
import { useConnectToShop, useCurrentUser } from "../lib/hooks/useAuth";
import { useShops } from "../lib/hooks/useShops";
import { useAuthStore } from "../lib/stores/authStore";
import { Shop } from "../lib/types/shop";

export default function ShopsScreen() {
  const router = useRouter();
  const { user, updateUser, setAuth } = useAuthStore();
  const { data: shops, isLoading, error, refetch } = useShops();
  const { refetch: refetchUser } = useCurrentUser();
  const connectToShopMutation = useConnectToShop();
  const { showSuccess, showError, showInfo } = useToast();

  const handleSwitchShop = async (shop: Shop) => {
    if (user?.shopId === shop.id) {
      showInfo("You are already connected to this shop.");
      return;
    }

    Alert.alert(
      "Switch Shop",
      `Are you sure you want to switch to "${shop.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Switch",
          onPress: async () => {
            try {
              const response = await connectToShopMutation.mutateAsync({ shopId: shop.id });
              
              // If response includes tokens, update auth completely (mutation's onSuccess already does this)
              // Otherwise ensure user is updated
              if (response?.accessToken && response?.refreshToken && response?.user) {
                await setAuth({
                  accessToken: response.accessToken,
                  refreshToken: response.refreshToken,
                  user: response.user,
                });
              } else if (response?.user) {
                await updateUser(response.user);
              }
              
              // Wait for state to persist
              await new Promise(resolve => setTimeout(resolve, 300));

              const isAlreadyConnected = response?.message?.toLowerCase().includes("already connected");
              showSuccess(
                isAlreadyConnected 
                  ? "You are already connected to this shop!" 
                  : "Successfully switched to shop!"
              );
              
              setTimeout(() => {
                router.back();
              }, 300);
            } catch (error: any) {
              showError(
                error?.response?.data?.message || "Failed to switch shop. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  if (isLoading && !shops) {
    return (
      <SafeAreaView 
        className="flex-1" 
        style={{ backgroundColor: colors.white }} 
        edges={["left", "right"]}
      >
        <StatusBar style="dark" />
        <Header showBack={true} />
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" />
          <Text className="text-gray-600 mt-4 text-xs">Loading shops...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView 
        className="flex-1" 
        style={{ backgroundColor: colors.white }} 
        edges={["left", "right"]}
      >
        <StatusBar style="dark" />
        <Header showBack={true} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 text-center mb-4 text-sm">
            Error loading shops. Please try again.
          </Text>
          <Button onPress={() => refetch()} variant="outline" size="sm">
            <Text className="text-sm" variant="medium">Retry</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      className="flex-1" 
      style={{ backgroundColor: colors.white }} 
      edges={["left", "right"]}
    >
      <StatusBar style="dark" />
      <Header showBack={true} />
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.white }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <View className="px-5 pt-4">
          {/* Header */}
          <View className="mb-5">
            <Text className="text-xl text-gray-900 mb-1" variant="bold">
              My Shops
            </Text>
            <Text className="text-xs text-gray-500">
              Manage and switch between your shops
            </Text>
          </View>

          {/* Create New Shop Button */}
          <View className="mb-5">
            <CreateShopButton onPress={() => router.push("/create-shop")} />
          </View>

          {/* Shops List */}
          {!shops || shops.length === 0 ? (
            <View className="mt-4">
              <EmptyState
                iconType="building"
                title="No Shops Available"
                message="Create your first shop to get started with inventory management."
                size="md"
              />
              <Button
                onPress={() => router.push("/create-shop")}
                size="sm"
                className="mt-6"
              >
                <Text className="text-sm" variant="medium">Create Your First Shop</Text>
              </Button>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {shops.map((shop) => {
                const isCurrentShop = user?.shopId === shop.id;
                return (
                  <ShopListItem
                    key={shop.id}
                    shop={shop}
                    isCurrentShop={isCurrentShop}
                    onSwitchShop={handleSwitchShop}
                    isLoading={connectToShopMutation.isPending}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

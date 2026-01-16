import { useRouter } from "expo-router";
import { Building2, Plus, Check, Mail, Phone, MapPin, Globe } from "lucide-react-native";
import { ScrollView, TouchableOpacity, View, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { Card } from "../components/ui/Card";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { EmptyState } from "../components/ui/EmptyState";
import { useShops } from "../lib/hooks/useShops";
import { useConnectToShop } from "../lib/hooks/useAuth";
import { useAuthStore } from "../lib/stores/authStore";
import { useCurrentUser } from "../lib/hooks/useAuth";
import { colors } from "../lib/colors";
import { Shop } from "../lib/types/shop";

export default function ShopsScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const { data: shops, isLoading, error, refetch } = useShops();
  const { refetch: refetchUser } = useCurrentUser();
  const connectToShopMutation = useConnectToShop();

  const handleSwitchShop = async (shop: Shop) => {
    if (user?.shopId === shop.id) {
      Alert.alert("Already Connected", "You are already connected to this shop.");
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
              await connectToShopMutation.mutateAsync({ shopId: shop.id });
              
              // Refetch user data to get updated shopId
              const updatedUserData = await refetchUser();
              if (updatedUserData.data) {
                await updateUser(updatedUserData.data);
              }

              Alert.alert("Success", "Successfully switched to shop!", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } catch (error: any) {
              Alert.alert(
                "Error",
                error?.response?.data?.message || "Failed to switch shop. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
        <Header showBack={true} />
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" />
          <Text className="text-gray-600 mt-4">Loading shops...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
        <Header showBack={true} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 text-center mb-4">
            Error loading shops. Please try again.
          </Text>
          <Button onPress={() => refetch()} variant="outline" size="lg">
            Retry
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <Header showBack={true} />
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <View className="px-5">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl text-gray-900 mb-2" variant="bold">
              My Shops
            </Text>
            <Text className="text-sm text-gray-600">
              Manage and switch between your shops
            </Text>
          </View>

          {/* Create New Shop Button */}
          <TouchableOpacity
            onPress={() => router.push("/create-shop")}
            activeOpacity={0.7}
            className="mb-6"
          >
            <Card className="p-4 border-2 border-dashed border-primary/30" style={{ backgroundColor: colors.primary[100] }}>
              <View className="flex-row items-center justify-center">
                <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-3">
                  <Plus color={colors.primary.DEFAULT} size={24} />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-primary text-center" variant="semibold">
                    Create a New Shop
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          {/* Shops List */}
          {!shops || shops.length === 0 ? (
            <View className="mt-8">
              <EmptyState
                iconType="building"
                title="No Shops Available"
                message="Create your first shop to get started with inventory management."
              />
              <Button
                onPress={() => router.push("/create-shop")}
                size="lg"
                className="mt-6"
              >
                Create Your First Shop
              </Button>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {shops.map((shop) => {
                const isCurrentShop = user?.shopId === shop.id;
                return (
                  <Card key={shop.id} className="p-4">
                    <View className="flex-row items-start mb-3">
                      <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center mr-4">
                        <Building2 color={colors.primary.DEFAULT} size={28} />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                          <Text className="text-lg text-gray-900 mr-2" variant="bold">
                            {shop.name}
                          </Text>
                          {isCurrentShop && (
                            <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary[100] }}>
                              <Text className="text-xs text-primary" variant="medium">
                                Current
                              </Text>
                            </View>
                          )}
                        </View>
                        {shop.description && (
                          <Text className="text-sm text-gray-600 mb-2">
                            {shop.description}
                          </Text>
                        )}

                        {/* Shop Details */}
                        <View style={{ gap: 8, marginTop: 8 }}>
                          {shop.address && (
                            <View className="flex-row items-center">
                              <MapPin color={colors.gray[500]} size={14} />
                              <Text className="text-xs text-gray-600 ml-2 flex-1">
                                {shop.address}
                              </Text>
                            </View>
                          )}
                          {shop.phone && (
                            <View className="flex-row items-center">
                              <Phone color={colors.gray[500]} size={14} />
                              <Text className="text-xs text-gray-600 ml-2 flex-1">
                                {shop.phone}
                              </Text>
                            </View>
                          )}
                          {shop.email && (
                            <View className="flex-row items-center">
                              <Mail color={colors.gray[500]} size={14} />
                              <Text className="text-xs text-gray-600 ml-2 flex-1">
                                {shop.email}
                              </Text>
                            </View>
                          )}
                          {shop.website && (
                            <View className="flex-row items-center">
                              <Globe color={colors.gray[500]} size={14} />
                              <Text className="text-xs text-primary ml-2 flex-1">
                                {shop.website}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row" style={{ gap: 8, marginTop: 12 }}>
                      {!isCurrentShop && (
                        <Button
                          onPress={() => handleSwitchShop(shop)}
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          loading={connectToShopMutation.isPending}
                          disabled={connectToShopMutation.isPending}
                        >
                          <View className="flex-row items-center">
                            <Check color={colors.white} size={16} style={{ marginRight: 6 }} />
                            <Text className="text-white" variant="medium" style={{ fontSize: 13 }}>
                              Switch to Shop
                            </Text>
                          </View>
                        </Button>
                      )}
                      {isCurrentShop && (
                        <View className="flex-1 items-center justify-center py-2 px-4 rounded-lg" style={{ backgroundColor: colors.primary[100] }}>
                          <View className="flex-row items-center">
                            <Check color={colors.primary.DEFAULT} size={16} style={{ marginRight: 6 }} />
                            <Text className="text-primary" variant="medium" style={{ fontSize: 13 }}>
                              Currently Active
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </Card>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

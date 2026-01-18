import { useRouter } from "expo-router";
import { Building2, Check, Plus } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { colors } from "../../lib/colors";
import { useConnectToShop, useCurrentUser } from "../../lib/hooks/useAuth";
import { useUserShops } from "../../lib/hooks/useShops";
import { useAuthStore } from "../../lib/stores/authStore";
import { Shop } from "../../lib/types/shop";
import { Button } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Text } from "../ui/Text";
import { useToast } from "../ui/ToastProvider";

// Helper to get user from store
const getUserFromStore = () => useAuthStore.getState().user;

interface ConnectShopStepProps {
  onSuccess?: () => void;
}

export function ConnectShopStep({ onSuccess }: ConnectShopStepProps) {
  const router = useRouter();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [errorText, setErrorText] = useState("");
  const { data: shops, isLoading: shopsLoading } = useUserShops(true);
  const connectToShopMutation = useConnectToShop();
  const { refetch: refetchUser } = useCurrentUser();
  const { updateUser, setAuth } = useAuthStore();
  const { showSuccess, showError } = useToast();

  const handleConnectToShop = async () => {
    if (!selectedShop) return;
    
    setErrorText("");
    try {
      const response = await connectToShopMutation.mutateAsync({ shopId: selectedShop.id });
      
      // If response includes tokens, update auth completely (mutation's onSuccess already does this)
      // Otherwise just ensure user is updated
      if (response?.accessToken && response?.refreshToken && response?.user) {
        await setAuth({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
        });
      } else if (response?.user) {
        await updateUser(response.user);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));

      const isAlreadyConnected = response?.message?.toLowerCase().includes("already connected");
      showSuccess(
        isAlreadyConnected 
          ? "You are already connected to this shop!" 
          : "Successfully connected to shop!"
      );
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.replace("/(tabs)");
        }
      }, 300);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to connect to shop. Please try again.";
      setErrorText(errorMessage);
      showError(errorMessage);
    }
  };

  if (shopsLoading) {
    return (
      <View className="flex-1 justify-center items-center px-6 bg-primary-200">
        <LoadingSpinner size="large" />
        <Text className="text-primary-900 mt-4">Loading shops...</Text>
      </View>
    );
  }

  if (!shops || shops.length === 0) {
    return (
      <View className="flex-1 justify-center px-6 bg-primary-200">
        <View className="items-center mb-8">
          <View 
            className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
            style={{ backgroundColor: colors.primary[100] }}
          >
            <Building2 size={32} color={colors.primary.DEFAULT} />
          </View>
          <Text className="text-lg font-semibold text-primary-900 text-center mb-2">
            No Shops Available
          </Text>
          <Text className="text-sm text-primary-800/70 text-center max-w-xs">
            Create your first shop to get started with inventory management.
          </Text>
        </View>
        <Button 
          onPress={() => router.push("/create-shop")} 
          size="lg" 
          className="mt-6 rounded-full min-h-14 py-4"
        >
          Create a New Shop
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary-200">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 py-8" style={{ width: "100%" }}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-primary-900 text-center mb-2">
            Select a Shop
          </Text>
          <Text className="text-base text-primary-800/70 text-center">
            Choose the shop you want to connect with
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          className="flex-1"
        >
          <View className="gap-3">
            {shops.map((shop) => (
              <TouchableOpacity
                key={shop.id}
                onPress={() => setSelectedShop(shop)}
                activeOpacity={0.7}
              >
                <View
                  className={`p-4 rounded-2xl ${
                    selectedShop?.id === shop.id
                      ? "border-2 border-primary-900"
                      : "border border-primary-300/50"
                  }`}
                  style={{
                    backgroundColor: selectedShop?.id === shop.id 
                      ? colors.primary[100] 
                      : colors.primary[50],
                  }}
                >
                  <View className="flex-row items-center">
                    <View 
                      className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                      style={{ backgroundColor: colors.primary[100] }}
                    >
                      <Building2 size={24} color={colors.primary.DEFAULT} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-primary-900">
                        {shop.name}
                      </Text>
                    </View>
                    {selectedShop?.id === shop.id && (
                      <View className="w-6 h-6 rounded-full bg-primary-900 items-center justify-center">
                        <Check size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            
            {/* Create New Shop Button */}
            <View
              style={{
                backgroundColor: colors.primary[50],
                borderColor: colors.primary[300] + "80",
              }}
            >
              <Button
                onPress={() => router.push("/create-shop")}
                variant="outline"
                icon={
                  <View 
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: colors.primary[100] }}
                  >
                    <Plus size={24} color={colors.primary.DEFAULT} />
                  </View>
                }
                label="Create a New Shop"
                className="border-2 border-dashed rounded-2xl bg-transparent"
                textClassName="text-primary-900"
              />
            </View>
          </View>
        </ScrollView>

        {errorText && (
          <View className="mb-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
            <Text className="text-red-400 text-sm text-center font-medium">{errorText}</Text>
          </View>
        )}

        <View className="mt-4">
          <Button
            onPress={handleConnectToShop}
            loading={connectToShopMutation.isPending}
            disabled={!selectedShop || connectToShopMutation.isPending}
            className="mb-3 rounded-full h-14"
            size="md"
          >
            Connect to Shop
          </Button>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

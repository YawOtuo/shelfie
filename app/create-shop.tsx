import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Text } from "../components/ui/Text";
import { useCreateShop } from "../lib/hooks/useShops";
import { useAuthStore } from "../lib/stores/authStore";

export default function CreateShopScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [name, setName] = useState("");

  const createShopMutation = useCreateShop();

  const handleCreateShop = async () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Shop name is required");
      return;
    }

    try {
      const shop = await createShopMutation.mutateAsync({
        name: name.trim(),
      });

      Alert.alert("Success", "Shop created successfully", [
        {
          text: "OK",
          onPress: () => {
            // Update user's shopId and navigate back
            if (user && shop) {
              useAuthStore.getState().updateUser({ ...user, shopId: shop.id });
              router.back();
            }
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Failed to create shop");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <Header showBack={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingTop: 20, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6">
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Create Shop
              </Text>
              <Text className="text-sm text-gray-600">
                Create a new shop to start managing your inventory
              </Text>
            </View>

            <View className="mb-6">
              <Input
                label="Shop Name *"
                value={name}
                onChangeText={setName}
                placeholder="Enter shop name"
                autoCapitalize="words"
                className="mb-6"
              />
            </View>

            <Button
              onPress={handleCreateShop}
              loading={createShopMutation.isPending}
              disabled={!name.trim() || createShopMutation.isPending}
              size="lg"
              className="w-full"
            >
              Create Shop
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


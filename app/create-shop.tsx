import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Text } from "../components/ui/Text";
import { useToast } from "../components/ui/ToastProvider";
import { useCurrentUser } from "../lib/hooks/useAuth";
import { useCreateShop } from "../lib/hooks/useShops";
import { useAuthStore } from "../lib/stores/authStore";

export default function CreateShopScreen() {
  const router = useRouter();
  const { updateUser } = useAuthStore();
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { refetch: refetchUser } = useCurrentUser();
  const { showSuccess, showError } = useToast();

  const createShopMutation = useCreateShop();

  const handleCreateShop = async () => {
    if (!name.trim()) {
      showError("Shop name is required");
      return;
    }

    // Prevent multiple clicks
    if (isProcessing || createShopMutation.isPending) {
      return;
    }

    setIsProcessing(true);

    try {
      await createShopMutation.mutateAsync({
        name: name.trim(),
      });

      // Backend automatically connects the user to the shop
      // Fetch updated user data to get the new shopId
      const updatedUserData = await refetchUser();
      
      if (updatedUserData.data) {
        await updateUser(updatedUserData.data);
      }

      showSuccess("Shop created successfully!");
      
      // Navigate immediately after success
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 100);
    } catch (error: any) {
      setIsProcessing(false);
      showError(error?.response?.data?.message || "Failed to create shop");
    }
  };

  const isLoading = isProcessing || createShopMutation.isPending;

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1" edges={["left", "right", "top"]}>
        {/* Custom Header */}
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 p-2 -ml-2"
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="rgba(102, 82, 55, 0.7)" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-primary-900 flex-1" variant="bold">
            Shelfie
          </Text>
        </View>
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
                <Text className="text-3xl font-bold text-primary-900 mb-2">
                  Create Shop
                </Text>
                <Text className="text-base text-primary-800">
                  Create a new shop to start managing your inventory
                </Text>
              </View>

              <View className="mb-6">
                <View className="mb-2">
                  <Text className="text-sm font-medium text-primary-800">
                    Shop Name *
                  </Text>
                </View>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter shop name"
                  autoCapitalize="words"
                  editable={!isLoading}
                  className="bg-transparent border border-primary-900 rounded-full h-14 px-6 text-primary-900"
                  placeholderTextColor="rgba(102, 82, 55, 0.5)"
                />
              </View>

              <Button
                onPress={handleCreateShop}
                loading={isLoading}
                disabled={!name.trim() || isLoading}
                size="lg"
                className="w-full rounded-full min-h-14 py-4 bg-primary"
              >
                Create Shop
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}


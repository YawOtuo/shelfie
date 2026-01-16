import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Alert,
  ScrollView,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useCurrentUserShop, useUpdateShop } from "../lib/hooks/useShops";
import { useAuthStore } from "../lib/stores/authStore";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export default function EditShopScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: shop, isLoading: shopLoading } = useCurrentUserShop(!!user?.shopId);
  const updateShopMutation = useUpdateShop();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (shop) {
      setName(shop.name || "");
      setDescription(shop.description || "");
      setAddress(shop.address || "");
      setPhone(shop.phone || "");
      setEmail(shop.email || "");
      setWebsite(shop.website || "");
    }
  }, [shop]);

  const handleSave = async () => {
    if (!shop || !user?.shopId) {
      Alert.alert("Error", "Shop information not available");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Error", "Shop name is required");
      return;
    }

    try {
      await updateShopMutation.mutateAsync({
        id: shop.id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          address: address.trim() || undefined,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          website: website.trim() || undefined,
        },
      });

      Alert.alert("Success", "Shop details updated successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update shop details"
      );
    }
  };

  if (shopLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
        <Header />
        <View className="flex-1 justify-center items-center">
          <LoadingSpinner />
        </View>
      </SafeAreaView>
    );
  }

  if (!shop) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
        <Header />
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-gray-500 text-center mb-4">
            Unable to load shop details
          </Text>
          <Button onPress={() => router.back()} variant="outline">
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="px-5 pt-6">
            <Card className="p-4">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Edit Shop Details
              </Text>

              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Shop Name <Text className="text-red-500">*</Text>
                  </Text>
                  <Input
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter shop name"
                    autoCapitalize="words"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Description
                  </Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter shop description"
                    multiline
                    numberOfLines={4}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
                    style={{
                      minHeight: 100,
                      textAlignVertical: "top",
                    }}
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Address
                  </Text>
                  <TextInput
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter shop address"
                    multiline
                    numberOfLines={3}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
                    style={{
                      minHeight: 80,
                      textAlignVertical: "top",
                    }}
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </Text>
                  <Input
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Email
                  </Text>
                  <Input
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Website
                  </Text>
                  <Input
                    value={website}
                    onChangeText={setWebsite}
                    placeholder="Enter website URL"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View className="flex-row gap-3 mt-6">
                <Button
                  onPress={() => router.back()}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <Text className="text-gray-700 font-medium">Cancel</Text>
                </Button>
                <Button
                  onPress={handleSave}
                  size="lg"
                  className="flex-1"
                  disabled={updateShopMutation.isPending}
                >
                  {updateShopMutation.isPending ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <Text className="text-white font-medium">Save Changes</Text>
                  )}
                </Button>
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


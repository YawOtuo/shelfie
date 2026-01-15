import { useRouter } from "expo-router";
import { Building2, Check, ChevronLeft, Package } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Text } from "../components/ui/Text";
import { useShops } from "../lib/hooks/useShops";
import { useConnectToShop } from "../lib/hooks/useAuth";
import { Shop } from "../lib/types/shop";

export default function SelectShopScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const { data: shops, isLoading: shopsLoading, error: shopsError } = useShops();
  const connectToShopMutation = useConnectToShop();

  // Step Indicator Component
  const StepIndicator = () => {
    return (
      <View className="flex-row items-center justify-center mb-6 px-6">
        {[1, 2, 3].map((step) => (
          <View key={step} className="flex-row items-center">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                step === currentStep
                  ? "bg-primary"
                  : step < currentStep
                  ? "bg-primary/20"
                  : "bg-gray-200"
              }`}
            >
              {step < currentStep ? (
                <Check size={16} color="#0e7a3c" />
              ) : (
                <Text
                  className={`text-sm font-semibold ${
                    step === currentStep ? "text-white" : "text-gray-500"
                  }`}
                >
                  {step}
                </Text>
              )}
            </View>
            {step < 3 && (
              <View
                className={`h-1 w-12 mx-2 ${
                  step < currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  // Step 1: Welcome/Introduction
  const renderStep1 = () => {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
            <Building2 size={40} color="#0e7a3c" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
            Connect to a Shop
          </Text>
          <Text className="text-sm text-gray-600 text-center leading-5 px-4">
            To get started, you need to connect to a shop. Select from the available shops below.
          </Text>
        </View>
        <View className="w-full">
          <Button onPress={() => setCurrentStep(2)} size="lg" className="mb-3">
            Continue
          </Button>
        </View>
      </View>
    );
  };

  // Step 2: Shop Selection
  const renderStep2 = () => {
    if (shopsLoading) {
      return (
        <View className="flex-1 justify-center items-center px-6">
          <LoadingSpinner size="large" />
          <Text className="text-gray-600 mt-4">Loading shops...</Text>
        </View>
      );
    }

    if (shopsError) {
      return (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-600 text-center mb-4">
            Error loading shops. Please try again.
          </Text>
          <Button onPress={() => router.back()} variant="outline" size="lg">
            Go Back
          </Button>
        </View>
      );
    }

    if (!shops || shops.length === 0) {
      return (
        <View className="flex-1 justify-center items-center px-6">
          <EmptyState
            title="No Shops Available"
            message="There are no shops available at the moment. Please contact support."
          />
          <Button onPress={() => router.back()} variant="outline" size="lg" className="mt-4">
            Go Back
          </Button>
        </View>
      );
    }

    return (
      <View className="flex-1 px-6">
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            Select a Shop
          </Text>
          <Text className="text-sm text-gray-600">
            Choose the shop you want to connect with
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="gap-3">
            {shops.map((shop) => (
              <TouchableOpacity
                key={shop.id}
                onPress={() => setSelectedShop(shop)}
                activeOpacity={0.7}
              >
                <Card
                  className={`p-4 ${
                    selectedShop?.id === shop.id
                      ? "border-2 border-primary bg-primary/5"
                      : "border border-gray-200"
                  }`}
                >
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                      <Building2 size={24} color="#0e7a3c" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900">
                        {shop.name}
                      </Text>
                    </View>
                    {selectedShop?.id === shop.id && (
                      <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                        <Check size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View className="mt-6 pb-6">
          <Button
            onPress={() => {
              if (selectedShop) {
                setCurrentStep(3);
              }
            }}
            disabled={!selectedShop}
            size="lg"
            className="mb-3"
          >
            Continue
          </Button>
          <Button
            onPress={() => setCurrentStep(1)}
            variant="outline"
            size="lg"
          >
            Back
          </Button>
        </View>
      </View>
    );
  };

  // Step 3: Confirmation & Connection
  const renderStep3 = () => {
    return (
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
            <Package size={40} color="#0e7a3c" />
          </View>
          <Text className="text-xl font-bold text-gray-900 text-center mb-3">
            Confirm Selection
          </Text>
          {selectedShop && (
            <Card className="p-6 w-full">
              <View className="items-center">
                <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
                  <Building2 size={32} color="#0e7a3c" />
                </View>
                <Text className="text-lg font-bold text-gray-900 mb-2">
                  {selectedShop.name}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  You're about to connect to this shop. You'll need approval from the shop owner.
                </Text>
              </View>
            </Card>
          )}
        </View>

        {connectToShopMutation.isError && (
          <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
            <Text className="text-red-600 text-sm text-center">
              {connectToShopMutation.error?.response?.data?.message ||
                connectToShopMutation.error?.message ||
                "Failed to connect to shop. Please try again."}
            </Text>
          </View>
        )}

        <View className="gap-3">
          <Button
            onPress={() => {
              if (selectedShop) {
                connectToShopMutation.mutate(
                  { shopId: selectedShop.id },
                  {
                    onSuccess: () => {
                      // Navigate to home after successful connection
                      router.replace("/(tabs)");
                    },
                  }
                );
              }
            }}
            loading={connectToShopMutation.isPending}
            disabled={!selectedShop || connectToShopMutation.isPending}
            size="lg"
          >
            Connect to Shop
          </Button>
          <Button
            onPress={() => setCurrentStep(2)}
            variant="outline"
            size="lg"
            disabled={connectToShopMutation.isPending}
          >
            Back
          </Button>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <Header showBack={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Step Indicator */}
          <StepIndicator />

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}



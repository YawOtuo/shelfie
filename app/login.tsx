import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Eye, EyeOff, Package, ShoppingCart, TrendingUp } from "lucide-react-native";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Text } from "../components/ui/Text";
import { useLogin } from "../lib/hooks/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState("");
  const loginMutation = useLogin();

  const handleLogin = async () => {
    // Simple validation
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter both email and password");
      return;
    }

    setErrorText("");
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          // Check if user has shopId
          if (data.user.shopId) {
            // User has a shop, navigate to home
            router.replace("/(tabs)");
          } else {
            // User has no shop, navigate to shop selection
            router.replace("/select-shop");
          }
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "An error occurred during login";
          setErrorText(errorMessage);
        },
      }
    );
  };

  const handleGoogleLogin = async () => {
    // Google login not implemented yet
    Alert.alert("Coming Soon", "Google login will be available soon");
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const skipToLogin = () => {
    setCurrentStep(3);
  };

  // Step Indicator Component
  const StepIndicator = () => {
    return (
      <View className="flex-row items-center justify-center mb-6">
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            className={`w-2 h-2 rounded-full mx-1 ${
              step === currentStep ? "bg-primary" : "bg-gray-300"
            }`}
          />
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
            <Package size={40} color="#0e7a3c" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
            Welcome to Shelfie
          </Text>
          <Text className="text-sm text-gray-600 text-center leading-5">
            Manage inventory, track sales, and grow your business.
          </Text>
        </View>
        <View className="w-full">
          <Button onPress={nextStep} size="lg" className="mb-3">
            Next
          </Button>
          <TouchableOpacity onPress={skipToLogin} className="py-2">
            <Text className="text-primary text-center text-sm">Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Step 2: Features/Benefits
  const renderStep2 = () => {
    const features = [
      {
        icon: Package,
        title: "Inventory Management",
        description: "Track your products",
      },
      {
        icon: ShoppingCart,
        title: "Sales Tracking",
        description: "Monitor sales and revenue",
      },
      {
        icon: TrendingUp,
        title: "Business Growth",
        description: "Data-driven decisions",
      },
    ];

    return (
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
            Why Shelfie?
          </Text>
          <Text className="text-sm text-gray-600 text-center mb-6 leading-5">
            Everything you need in one place
          </Text>
          <View className="gap-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <View
                  key={index}
                  className="flex-row items-center bg-gray-50 rounded-xl p-3"
                >
                  <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center mr-3">
                    <IconComponent size={20} color="#0e7a3c" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                      {feature.title}
                    </Text>
                    <Text className="text-xs text-gray-600">
                      {feature.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <View className="w-full">
          <Button onPress={nextStep} size="lg">
            Next
          </Button>
        </View>
      </View>
    );
  };

  // Step 3: Login Form
  const renderStep3 = () => {
    return (
      <View className="flex-1 justify-center px-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
            Get Started
          </Text>
          <Text className="text-sm text-gray-600 text-center">
            Sign in to continue
          </Text>
        </View>

        <View className="mb-4">
          <View className="mb-4">
            <Input
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              size="lg"
              className="bg-gray-50 border-gray-200"
            />
          </View>

          <View className="mb-1">
            <View className="relative">
              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                size="lg"
                className="bg-gray-50 border-gray-200 pr-12"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-0 bottom-0 justify-center"
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeOff size={22} color="#6B7280" />
                ) : (
                  <Eye size={22} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity className="self-end mb-4">
            <Text className="text-primary text-sm">Forgot password?</Text>
          </TouchableOpacity>

          {/* Error Message */}
          {errorText && (
            <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
              <Text className="text-red-600 text-sm text-center">{errorText}</Text>
            </View>
          )}

          {/* Login Button */}
          <Button
            onPress={handleLogin}
            loading={loginMutation.isPending}
            disabled={!email || !password || loginMutation.isPending}
            className="mb-4"
            size="lg"
          >
            Sign In
          </Button>

          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-400 text-xs">or</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Google Login Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={loginMutation.isPending}
            className="flex-row items-center justify-center bg-white border border-gray-200 rounded-xl py-3 px-4 mb-4"
            style={{ 
              opacity: loginMutation.isPending ? 0.6 : 1,
            }}
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 font-semibold text-sm">
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-600 text-sm">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")} activeOpacity={0.7}>
            <Text className="text-primary font-semibold text-sm">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <StatusBar style="dark" />
      {/* Simple Header */}
      <View className="bg-white px-5 py-4">
        <View className="flex-row items-center justify-center">
          <Text className="text-xl font-bold text-gray-900" variant="bold">
            Shelfie
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1"
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

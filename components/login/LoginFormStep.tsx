import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useLogin } from "../../lib/hooks/useAuth";
import { useAuthStore } from "../../lib/stores/authStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Text } from "../ui/Text";
import { ConnectShopStep } from "./ConnectShopStep";

interface LoginFormStepProps {
  onBack: () => void;
}

export function LoginFormStep({ onBack }: LoginFormStepProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showShopSelection, setShowShopSelection] = useState(false);
  const loginMutation = useLogin();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter both email and password");
      return;
    }

    setErrorText("");
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          // Always show shop selection after login
          setShowShopSelection(true);
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
    Alert.alert("Coming Soon", "Google login will be available soon");
  };

  // Show shop selection if logged in but no shop
  if (showShopSelection) {
    return (
      <ConnectShopStep
        onSuccess={() => router.replace("/(tabs)")}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-center px-6" style={{ width: "100%" }}>

        <View className="mb-8">
          <Text className="text-3xl font-bold text-primary-900 text-center mb-2">
            Get Started
          </Text>
          <Text className="text-base text-primary-800 text-center">
            Sign in to continue
          </Text>
        </View>

        <View className="mb-4">
          <Input
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            size="md"
            className="bg-transparent border border-primary-900 rounded-full h-14 px-6 text-primary-900"
            placeholderTextColor="rgba(102, 82, 55, 0.5)"
          />
        </View>

        <View className="mb-2">
          <View className="relative">
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              size="md"
              className="bg-transparent border border-primary-900 rounded-full h-14 pr-14 px-6 text-primary-900"
              placeholderTextColor="rgba(102, 82, 55, 0.5)"
              />
            <Button
              onPress={() => setShowPassword(!showPassword)}
              variant="ghost"
              size="sm"
              className="absolute right-5 top-0 bottom-0 justify-center"
            >
              {showPassword ? (
                <EyeOff size={20} color="rgba(102, 82, 55, 0.5)" />
              ) : (
                <Eye size={20} color="rgba(102, 82, 55, 0.5)" />
              )}
            </Button>
          </View>
        </View>

        {/* Forgot Password */}
        <Button
          variant="ghost"
          size="sm"
          className="self-end mb-8"
          textClassName="text-primary-800/70 text-sm font-medium"
        >
          Forgot password?
        </Button>

        {/* Error Message */}
        {errorText && (
          <View className="mb-6 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
            <Text className="text-red-400 text-sm text-center font-medium">{errorText}</Text>
          </View>
        )}

        {/* Login Button */}
        <Button
          onPress={handleLogin}
          loading={loginMutation.isPending}
          disabled={!email || !password || loginMutation.isPending}
          className="mb-8 rounded-full h-14"
          size="md"

        >
          Sign In
        </Button>

        {/* Sign Up Link */}
        <View className="flex-row justify-center items-center mb-10">
          <Text className="text-primary-800/50 text-sm">Don't have an account? </Text>
          <Button
            onPress={() => router.push("/signup")}
            variant="ghost"
            size="sm"
            textClassName="text-primary-900 font-bold text-sm"
          >
            Sign up
          </Button>
        </View>

      </View>


    </ScrollView>
  );
}

import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Text } from "../ui/Text";
import { useLogin } from "../../lib/hooks/useAuth";

interface LoginFormStepProps {
  onBack: () => void;
}

export function LoginFormStep({ onBack }: LoginFormStepProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState("");
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
        onSuccess: (data) => {
          if (data.user.shopId) {
            router.replace("/(tabs)");
          } else {
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
    Alert.alert("Coming Soon", "Google login will be available soon");
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-center px-6" style={{ width: "100%" }}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={onBack}
          className="self-start mb-6 -mt-4"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <ArrowLeft size={20} color="#F5E6D3" />
            <Text className="text-primary-200 text-sm ml-2">Back</Text>
          </View>
        </TouchableOpacity>

        <View className="mb-8">
          <Text className="text-3xl font-bold text-white text-center mb-2">
            Get Started
          </Text>
          <Text className="text-base text-primary-100 text-center">
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
            className="bg-white/5 border border-white/10 rounded-full h-14 px-6 text-white"
            placeholderTextColor="rgba(245, 230, 211, 0.5)"
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
              className="bg-white/5 border border-white/10 rounded-full h-14 pr-14 px-6 text-white"
              placeholderTextColor="rgba(245, 230, 211, 0.5)"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-0 bottom-0 justify-center"
              activeOpacity={0.7}
            >
              {showPassword ? (
                <EyeOff size={20} color="rgba(245, 230, 211, 0.5)" />
              ) : (
                <Eye size={20} color="rgba(245, 230, 211, 0.5)" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity className="self-end mb-8">
          <Text className="text-primary-200/70 text-sm font-medium">Forgot password?</Text>
        </TouchableOpacity>

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

        {/* Divider */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-[1px] bg-white/10" />
          <Text className="mx-4 text-white/20 text-xs font-bold uppercase tracking-widest">or</Text>
          <View className="flex-1 h-[1px] bg-white/10" />
        </View>

        {/* Google Login Button */}
        <TouchableOpacity
          onPress={handleGoogleLogin}
          disabled={loginMutation.isPending}
          className="flex-row items-center justify-center bg-white/5 border border-white/10 rounded-full h-14 px-4 mb-8"
          style={{ 
            opacity: loginMutation.isPending ? 0.6 : 1,
          }}
          activeOpacity={0.7}
        >
          <Text className="text-white font-bold text-sm">
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View className="flex-row justify-center items-center mb-10">
        <Text className="text-primary-200/50 text-sm">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/signup")} activeOpacity={0.7}>
          <Text className="text-white font-bold text-sm">Sign up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Text } from "../components/ui/Text";
import { useBuyerLogin } from "../lib/hooks/auth/useBuyerLogin";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { logInWithEmailAndPassword, loginWithGoogle, loading, errorText } = useBuyerLogin();

  const handleLogin = async () => {
    console.log('[LOGIN_SCREEN] Login button clicked');
    
    // Simple validation
    if (!email || !password) {
      console.log('[LOGIN_SCREEN] ❌ Validation failed - missing email or password');
      Alert.alert("Validation Error", "Please enter both email and password");
      return;
    }

    console.log('[LOGIN_SCREEN] ✅ Validation passed, calling logInWithEmailAndPassword...');
    try {
      await logInWithEmailAndPassword({
        email,
        password,
        options: {
          redirect: true,
        },
      });
      console.log('[LOGIN_SCREEN] ✅ logInWithEmailAndPassword completed successfully');
      // Navigation is handled by useTokenManager
    } catch (error: any) {
      // Error is already handled by the hook and displayed via errorText
      // Log full error details for debugging
      console.error('[LOGIN_SCREEN] ❌ Login screen error:', {
        error,
        name: error?.name,
        message: error?.message,
        underlyingError: error?.underlyingError,
        cause: error?.cause,
        __type: error?.__type,
        recoverySuggestion: error?.recoverySuggestion,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
      });
    }
  };

  const handleGoogleLogin = async () => {
    console.log('[LOGIN_SCREEN] Google login button clicked');
    try {
      await loginWithGoogle({
        redirect: true,
      });
    } catch (error: any) {
      // Don't log cancellation as an error
      if (error?.name === 'OAuthSignInException' && error?.message === 'canceled') {
        console.log('[LOGIN_SCREEN] Google login canceled by user');
        return; // Silently return - cancellation is not an error
      }
      console.error('[LOGIN_SCREEN] ❌ Google login error:', error);
      // Error is handled by the hook
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="flex-1 justify-center px-8 py-12">
            {/* Header */}
            <View className="mb-10">
              <Text className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back
              </Text>
              <Text className="text-base text-gray-600">
                Sign in to your account
              </Text>
            </View>

            {/* Form */}
            <View className="mb-6">
              <View className="mb-5">
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
              <TouchableOpacity className="self-end mb-6">
                <Text className="text-primary text-sm font-medium">Forgot password?</Text>
              </TouchableOpacity>

              {/* Error Message */}
              {errorText && (
                <View className="mb-4 p-4 bg-red-50 rounded-xl border border-red-100">
                  <Text className="text-red-600 text-sm text-center">{errorText}</Text>
                </View>
              )}

              {/* Login Button */}
              <Button
                onPress={handleLogin}
                loading={loading}
                disabled={!email || !password || loading}
                className="mb-6"
                size="lg"
              >
                Sign In
              </Button>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="mx-4 text-gray-400 text-sm">or</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Google Login Button */}
              <TouchableOpacity
                onPress={handleGoogleLogin}
                disabled={loading}
                className="flex-row items-center justify-center bg-white border-2 border-gray-200 rounded-2xl py-4 px-4 mb-6"
                style={{ 
                  opacity: loading ? 0.6 : 1,
                }}
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 font-semibold text-base">
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600 text-base">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/signup")} activeOpacity={0.7}>
                <Text className="text-primary font-semibold text-base">Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

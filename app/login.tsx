import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Text } from "../components/ui/Text";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Simple validation
    if (!email || !password) {
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Navigate to home screen
    router.replace("/(tabs)");
    
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary" edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 0 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Green Section */}
          <View className="bg-primary pt-12 pb-20 px-6 justify-center">
            <View>
              {/* Welcome Text */}
              <Text className="text-white text-2xl font-bold mb-2 text-left">
                Welcome Back!
              </Text>
              <Text className="text-white opacity-90 text-sm text-left">
                Sign in to continue your livestock journey
              </Text>
            </View>
          </View>

          {/* Form Section - White with rounded top right */}
          <View className="flex-1 bg-white px-6 justify-center" style={{ borderTopRightRadius: 40 }}>
            <View className="bg-transparent p-6">
              {/* Form */}
              <View className="mb-6">
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Mail size={18} color="#0e7a3c" />
                    <Text className="text-sm font-medium text-gray-700 ml-2">Email</Text>
                  </View>
                  <Input
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View>
                  <View className="flex-row items-center mb-2">
                    <Lock size={18} color="#0e7a3c" />
                    <Text className="text-sm font-medium text-gray-700 ml-2">Password</Text>
                  </View>
                  <Input
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Login Button */}
              <Button
                onPress={handleLogin}
                loading={loading}
                disabled={!email || !password}
                className="mb-4"
                size="lg"
              >
                Sign In
              </Button>

              {/* Forgot Password */}
              <TouchableOpacity className="self-center mb-6">
                <Text className="text-primary font-medium text-sm">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center mb-8 pb-8">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text className="text-primary font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


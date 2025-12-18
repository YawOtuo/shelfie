import { useRouter } from "expo-router";
import { User, Mail, Lock } from "lucide-react-native";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Text } from "../components/ui/Text";
import { useBuyerSignup } from "../lib/hooks/auth/useBuyerSignup";

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { registerWithEmailAndPassword, loading, errorText } = useBuyerSignup();

  const handleSignUp = async () => {
    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Validation Error", "Password must be at least 8 characters long");
      return;
    }

    try {
      await registerWithEmailAndPassword({
        email,
        password,
        username: name,
        options: {
          redirect: true,
        },
      });
      // Navigation is handled by useTokenManager
    } catch (error: any) {
      // Error is already handled by the hook and displayed via errorText
      // You can add additional error handling here if needed
      console.error("Signup error:", error);
    }
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
                Join Livestockly
              </Text>
              <Text className="text-white opacity-90 text-sm text-left">
                Create your account and start trading
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
                    <User size={18} color="#0e7a3c" />
                    <Text className="text-sm font-medium text-gray-700 ml-2">Full Name</Text>
                  </View>
                  <Input
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>

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

                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Lock size={18} color="#0e7a3c" />
                    <Text className="text-sm font-medium text-gray-700 ml-2">Password</Text>
                  </View>
                  <Input
                    placeholder="Create a password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <View>
                  <View className="flex-row items-center mb-2">
                    <Lock size={18} color="#0e7a3c" />
                    <Text className="text-sm font-medium text-gray-700 ml-2">Confirm Password</Text>
                  </View>
                  <Input
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Error Message */}
              {errorText && (
                <View className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Text className="text-red-600 text-sm text-center">{errorText}</Text>
                </View>
              )}

              {/* Sign Up Button */}
              <Button
                onPress={handleSignUp}
                loading={loading}
                disabled={!name || !email || !password || !confirmPassword || password !== confirmPassword || loading}
                className="mb-4"
                size="lg"
              >
                Create Account
              </Button>
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center items-center mb-8 pb-8">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="text-primary font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


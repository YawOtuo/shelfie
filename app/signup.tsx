import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Check, X } from "lucide-react-native";
import { useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { PasswordInput } from "../components/ui/PasswordInput";
import { Text } from "../components/ui/Text";
import { useRegister } from "../lib/hooks/useAuth";

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const registerMutation = useRegister();
  const scrollViewRef = useRef<ScrollView>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

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

    setErrorText("");
    registerMutation.mutate(
      { username: name, email, password },
      {
        onSuccess: (data) => {
          // New users don't have shopId, so navigate to shop selection
          router.replace("/select-shop");
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "An error occurred during signup";
          setErrorText(errorMessage);
        },
      }
    );
  };

  return (
    <View className="flex-1 bg-primary-900">
      <StatusBar style="light" />
      
      <SafeAreaView className="flex-1" edges={["left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              // Scroll to bottom when content size changes (keyboard appears)
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }}
          >
            <View className="justify-center px-6 mt-20" style={{ width: "100%" }}>
              {/* Back Button */}
              <Button
                onPress={() => router.back()}
                variant="ghost"
                size="sm"
                className="self-start mb-6 -mt-4"
              >
                <View className="flex-row items-center">
                  <ArrowLeft size={20} color="#E0D1BC" />
                  <Text className="text-primary-200 text-sm ml-2">Back</Text>
                </View>
              </Button>

              <View className="mb-8">
                <Text className="text-3xl font-bold text-white text-center mb-2">
                  Join Shelfie
                </Text>
                <Text className="text-base text-primary-100 text-center">
                  Create your account and start trading
                </Text>
              </View>

              {/* Form */}
              <View className="mb-6">
                <View className="mb-4">
                  <Input
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    size="md"
                    className="bg-white/5 border border-white/10 rounded-full h-14 px-6 text-white"
                    placeholderTextColor="rgba(224, 209, 188, 0.5)"
                  />
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
                    placeholderTextColor="rgba(224, 209, 188, 0.5)"
                  />
                </View>

                <View className="mb-2">
                  <PasswordInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    size="md"
                    className="bg-white/5 border border-white/10 rounded-full h-14 px-6 text-white pr-14"
                    placeholderTextColor="rgba(224, 209, 188, 0.5)"
                  />
                  {password.length > 0 && (
                    <View className="mt-2 flex-row items-center">
                      {password.length >= 8 ? (
                        <Check size={14} color="#10B981" />
                      ) : (
                        <X size={14} color="#EF4444" />
                      )}
                      <Text
                        className={`text-xs ml-1 ${
                          password.length >= 8 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        At least 8 characters
                      </Text>
                    </View>
                  )}
                </View>

                <View className="mb-2">
                  <PasswordInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                    inputRef={confirmPasswordInputRef}
                    onFocus={() => {
                      // Scroll to show the input when focused
                      setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                      }, 300);
                    }}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    size="md"
                    className={`bg-white/5 border rounded-full h-14 px-6 text-white pr-14 ${
                      confirmPassword.length > 0
                        ? password === confirmPassword
                          ? "border-green-500/50"
                          : "border-red-500/50"
                        : "border-white/10"
                    }`}
                    placeholderTextColor="rgba(224, 209, 188, 0.5)"
                  />
                  {confirmPassword.length > 0 && (
                    <View className="mt-2 flex-row items-center">
                      {password === confirmPassword ? (
                        <>
                          <Check size={14} color="#10B981" />
                          <Text className="text-xs ml-1 text-green-400">
                            Passwords match
                          </Text>
                        </>
                      ) : (
                        <>
                          <X size={14} color="#EF4444" />
                          <Text className="text-xs ml-1 text-red-400">
                            Passwords do not match
                          </Text>
                        </>
                      )}
                    </View>
                  )}
                </View>
              </View>

              {/* Error Message */}
              {errorText && (
                <View className="mb-6 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                  <Text className="text-red-400 text-sm text-center font-medium">{errorText}</Text>
                </View>
              )}

              {/* Sign Up Button */}
              <Button
                onPress={handleSignUp}
                loading={registerMutation.isPending}
                disabled={
                  !name.trim() || 
                  !email.trim() || 
                  !password || 
                  !confirmPassword || 
                  password !== confirmPassword || 
                  password.length < 8 ||
                  registerMutation.isPending
                }
                className="mb-8 rounded-full h-14"
                size="md"
              >
                Create Account
              </Button>

              {/* Login Link */}
              <View className="flex-row justify-center items-center mb-10">
                <Text className="text-primary-200/50 text-sm">Already have an account? </Text>
                <Button
                  onPress={() => router.push("/login")}
                  variant="ghost"
                  size="sm"
                  textClassName="text-white font-bold text-sm"
                >
                  Sign In
                </Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}


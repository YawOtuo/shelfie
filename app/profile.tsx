import { useRouter } from "expo-router";
import { LogOut, Mail, Phone, User as UserIcon, Edit2, ChevronRight } from "lucide-react-native";
import { ScrollView, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { Card } from "../components/ui/Card";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuthStore } from "../lib/stores/authStore";
import { useLogout } from "../lib/hooks/useAuth";
import { colors } from "../lib/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logoutMutation.mutate();
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={["left", "right"]}>
        <Header showBack={true} />
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" />
          <Text className="text-gray-600 mt-4">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={["left", "right"]}>
      <Header showBack={true} />
      <ScrollView
        className="flex-1 bg-white"
        style={{ backgroundColor: '#FFFFFF' }}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5">
          {/* User Profile Header */}
          <View className="mb-6">
            <Card className="p-5" style={{ backgroundColor: colors.primary[100] }}>
              <View className="flex-row items-start mb-5">
                <View className="w-24 h-24 rounded-full bg-primary items-center justify-center shadow-sm" style={{ shadowColor: colors.primary.DEFAULT, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }}>
                  <UserIcon color={colors.white} size={40} />
                </View>
                <View className="flex-1 ml-4 pt-2">
                  <Text className="text-2xl text-gray-900 mb-1" variant="bold">
                    {user.username || "User"}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-3">
                    {user.email || "No email"}
                  </Text>
                  <Button
                    onPress={() => {
                      // TODO: Navigate to edit profile
                      Alert.alert("Edit Profile", "Coming soon");
                    }}
                    variant="outline"
                    size="sm"
                    className="border-primary"
                  >
                    <View className="flex-row items-center">
                      <Edit2 color={colors.primary.DEFAULT} size={14} style={{ marginRight: 6 }} />
                      <Text className="text-primary" variant="medium" style={{ fontSize: 13 }}>
                        Edit Profile
                      </Text>
                    </View>
                  </Button>
                </View>
              </View>

              {/* Contact Information */}
              <View className="pt-4 border-t border-primary/20">
                <Text className="text-xs font-semibold text-gray-500 mb-3 uppercase" variant="semibold">
                  Contact Information
                </Text>
                <View style={{ gap: 12 }}>
                  {user.email && (
                    <View className="flex-row items-center py-2">
                      <View className="w-9 h-9 rounded-lg bg-primary/10 items-center justify-center mr-3">
                        <Mail color={colors.primary.DEFAULT} size={18} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-0.5" variant="medium">
                          Email
                        </Text>
                        <Text className="text-sm text-gray-900">
                          {user.email}
                        </Text>
                      </View>
                    </View>
                  )}
                  {user.phoneNumber && (
                    <View className="flex-row items-center py-2">
                      <View className="w-9 h-9 rounded-lg bg-primary/10 items-center justify-center mr-3">
                        <Phone color={colors.primary.DEFAULT} size={18} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-0.5" variant="medium">
                          Phone
                        </Text>
                        <Text className="text-sm text-gray-900">
                          {user.phoneNumber}
                        </Text>
                      </View>
                    </View>
                  )}
                  {!user.email && !user.phoneNumber && (
                    <View className="py-3">
                      <Text className="text-sm text-gray-500 text-center italic">
                        No contact information available
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>
          </View>

          {/* Logout Section */}
          <View className="mb-6">
            <Card padding="none" className="p-1">
              <TouchableOpacity
                onPress={handleLogout}
                activeOpacity={0.7}
                className="flex-row items-center py-3 px-4"
              >
                <View className="w-10 h-10 rounded-lg bg-red-100 items-center justify-center mr-3">
                  <LogOut color={colors.red[500]} size={20} />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-red-600" variant="medium">
                    Logout
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    Sign out of your account
                  </Text>
                </View>
                <ChevronRight color={colors.gray[400]} size={20} />
              </TouchableOpacity>
            </Card>
          </View>

          {/* App Version */}
          <View className="items-center mt-4">
            <Text className="text-gray-400 text-xs">Shelfie v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { useRouter } from "expo-router";
import {
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Bell,
  Building2,
  ChevronRight,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  Moon,
  Shield,
  User,
  UserCircle,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Header } from "../../components/Header";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useLogout } from "../../lib/hooks/useAuth";
import { useAuthStore } from "../../lib/stores/authStore";

interface SettingItemProps {
  icon: React.ComponentType<{ color?: string; size?: number }>;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showChevron?: boolean;
}

function SettingItem({
  icon: Icon,
  title,
  subtitle,
  onPress,
  rightComponent,
  showChevron = true,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center py-3"
      disabled={!onPress}
    >
      <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center mr-3">
        <Icon color="#0e7a3c" size={20} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
      {rightComponent}
      {showChevron && onPress && (
        <View className="ml-2">
          <ChevronRight color="#9CA3AF" size={20} />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const logoutMutation = useLogout();
  const { user } = useAuthStore();

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


  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["left", "right"]}
    >
      <Header />
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* User Profile Section */}
        <View className="px-5 pt-6 pb-4">
          <Card className="p-4">
            <View className="flex-row items-center">
              <View className="w-16 h-16 rounded-full bg-primary items-center justify-center mr-4">
                <UserCircle color="#FFFFFF" size={32} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {user?.username || "User"}
                </Text>
                <Text className="text-sm text-gray-600">{user?.email || "No email"}</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/profile")}
                activeOpacity={0.7}
              >
                <ChevronRight color="#9CA3AF" size={20} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Account Settings */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase">
            Account
          </Text>
          <Card variant="outline" padding="none" className="p-1">
            <SettingItem
              icon={User}
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => router.push("/profile")}
            />
            <View className="h-px bg-gray-100 mx-4" />
            <SettingItem
              icon={Building2}
              title="Create Shop"
              subtitle="Create a new shop to manage inventory"
              onPress={() => router.push("/create-shop")}
            />
            <View className="h-px bg-gray-100 mx-4" />
            <SettingItem
              icon={Mail}
              title="Email Settings"
              subtitle="Manage email preferences"
              onPress={() => {
                // TODO: Navigate to email settings
                Alert.alert("Email Settings", "Coming soon");
              }}
            />
          </Card>
        </View>

        {/* Notifications */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase">
            Notifications
          </Text>
          <Card variant="outline" padding="none" className="p-1">
            <View className="flex-row items-center py-3 px-4">
              <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center mr-3">
                <Bell color="#0e7a3c" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Push Notifications
                </Text>
                <Text className="text-sm text-gray-500 mt-0.5">
                  Receive notifications on your device
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#E5E7EB", true: "#0e7a3c" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Card>
        </View>

        {/* Privacy & Security */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase">
            Privacy & Security
          </Text>
          <Card variant="outline" padding="none" className="p-1">
            <SettingItem
              icon={Lock}
              title="Change Password"
              subtitle="Update your account password"
              onPress={() => {
                // TODO: Navigate to change password
                Alert.alert("Change Password", "Coming soon");
              }}
            />
            <View className="h-px bg-gray-100 mx-4" />
            <SettingItem
              icon={Shield}
              title="Privacy Policy"
              onPress={() => {
                // TODO: Navigate to privacy policy
                Alert.alert("Privacy Policy", "Coming soon");
              }}
            />
            <View className="h-px bg-gray-100 mx-4" />
            <SettingItem
              icon={Shield}
              title="Terms of Service"
              onPress={() => {
                // TODO: Navigate to terms of service
                Alert.alert("Terms of Service", "Coming soon");
              }}
            />
          </Card>
        </View>

        {/* App Preferences */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase">
            Preferences
          </Text>
          <Card variant="outline" padding="none" className="p-1">
            <View className="flex-row items-center py-3 px-4">
              <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center mr-3">
                <Moon color="#0e7a3c" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Dark Mode
                </Text>
                <Text className="text-sm text-gray-500 mt-0.5">
                  Switch to dark theme
                </Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: "#E5E7EB", true: "#0e7a3c" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Card>
        </View>

        {/* Help & Support */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase">
            Help & Support
          </Text>
          <Card variant="outline" padding="none" className="p-1">
            <SettingItem
              icon={HelpCircle}
              title="Help Center"
              subtitle="Get help and support"
              onPress={() => {
                // TODO: Navigate to help center
                Alert.alert("Help Center", "Coming soon");
              }}
            />
            <View className="h-px bg-gray-100 mx-4" />
            <SettingItem
              icon={Mail}
              title="Contact Support"
              subtitle="Reach out to our team"
              onPress={() => {
                // TODO: Navigate to contact support
                Alert.alert("Contact Support", "Coming soon");
              }}
            />
          </Card>
        </View>

        {/* Logout Button */}
        <View className="px-5 mb-4">
          <Button
            onPress={handleLogout}
            variant="outline"
            size="lg"
            className="border-red-200"
          >
            <View className="flex-row items-center">
              <View className="mr-2">
                <LogOut color="#EF4444" size={20} />
              </View>
              <Text className="text-red-600 font-semibold">Logout</Text>
            </View>
          </Button>
        </View>

        {/* App Version */}
        <View className="items-center pb-6">
          <Text className="text-gray-400 text-xs">Shelfie v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


import { StatusBar } from "expo-status-bar";
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
  MapPin,
  Phone,
  Globe,
  FileText,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Header } from "../../components/Header";
import { SwipeableTabWrapper } from "../../components/SwipeableTabWrapper";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useLogout } from "../../lib/hooks/useAuth";
import { useAuthStore } from "../../lib/stores/authStore";
import { useCurrentUserShop } from "../../lib/hooks/useShops";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { colors } from "../../lib/colors";

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
        <Icon color={colors.primary.DEFAULT} size={20} />
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
          <ChevronRight color={colors.gray[400]} size={20} />
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
  const { data: shop, isLoading: shopLoading } = useCurrentUserShop(!!user?.shopId);

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
    <SwipeableTabWrapper tabIndex={2}>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["left", "right"]}
      >
        <StatusBar style="dark" />
        <Header />
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* User Profile Section */}
        <View className="px-5 pt-6 pb-4">
          <Card className="p-5" style={{ backgroundColor: colors.primary[100] }}>
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              activeOpacity={0.7}
            >
              <View className="flex-row items-start mb-4">
                <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mr-4 shadow-sm" style={{ shadowColor: colors.primary.DEFAULT, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }}>
                  <UserCircle color={colors.white} size={36} />
                </View>
                <View className="flex-1 pt-1">
                  <Text className="text-xl text-gray-900 mb-1.5" variant="bold">
                    {user?.username || "User"}
                  </Text>
                  <View className="mb-2">
                    {user?.email && (
                      <View className="flex-row items-center mb-1.5">
                        <Mail color={colors.gray[500]} size={14} />
                        <Text className="text-sm text-gray-700 ml-2 flex-1">
                          {user.email}
                        </Text>
                      </View>
                    )}
                    {user?.phoneNumber && (
                      <View className="flex-row items-center">
                        <Phone color={colors.gray[500]} size={14} />
                        <Text className="text-sm text-gray-700 ml-2 flex-1">
                          {user.phoneNumber}
                        </Text>
                      </View>
                    )}
                    {!user?.email && !user?.phoneNumber && (
                      <Text className="text-sm text-gray-500 italic">
                        No contact information
                      </Text>
                    )}
                  </View>
                </View>
                <View className="pt-1">
                  <ChevronRight color={colors.gray[400]} size={22} />
                </View>
              </View>
              <View className="flex-row items-center justify-end pt-2 border-t border-primary/20">
                <Text className="text-xs text-gray-600 mr-1">View Profile</Text>
                <ChevronRight color={colors.gray[500]} size={16} />
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Shop Details Section */}
        <View className="px-5 mb-4">
          <Text className="text-xs font-semibold text-gray-500 mb-3 uppercase" variant="semibold">
            Shops
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/shops")}
            activeOpacity={0.7}
          >
            <Card className="p-4" style={{ backgroundColor: colors.primary[100] }}>
              {shopLoading ? (
                <View className="py-4">
                  <LoadingSpinner />
                </View>
              ) : shop ? (
                <>
                  <View className="flex-row items-center mb-3">
                    <View className="w-14 h-14 rounded-full bg-primary items-center justify-center mr-4 shadow-sm" style={{ shadowColor: colors.primary.DEFAULT, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 }}>
                      <Building2 color={colors.white} size={28} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg text-gray-900 mb-1" variant="bold">
                        {shop.name || "Unnamed Shop"}
                      </Text>
                      {shop.description && (
                        <Text className="text-sm text-gray-600 mb-2">
                          {shop.description}
                        </Text>
                      )}
                      <View className="flex-row items-center">
                        <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary[200] }}>
                          <Text className="text-xs text-primary" variant="medium">
                            Current Shop
                          </Text>
                        </View>
                      </View>
                    </View>
                    <ChevronRight color={colors.gray[400]} size={22} />
                  </View>

                  {/* Quick Info */}
                  <View className="pt-3 border-t border-primary/20">
                    <View style={{ gap: 8 }}>
                      {shop.address && (
                        <View className="flex-row items-center">
                          <MapPin color={colors.primary.DEFAULT} size={14} />
                          <Text className="text-xs text-gray-700 ml-2 flex-1" numberOfLines={1}>
                            {shop.address}
                          </Text>
                        </View>
                      )}
                      {shop.phone && (
                        <View className="flex-row items-center">
                          <Phone color={colors.primary.DEFAULT} size={14} />
                          <Text className="text-xs text-gray-700 ml-2 flex-1">
                            {shop.phone}
                          </Text>
                        </View>
                      )}
                      {shop.email && (
                        <View className="flex-row items-center">
                          <Mail color={colors.primary.DEFAULT} size={14} />
                          <Text className="text-xs text-gray-700 ml-2 flex-1" numberOfLines={1}>
                            {shop.email}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View className="flex-row items-center justify-end pt-3 border-t border-primary/20 mt-3">
                    <Text className="text-xs text-gray-600 mr-1">View All Shops</Text>
                    <ChevronRight color={colors.gray[500]} size={16} />
                  </View>
                </>
              ) : (
                <View className="flex-row items-center">
                  <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center mr-4">
                    <Building2 color={colors.primary.DEFAULT} size={28} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base text-gray-900 mb-1" variant="medium">
                      No shop connected
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Tap to view and manage shops
                    </Text>
                  </View>
                  <ChevronRight color={colors.gray[400]} size={22} />
                </View>
              )}
            </Card>
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase">
            Account
          </Text>
          <Card padding="none" className="p-1">
            <SettingItem
              icon={User}
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => router.push("/profile")}
            />
            <View className="h-px bg-gray-100 mx-4" />
            {!user?.shopId && (
              <>
                <SettingItem
                  icon={Building2}
                  title="Create Shop"
                  subtitle="Create a new shop to manage inventory"
                  onPress={() => router.push("/create-shop")}
                />
                <View className="h-px bg-gray-100 mx-4" />
              </>
            )}
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
          <Card padding="none" className="p-1">
            <View className="flex-row items-center py-3 px-4">
              <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center mr-3">
                <Bell color={colors.primary.DEFAULT} size={20} />
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
                trackColor={{ false: colors.gray[200], true: colors.primary.DEFAULT }}
                thumbColor={colors.white}
              />
            </View>
          </Card>
        </View>

        {/* Privacy & Security */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase">
            Privacy & Security
          </Text>
          <Card padding="none" className="p-1">
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
          <Card padding="none" className="p-1">
            <View className="flex-row items-center py-3 px-4">
              <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center mr-3">
                <Moon color={colors.primary.DEFAULT} size={20} />
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
                trackColor={{ false: colors.gray[200], true: colors.primary.DEFAULT }}
                thumbColor={colors.white}
              />
            </View>
          </Card>
        </View>

        {/* Help & Support */}
        <View className="px-5 mb-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 uppercase">
            Help & Support
          </Text>
          <Card padding="none" className="p-1">
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
            className="border-0"
          >
            <View className="flex-row items-center">
              <View className="mr-2">
                <LogOut color={colors.red[500]} size={20} />
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
    </SwipeableTabWrapper>
  );
}


import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Bell,
  Building2,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  Shield,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components/Header";
import {
  AppVersionFooter,
  SectionHeader,
  SettingItem,
  SettingsSection,
  ShopCard,
  SwitchSettingItem,
  UserProfileCard,
} from "../../components/settings";
import { SwipeableTabWrapper } from "../../components/SwipeableTabWrapper";
import { Card } from "../../components/ui/Card";
import { useToast } from "../../components/ui/ToastProvider";
import { colors } from "../../lib/colors";
import { useLogout } from "../../lib/hooks/useAuth";
import { useCurrentUserShop } from "../../lib/hooks/useShops";
import { useAuthStore } from "../../lib/stores/authStore";

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const logoutMutation = useLogout();
  const { user } = useAuthStore();
  const { data: shop } = useCurrentUserShop(!!user?.shopId);
  const { showInfo } = useToast();

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
        className="flex-1"
        edges={["left", "right"]}
        style={{ backgroundColor: colors.white }}
      >
        <StatusBar style="dark" />
        <Header />
        <ScrollView
          className="flex-1"
          style={{ backgroundColor: colors.white }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* User Profile Header */}
          <View className="px-5 pt-4 pb-2">
            <UserProfileCard
              username={user?.username}
              email={user?.email}
              phoneNumber={user?.phoneNumber}
              onPress={() => router.push("/profile")}
            />
          </View>

          {/* Current Shop Card */}
          {shop && (
            <View className="px-5 pb-2">
              <ShopCard
                shop={shop}
                onPress={() => router.push("/shops")}
              />
            </View>
          )}

          {/* Account Section */}
          <SectionHeader title="Account" icon={User} />
          <SettingsSection>
            <SettingItem
              icon={User}
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => router.push("/profile")}
            />
            <View className="h-px" style={{ backgroundColor: colors.gray[100] }} />
            {!user?.shopId && (
              <>
                <SettingItem
                  icon={Building2}
                  title="Create Shop"
                  subtitle="Set up your shop and start selling"
                  onPress={() => router.push("/create-shop")}
                />
                <View className="h-px" style={{ backgroundColor: colors.gray[100] }} />
              </>
            )}
            <SettingItem
              icon={Mail}
              title="Email Preferences"
              subtitle="Manage your email settings"
              onPress={() => {
                showInfo("Email preferences coming soon");
              }}
            />
          </SettingsSection>

          {/* Notifications Section */}
          <SectionHeader title="Notifications" icon={Bell} />
          <View className="px-5 mb-2">
            <Card 
              padding="none"
              style={{
                backgroundColor: colors.white,
              }}
            >
              <SwitchSettingItem
                icon={Bell}
                title="Push Notifications"
                subtitle="Get updates on your device"
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </Card>
          </View>

          {/* Security Section */}
          <SectionHeader title="Security & Privacy" icon={Shield} />
          <SettingsSection>
            <SettingItem
              icon={Lock}
              title="Change Password"
              subtitle="Update your account security"
              onPress={() => {
                showInfo("Change password feature coming soon");
              }}
            />
            <View className="h-px" style={{ backgroundColor: colors.gray[100] }} />
            <SettingItem
              icon={Shield}
              title="Privacy Policy"
              subtitle="Read our privacy terms"
              onPress={() => {
                showInfo("Privacy policy coming soon");
              }}
            />
            <View className="h-px" style={{ backgroundColor: colors.gray[100] }} />
            <SettingItem
              icon={Shield}
              title="Terms of Service"
              subtitle="Review our terms"
              onPress={() => {
                showInfo("Terms of service coming soon");
              }}
            />
          </SettingsSection>

          {/* Support Section */}
          <SectionHeader title="Support" icon={HelpCircle} />
          <SettingsSection>
            <SettingItem
              icon={HelpCircle}
              title="Help Center"
              subtitle="Browse FAQs and guides"
              onPress={() => {
                showInfo("Help center coming soon");
              }}
            />
            <View className="h-px" style={{ backgroundColor: colors.gray[100] }} />
            <SettingItem
              icon={Mail}
              title="Contact Support"
              subtitle="Get in touch with our team"
              onPress={() => {
                showInfo("Contact support coming soon");
              }}
            />
          </SettingsSection>

          {/* Logout Section */}
          <View className="px-5 mt-4 mb-2">
            <Card 
              padding="none"
              style={{
                backgroundColor: colors.white,
                overflow: "hidden",
              }}
            >
              <SettingItem
                icon={LogOut}
                title="Logout"
                subtitle="Sign out of your account"
                onPress={handleLogout}
                showChevron={false}
                variant="danger"
              />
            </Card>
          </View>

          {/* App Version Footer */}
          <AppVersionFooter />
        </ScrollView>
      </SafeAreaView>
    </SwipeableTabWrapper>
  );
}


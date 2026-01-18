import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Phone, User as UserIcon, Edit2, LogOut } from "lucide-react-native";
import { Header } from "../components/Header";
import { Card } from "../components/ui/Card";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useToast } from "../components/ui/ToastProvider";
import { SettingItem } from "../components/settings/SettingItem";
import { SectionHeader } from "../components/settings/SectionHeader";
import { SettingsSection } from "../components/settings/SettingsSection";
import { useAuthStore } from "../lib/stores/authStore";
import { useLogout } from "../lib/hooks/useAuth";
import { colors } from "../lib/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
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

  if (!user) {
    return (
      <SafeAreaView 
        className="flex-1" 
        style={{ backgroundColor: colors.white }} 
        edges={["left", "right"]}
      >
        <StatusBar style="dark" />
        <Header showBack={true} />
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" />
          <Text className="text-gray-600 mt-4 text-xs">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      className="flex-1" 
      style={{ backgroundColor: colors.white }} 
      edges={["left", "right"]}
    >
      <StatusBar style="dark" />
      <Header showBack={true} />
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.white }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <View className="px-5 pt-4 pb-2">
          <Card
            className="overflow-hidden"
            style={{
              backgroundColor: colors.white,
              ...Platform.select({
                ios: {
                  shadowColor: colors.gray[400],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 2,
                },
              }),
            }}
          >
            <View 
              className="absolute top-0 left-0 right-0 h-20"
              style={{ 
                backgroundColor: colors.primary[500],
                opacity: 0.08,
              }} 
            />
            <View className="p-5">
              <View className="flex-row items-center mb-4">
                <View 
                  className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                  style={{
                    backgroundColor: colors.primary.DEFAULT,
                    ...Platform.select({
                      ios: {
                        shadowColor: colors.primary.DEFAULT,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                      },
                      android: {
                        elevation: 4,
                      },
                    }),
                  }}
                >
                  <Text className="text-white text-xl" variant="bold">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg text-gray-900 mb-1" variant="bold">
                    {user.username || "User"}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {user.email || user.phoneNumber || "No contact info"}
                  </Text>
                </View>
              </View>
              
              <Button
                onPress={() => {
                  showInfo("Edit profile feature coming soon");
                }}
                variant="outline"
                size="sm"
                className="border-primary"
              >
                <View className="flex-row items-center">
                  <Edit2 color={colors.primary.DEFAULT} size={14} style={{ marginRight: 6 }} />
                  <Text className="text-primary text-xs" variant="medium">
                    Edit Profile
                  </Text>
                </View>
              </Button>
            </View>
          </Card>
        </View>

        {/* Contact Information Section */}
        <SectionHeader title="Contact Information" icon={Mail} />
        <SettingsSection>
          {user.email && (
            <>
              <View className="flex-row items-center py-3 px-4">
                <View 
                  className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: colors.primary[100] }}
                >
                  <Mail color={colors.primary.DEFAULT} size={18} />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] text-gray-500 mb-0.5" variant="medium">
                    Email
                  </Text>
                  <Text className="text-sm text-gray-900">
                    {user.email}
                  </Text>
                </View>
              </View>
              <View className="h-px" style={{ backgroundColor: colors.gray[100] }} />
            </>
          )}
          {user.phoneNumber && (
            <>
              <View className="flex-row items-center py-3 px-4">
                <View 
                  className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: colors.primary[100] }}
                >
                  <Phone color={colors.primary.DEFAULT} size={18} />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] text-gray-500 mb-0.5" variant="medium">
                    Phone
                  </Text>
                  <Text className="text-sm text-gray-900">
                    {user.phoneNumber}
                  </Text>
                </View>
              </View>
              {user.email && (
                <View className="h-px" style={{ backgroundColor: colors.gray[100] }} />
              )}
            </>
          )}
          {!user.email && !user.phoneNumber && (
            <View className="py-4 px-4">
              <Text className="text-xs text-gray-500 text-center">
                No contact information available
              </Text>
            </View>
          )}
        </SettingsSection>

        {/* Account Actions */}
        <SectionHeader title="Account" icon={UserIcon} />
        <SettingsSection>
          <SettingItem
            icon={UserIcon}
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => {
              showInfo("Edit profile feature coming soon");
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
      </ScrollView>
    </SafeAreaView>
  );
}

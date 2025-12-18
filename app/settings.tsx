import { ScrollView, TouchableOpacity, View, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import {
  Bell,
  Shield,
  Globe,
  Moon,
  Palette,
  Smartphone,
  Mail,
  Lock,
  Trash2,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Edit,
} from "lucide-react-native";
import { Text } from "../components/ui/Text";
import { Card } from "../components/ui/Card";
import { DetailHeader } from "../components/DetailHeader";
import { Button } from "../components/ui/Button";
import { useGetCurrentUser } from "../lib/hooks/useGetCurrentUser";
import { LoadingScreen } from "../components/LoadingScreen";

interface SettingItem {
  icon: React.ComponentType<{ color: string; size: number }>;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightComponent?: React.ReactNode;
}

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  // Get actual user data
  const { user, loading: userLoading } = useGetCurrentUser();

  // Show loading screen while user data is loading
  if (userLoading) {
    return <LoadingScreen />;
  }

  const handleEditContact = () => {
    Alert.alert("Edit Contact", "Edit contact information coming soon!");
  };

  const handleLanguageChange = () => {
    Alert.alert("Language", "Language settings coming soon!");
  };

  const handleThemeChange = () => {
    Alert.alert("Theme", "Theme customization coming soon!");
  };

  const handlePrivacySettings = () => {
    Alert.alert("Privacy Settings", "Privacy settings coming soon!");
  };

  const handleAccountSettings = () => {
    Alert.alert("Account Settings", "Account settings coming soon!");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Delete account");
          },
        },
      ]
    );
  };

  const notificationSettings: SettingItem[] = [
    {
      icon: Bell,
      label: "Push Notifications",
      rightComponent: (
        <Switch
          value={pushNotifications}
          onValueChange={setPushNotifications}
          trackColor={{ false: "#D1D5DB", true: "#11964a" }}
          thumbColor="#FFFFFF"
        />
      ),
    },
    {
      icon: Mail,
      label: "Email Notifications",
      rightComponent: (
        <Switch
          value={emailNotifications}
          onValueChange={setEmailNotifications}
          trackColor={{ false: "#D1D5DB", true: "#11964a" }}
          thumbColor="#FFFFFF"
        />
      ),
    },
  ];

  const appSettings: SettingItem[] = [
    {
      icon: Globe,
      label: "Language",
      value: "English",
      onPress: handleLanguageChange,
      showChevron: true,
    },
    {
      icon: Moon,
      label: "Dark Mode",
      rightComponent: (
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: "#D1D5DB", true: "#11964a" }}
          thumbColor="#FFFFFF"
        />
      ),
    },
    {
      icon: MapPin,
      label: "Location Services",
      rightComponent: (
        <Switch
          value={locationServices}
          onValueChange={setLocationServices}
          trackColor={{ false: "#D1D5DB", true: "#11964a" }}
          thumbColor="#FFFFFF"
        />
      ),
    },
    {
      icon: Palette,
      label: "Theme",
      value: "Default",
      onPress: handleThemeChange,
      showChevron: true,
    },
  ];

  const accountSettings: SettingItem[] = [
    {
      icon: User,
      label: "Account Settings",
      onPress: handleAccountSettings,
      showChevron: true,
    },
    {
      icon: Lock,
      label: "Privacy & Security",
      onPress: handlePrivacySettings,
      showChevron: true,
    },
    {
      icon: Smartphone,
      label: "Connected Devices",
      value: "2 devices",
      onPress: () => Alert.alert("Devices", "Device management coming soon!"),
      showChevron: true,
    },
  ];

  const renderSettingItem = (item: SettingItem, index: number, isLast: boolean = false) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity
        key={index}
        onPress={item.onPress}
        disabled={!item.onPress}
        activeOpacity={item.onPress ? 0.7 : 1}
        className={`flex-row items-center py-4 ${!isLast ? "border-b border-gray-100" : ""}`}
      >
        <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
          <Icon color="#11964a" size={20} />
        </View>
        <View className="flex-1">
          <Text className="text-base text-gray-900">{item.label}</Text>
          {item.value && (
            <Text className="text-sm text-gray-500 mt-0.5">{item.value}</Text>
          )}
        </View>
        {item.rightComponent ? (
          item.rightComponent
        ) : item.showChevron ? (
          <ChevronRight color="#9CA3AF" size={20} />
        ) : null}
      </TouchableOpacity>
    );
  };

  const renderSettingsSection = (
    title: string,
    items: SettingItem[],
    icon?: React.ComponentType<{ color: string; size: number }>
  ) => {
    return (
      <Card className="mb-4" padding="none">
        {title && (
          <View className="px-4 pt-4 pb-2 flex-row items-center">
            {icon && (
              <View className="mr-2">
                {(() => {
                  const Icon = icon;
                  return <Icon color="#6B7280" size={16} />;
                })()}
              </View>
            )}
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {title}
            </Text>
          </View>
        )}
        <View className="px-4 pb-2">
          {items.map((item, index) =>
            renderSettingItem(item, index, index === items.length - 1)
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <DetailHeader title="Settings" showBack={true} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4">
          {/* Contact Information */}
          <Card className="mb-4" padding="none">
            <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Contact Information
              </Text>
              <TouchableOpacity onPress={handleEditContact}>
                <Edit color="#11964a" size={16} />
              </TouchableOpacity>
            </View>
            <View className="px-4 pb-4">
              <View className="flex-col">
                <View className="flex-row items-center mb-3">
                  <Mail color="#6B7280" size={18} />
                  <Text className="ml-3 text-gray-700 flex-1">
                    {user?.email || "N/A"}
                  </Text>
                </View>
                <View className="flex-row items-center mb-3">
                  <Phone color="#6B7280" size={18} />
                  <Text className="ml-3 text-gray-700 flex-1">
                    {user?.phone || "N/A"}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MapPin color="#6B7280" size={18} />
                  <Text className="ml-3 text-gray-700 flex-1">
                    N/A
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {renderSettingsSection("Notifications", notificationSettings, Bell)}
          {renderSettingsSection("App Preferences", appSettings, Palette)}
          {renderSettingsSection("Account", accountSettings, Shield)}

          {/* Danger Zone */}
          <Card className="mb-4 border-red-200" padding="none">
            <View className="px-4 pt-4 pb-2">
              <Text className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                Danger Zone
              </Text>
            </View>
            <View className="px-4 pb-4">
              <TouchableOpacity
                onPress={handleDeleteAccount}
                activeOpacity={0.7}
                className="flex-row items-center py-4"
              >
                <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mr-3">
                  <Trash2 color="#EF4444" size={20} />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-red-600">Delete Account</Text>
                  <Text className="text-sm text-gray-500 mt-0.5">
                    Permanently delete your account and all data
                  </Text>
                </View>
                <ChevronRight color="#9CA3AF" size={20} />
              </TouchableOpacity>
            </View>
          </Card>

          {/* App Info */}
          <View className="items-center mt-4 mb-6">
            <Text className="text-gray-400 text-xs mb-1">Livestockly Mobile</Text>
            <Text className="text-gray-400 text-xs">Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


import { TouchableOpacity, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  Settings,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Heart,
  Package,
} from "lucide-react-native";
import { Text } from "../ui/Text";
import { Card } from "../ui/Card";

interface ProfileMenuItem {
  icon: React.ComponentType<{ color: string; size: number }>;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
}

export function ProfileMenu() {
  const router = useRouter();

  const menuItems: ProfileMenuItem[] = [
    {
      icon: Heart,
      label: "Saved Items",
      onPress: () => router.push("/(tabs)/saved"),
      showChevron: true,
    },
    {
      icon: Package,
      label: "My Orders",
      onPress: () => router.push("/orders"),
      showChevron: true,
    },
    {
      icon: Bell,
      label: "Notifications",
      onPress: () => router.push("/notifications"),
      showChevron: true,
    },
    {
      icon: Settings,
      label: "Settings",
      onPress: () => router.push("/settings"),
      showChevron: true,
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      onPress: () => {
        Alert.alert("Privacy & Security", "Privacy settings coming soon!");
      },
      showChevron: true,
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onPress: () => {
        Alert.alert("Help & Support", "Help & Support coming soon!");
      },
      showChevron: true,
    },
  ];

  const renderMenuItem = (item: ProfileMenuItem, index: number) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity
        key={index}
        onPress={item.onPress}
        activeOpacity={0.7}
        className="flex-row items-center py-4 border-b border-gray-100"
      >
        <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
          <Icon color="#11964a" size={20} />
        </View>
        <Text className="flex-1 text-base text-gray-900">{item.label}</Text>
        {item.showChevron && (
          <ChevronRight color="#9CA3AF" size={20} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Card className="mx-4 mt-4" padding="none">
      {menuItems.map((item, index) => renderMenuItem(item, index))}
    </Card>
  );
}


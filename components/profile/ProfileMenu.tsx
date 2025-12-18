import { useRouter } from "expo-router";
import {
  HelpCircle,
  Package,
  Settings,
} from "lucide-react-native";
import { Alert, TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

interface ProfileMenuItem {
  icon: React.ComponentType<{ color: string; size: number }>;
  label: string;
  onPress: () => void;
}

export function ProfileMenu() {
  const router = useRouter();

  const menuItems: ProfileMenuItem[] = [
    {
      icon: Package,
      label: "My Orders",
      onPress: () => router.push("/orders"),
    },
    {
      icon: Settings,
      label: "Settings",
      onPress: () => router.push("/settings"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onPress: () => {
        Alert.alert("Help & Support", "Help & Support coming soon!");
      },
    },
  ];

  const renderMenuItem = (item: ProfileMenuItem, index: number) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity
        key={index}
        onPress={item.onPress}
        activeOpacity={0.7}
        className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 items-center"
        style={{ minWidth: '30%' }}
      >
        <View className="w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center mb-3">
          <Icon color="#6B7280" size={22} />
        </View>
        <Text className="text-sm text-gray-900 text-center" numberOfLines={2}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="mx-5">
      <View className="flex-row flex-wrap" style={{ gap: 12 }}>
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </View>
    </View>
  );
}


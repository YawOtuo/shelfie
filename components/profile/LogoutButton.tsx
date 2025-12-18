import { TouchableOpacity, View, Alert } from "react-native";
import { LogOut } from "lucide-react-native";
import { Text } from "../ui/Text";

interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  const handleLogout = () => {
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
          onPress: onLogout,
        },
      ]
    );
  };

  return (
    <View className="mx-5 mt-6 mb-4">
      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.7}
        className="flex-row items-center justify-center rounded-xl border border-gray-200 bg-white py-4"
      >
        <LogOut color="#EF4444" size={18} />
        <Text className="text-red-500 ml-2 text-sm font-medium">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}


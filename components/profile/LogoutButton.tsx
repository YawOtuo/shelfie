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
    <View className="mx-4 mt-6 mb-8">
      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.7}
        className="flex-row items-center justify-center rounded-2xl border-2 border-red-500 bg-transparent py-4"
      >
        <LogOut color="#EF4444" size={20} />
        <Text className="text-red-500 ml-2 text-base font-semibold">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}


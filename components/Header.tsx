import { useRouter } from "expo-router";
import { ArrowLeft, Bell, User } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "./ui/Text";
import { colors } from "../lib/colors";

interface HeaderProps {
  showBack?: boolean;
  className?: string;
}

export function Header({ showBack = false, className }: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`bg-white border-b border-gray-100 ${className || ""}`}
      style={{
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        paddingHorizontal: 20,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 p-2 -ml-2"
              activeOpacity={0.7}
            >
              <ArrowLeft color={colors.gray[800]} size={24} />
            </TouchableOpacity>
          )}
          <Text className="text-xl font-bold text-gray-900 flex-1" variant="bold">
            Shelfie
          </Text>
        </View>
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center"
            activeOpacity={0.7}
          >
            <Bell color={colors.gray[800]} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center"
            activeOpacity={0.7}
          >
            <User color={colors.gray[800]} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


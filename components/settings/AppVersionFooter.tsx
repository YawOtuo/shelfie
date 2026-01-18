import { View } from "react-native";
import { Sparkles } from "lucide-react-native";
import { Text } from "../ui/Text";
import { colors } from "../../lib/colors";

interface AppVersionFooterProps {
  version?: string;
}

export function AppVersionFooter({ version = "v1.0.0" }: AppVersionFooterProps) {
  return (
    <View className="items-center pt-4 pb-2">
      <View className="flex-row items-center">
        <Sparkles color={colors.gray[400]} size={12} />
        <Text className="text-gray-400 text-xs ml-1.5">Shelfie {version}</Text>
      </View>
    </View>
  );
}

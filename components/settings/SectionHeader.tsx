import { View } from "react-native";
import { Text } from "../ui/Text";
import { colors } from "../../lib/colors";

interface SectionHeaderProps {
  title: string;
  icon?: React.ComponentType<{ color?: string; size?: number }>;
}

export function SectionHeader({ title, icon: Icon }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center px-5 mb-3 mt-6">
      {Icon && (
        <View className="mr-2">
          <Icon color={colors.gray[500]} size={16} />
        </View>
      )}
      <Text className="text-xs text-gray-500 uppercase tracking-wide" variant="semibold">
        {title}
      </Text>
    </View>
  );
}

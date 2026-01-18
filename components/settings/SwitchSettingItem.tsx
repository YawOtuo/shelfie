import { View, Switch } from "react-native";
import { Text } from "../ui/Text";
import { colors } from "../../lib/colors";

interface SwitchSettingItemProps {
  icon: React.ComponentType<{ color?: string; size?: number }>;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function SwitchSettingItem({
  icon: Icon,
  title,
  subtitle,
  value,
  onValueChange,
}: SwitchSettingItemProps) {
  return (
    <View className="flex-row items-center py-3 px-4">
      <View 
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: colors.primary[100] }}
      >
        <Icon color={colors.primary.DEFAULT} size={20} />
      </View>
      <View className="flex-1">
        <Text className="text-sm text-gray-900" variant="medium">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-xs text-gray-500 mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ 
          false: colors.gray[200], 
          true: colors.primary.DEFAULT 
        }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.gray[200]}
      />
    </View>
  );
}

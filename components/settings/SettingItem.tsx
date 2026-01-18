import { TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { Text } from "../ui/Text";
import { colors } from "../../lib/colors";

interface SettingItemProps {
  icon: React.ComponentType<{ color?: string; size?: number }>;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showChevron?: boolean;
  variant?: "default" | "danger";
}

export function SettingItem({
  icon: Icon,
  title,
  subtitle,
  onPress,
  rightComponent,
  showChevron = true,
  variant = "default",
}: SettingItemProps) {
  const iconColor = variant === "danger" ? colors.red[500] : colors.primary.DEFAULT;
  const titleColor = variant === "danger" ? "text-red-600" : "text-gray-900";
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className="flex-row items-center py-3 px-4"
      disabled={!onPress}
      style={{
        backgroundColor: colors.white,
      }}
    >
      <View 
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{
          backgroundColor: variant === "danger" ? colors.red[500] + "15" : colors.primary[100],
        }}
      >
        <Icon color={iconColor} size={20} />
      </View>
      <View className="flex-1">
        <Text className={`text-sm ${titleColor}`} variant="medium">{title}</Text>
        {subtitle && (
          <Text className="text-xs text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
      {rightComponent}
      {showChevron && onPress && (
        <View className="ml-2">
          <ChevronRight color={colors.gray[400]} size={20} />
        </View>
      )}
    </TouchableOpacity>
  );
}

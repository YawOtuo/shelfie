import { Package, Search, Building2 } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "./Text";

interface EmptyStateProps {
  icon?: React.ReactNode;
  iconType?: "package" | "search" | "building";
  title: string;
  message?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, iconType = "package", title, message, action }: EmptyStateProps) {
  const getDefaultIcon = () => {
    const iconProps = { size: 32, color: "#9CA3AF" };
    switch (iconType) {
      case "search":
        return <Search {...iconProps} />;
      case "building":
        return <Building2 {...iconProps} />;
      default:
        return <Package {...iconProps} />;
    }
  };

  return (
    <View className="px-4 py-12 items-center justify-center">
      <View className="mb-4">
        {icon || (
          <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center">
            {getDefaultIcon()}
          </View>
        )}
      </View>
      <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
        {title}
      </Text>
      {message && (
        <Text className="text-sm text-gray-500 text-center mb-4 max-w-xs">
          {message}
        </Text>
      )}
      {action && <View className="mt-2">{action}</View>}
    </View>
  );
}


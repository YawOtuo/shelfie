import { ActivityIndicator, View } from "react-native";
import { cn } from "../../lib/utils";
import { Text } from "./Text";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "large",
  color = "#11964a",
  text,
  className,
}: LoadingSpinnerProps) {
  return (
    <View className={cn("items-center justify-center", className)}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text className="text-gray-600 mt-3 text-base">{text}</Text>}
    </View>
  );
}


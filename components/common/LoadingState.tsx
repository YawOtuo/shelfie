import { View } from "react-native";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Text } from "../ui/Text";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <LoadingSpinner size="large" />
      <Text className="text-gray-600 mt-4 text-xs">{message}</Text>
    </View>
  );
}

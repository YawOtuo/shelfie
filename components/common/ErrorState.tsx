import { View } from "react-native";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-red-600 text-center mb-4 text-sm">
        {message}
      </Text>
      <Button onPress={onRetry} variant="outline" size="sm">
        <Text className="text-sm" variant="medium">Retry</Text>
      </Button>
    </View>
  );
}

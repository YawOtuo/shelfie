import { TouchableOpacity, View } from "react-native";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  return (
    <View className="flex-1 justify-center items-center px-6" style={{ width: "100%" }}>
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-white text-center mb-3">
          Welcome to Shelfie
        </Text>
        <Text className="text-base text-primary-100 text-center leading-6">
          Manage inventory, track sales, and grow your business.
        </Text>
      </View>
      <View className="w-full">
        <Button onPress={onNext} size="md" className="rounded-full mb-3">
          Next
        </Button>
        <TouchableOpacity onPress={onSkip} className="py-2">
          <Text className="text-primary-200 text-center text-sm">Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

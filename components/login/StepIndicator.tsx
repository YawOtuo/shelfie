import { View } from "react-native";
import { Text } from "../ui/Text";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <View className="flex-row items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <View
          key={step}
          className={`h-1.5 rounded-full mx-1 transition-all duration-300 ${
            step === currentStep ? "w-8 bg-primary" : "w-2 bg-white/10"
          }`}
        />
      ))}
    </View>
  );
}

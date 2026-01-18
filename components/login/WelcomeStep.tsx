import { View, Platform, ScrollView } from "react-native";
import { Store, ArrowRight } from "lucide-react-native";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { colors } from "../../lib/colors";

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 32 }}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.primary[200] }}
    >
      <View className="flex-1 justify-center items-center">
        {/* Logo/Icon Section */}
        <View className="items-center mb-12">
          <View 
            className="w-24 h-24 rounded-3xl items-center justify-center mb-6"
            style={{
              backgroundColor: colors.primary.DEFAULT,
              ...Platform.select({
                ios: {
                  shadowColor: colors.primary.DEFAULT,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                },
                android: {
                  elevation: 6,
                },
              }),
            }}
          >
            <Store color={colors.white} size={48} />
          </View>
          
          <Text className="text-3xl text-gray-900 mb-2" variant="bold">
            Welcome to Shelfie
          </Text>
          
          <Text className="text-sm text-gray-600 text-center max-w-xs">
            Your business management solution
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="w-full" style={{ gap: 12 }}>
          <Button 
            onPress={onNext} 
            size="sm" 
            className="w-full"
          >
            <View className="flex-row items-center">
              <Text className="text-sm text-white mr-2" variant="medium">Get Started</Text>
              <ArrowRight color={colors.white} size={16} />
            </View>
          </Button>
          
          <Button
            onPress={onSkip}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            <Text className="text-sm text-gray-700" variant="medium">Skip</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

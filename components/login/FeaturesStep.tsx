import { ScrollView, View } from "react-native";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

interface FeaturesStepProps {
  onNext: () => void;
}

export function FeaturesStep({ onNext }: FeaturesStepProps) {
  const features = [
    {
      title: "Inventory Management",
      description: "Track your products",
    },
    {
      title: "Sales Tracking",
      description: "Monitor sales and revenue",
    },
    {
      title: "Business Growth",
      description: "Data-driven decisions",
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 }}
      showsVerticalScrollIndicator={false}
      style={{ width: "100%" }}
    >
      <View className="mb-8">
        <Text className="text-3xl font-bold text-white text-center mb-3">
          Why Shelfie?
        </Text>
        <Text className="text-base text-primary-100 text-center mb-6 leading-6">
          Everything you need in one place
        </Text>
        <View className="gap-3">
          {features.map((feature, index) => {
            return (
              <View
                key={index}
                className="mb-1"
              >
                <View className="flex-1">
                  <Text className="text-xl font-bold text-white mb-1">
                    {feature.title}
                  </Text>
                  <Text className="text-sm text-primary-200/80 leading-5">
                    {feature.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <View className="w-full mb-6">
        <Button onPress={onNext} size="md" className="rounded-full">
          Next
        </Button>
      </View>
    </ScrollView>
  );
}

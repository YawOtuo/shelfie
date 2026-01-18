import { ScrollView, View, Platform } from "react-native";
import { Package, TrendingUp, BarChart3, Sparkles } from "lucide-react-native";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { colors } from "../../lib/colors";

interface FeaturesStepProps {
  onNext: () => void;
}

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ color?: string; size?: number }>;
}

export function FeaturesStep({ onNext }: FeaturesStepProps) {
  const features: Feature[] = [
    {
      title: "Inventory Management",
      description: "Track your products and stock levels in real-time",
      icon: Package,
    },
    {
      title: "Sales Tracking",
      description: "Monitor sales performance and revenue insights",
      icon: TrendingUp,
    },
    {
      title: "Business Growth",
      description: "Make data-driven decisions to grow your business",
      icon: BarChart3,
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 32 }}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.primary[200] }}
    >
      <View className="flex-1 justify-center">
        {/* Header Section */}
        <View className="items-center mb-8">
          <View 
            className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
            style={{
              backgroundColor: colors.primary[100],
              ...Platform.select({
                ios: {
                  shadowColor: colors.primary.DEFAULT,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
          >
            <Sparkles color={colors.primary.DEFAULT} size={32} />
          </View>
          <Text className="text-2xl text-gray-900 mb-2" variant="bold">
            Why Shelfie?
          </Text>
          <Text className="text-sm text-gray-500 text-center max-w-xs">
            Everything you need to manage your business in one powerful platform
          </Text>
        </View>

        {/* Features Grid */}
        <View className="mb-8" style={{ gap: 12 }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <View
                key={index}
                className="flex-row items-start"
                style={{
                  backgroundColor: colors.primary[100],
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <View 
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: colors.primary[200] }}
                >
                  <Icon color={colors.primary.DEFAULT} size={22} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-900 mb-1" variant="semibold">
                    {feature.title}
                  </Text>
                  <Text className="text-xs text-gray-600 leading-4">
                    {feature.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* CTA Button */}
        <View className="w-full">
          <Button 
            onPress={onNext} 
            size="sm" 
            className="w-full"
          >
            <Text className="text-sm text-white" variant="medium">Continue</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

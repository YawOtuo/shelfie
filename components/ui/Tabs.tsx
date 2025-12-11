import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "./Text";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "rounded" | "underline";
}

export function Tabs({ tabs, activeTab, onTabChange, variant = "rounded" }: TabsProps) {
  if (variant === "underline") {
    return (
      <View className="border-b border-gray-200 mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => onTabChange(tab.id)}
                className="mr-6 pb-3"
                activeOpacity={0.7}
              >
                <Text
                  className={`text-base ${
                    isActive ? "text-primary font-semibold" : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </Text>
                {isActive && (
                  <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // Rounded variant (default)
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-2xl shadow-md ${
                  isActive ? "bg-gray-100" : "bg-white"
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm font-semibold ${
                    isActive ? "text-black" : "text-gray-900"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}

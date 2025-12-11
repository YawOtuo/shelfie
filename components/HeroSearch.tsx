import { useRouter } from "expo-router";
import { Search, SlidersHorizontal } from "lucide-react-native";
import React from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "./ui/Text";

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchPress?: () => void;
  onFiltersPress?: () => void;
  placeholder?: string;
}

const categories = [
  { name: "Cattle", value: "cattle", emoji: "🐄" },
  { name: "Goats", value: "goats", emoji: "🐐" },
  { name: "Sheep", value: "sheep", emoji: "🐑" },
  { name: "Poultry", value: "poultry", emoji: "🐔" },
  { name: "Pigs", value: "pigs", emoji: "🐷" },
];

export function HeroSearch({
  searchQuery,
  onSearchChange,
  onSearchPress,
  onFiltersPress,
  placeholder = "Search for livestock...",
}: HeroSearchProps) {
  const router = useRouter();

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: "/(tabs)/search",
      params: { category },
    });
  };

  return (
    <View className="bg-white pb-6">
      <View className="px-5 pt-6">
        {/* Header Text */}
        <View className="mb-5">
          <Text className="text-2xl font-bold text-primary leading-tight">
            Find the perfect livestock/meat for your needs
          </Text>
        </View>

        {/* Search Bar with White Background and Shadow */}
        <TouchableOpacity
          className="bg-white rounded-2xl shadow-md flex-row items-center px-4 py-3.5 mb-4"
          activeOpacity={1}
        >
          <Search size={20} color="#6B7280" />
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-gray-900"
            editable={true}
            returnKeyType="search"
          />
          <TouchableOpacity
            onPress={onFiltersPress}
            className="ml-2 p-2"
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={20} color="#11964a" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20, gap: 8 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.value}
              onPress={() => handleCategoryPress(category.value)}
              className="bg-white rounded-full px-4 py-2.5 flex-row items-center gap-2 shadow-sm"
              activeOpacity={0.7}
            >
              <Text className="text-base">{category.emoji}</Text>
              <Text className="text-sm font-medium text-gray-900">
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

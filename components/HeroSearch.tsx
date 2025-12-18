import { cva, type VariantProps } from "class-variance-authority";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { SearchBar } from "./SearchBar";
import { Text } from "./ui/Text";

const categoryCardVariants = cva(
  "bg-white rounded-2xl flex-col items-center justify-center shadow-sm border border-gray-100",
  {
    variants: {
      size: {
        sm: "px-4 py-3 min-w-[90px]",
        md: "px-5 py-4 min-w-[100px]",
        lg: "px-6 py-5 min-w-[110px]",
      },
      variant: {
        default: "bg-white border-gray-100",
        elevated: "bg-white border-gray-100 shadow-md",
        outlined: "bg-transparent border-2 border-primary",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

const categoryIconSizes = {
  sm: 24,
  md: 32,
  lg: 40,
};

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchPress?: () => void;
  onFiltersPress?: () => void;
  onCategoryPress?: (category: string) => void;
  placeholder?: string;
  categorySize?: VariantProps<typeof categoryCardVariants>["size"];
  categoryVariant?: VariantProps<typeof categoryCardVariants>["variant"];
  cattleCount?: number;
  goatsCount?: number;
  poultryCount?: number;
}

const categories = [
  { name: "Cattle", value: "cattle", icon: "hamburger" },
  { name: "Goats", value: "goats", icon: "hamburger" },
  { name: "Sheep", value: "sheep", icon: "hamburger" },
  { name: "Poultry", value: "poultry", icon: "drumstick-bite" },
  { name: "Pigs", value: "pigs", icon: "bacon" },
];

export function HeroSearch({
  searchQuery,
  onSearchChange,
  onSearchPress,
  onFiltersPress,
  onCategoryPress,
  placeholder = "Search for livestock...",
  cattleCount = 0,
  goatsCount = 0,
  poultryCount = 0,
}: HeroSearchProps) {
  const router = useRouter();

  return (
    <View className="relative pb-10 overflow-hidden">
      <LinearGradient
        colors={["#fffbeb33","#fffbeb33","#fffbeb33"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="absolute inset-0"
      />
      <View className="pt-20">
        {/* Header Text */}
        <View className="mb-5 px-10 pr-16">
          <Text className=" text-primary  font-semibold text-2xl   leading-tight">
            Find the perfect <Text className="text-primary-dark font-semibold text-2xl">livestock/meat</Text> for your needs.
          </Text>
        </View>

        {/* Search Bar with White Background and Shadow */}
        <View className="flex-row items-center gap-2 mb-4 px-10 pr-16">
          <SearchBar
            value={searchQuery}
            onChangeText={onSearchChange}
            onPress={onSearchPress}
            placeholder={placeholder}
            variant="hero"
            editable={true}
          />
          <TouchableOpacity
            onPress={onFiltersPress}
            className="p-3 bg-white rounded-2xl shadow-md"
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={20} color="#11964a" />
          </TouchableOpacity>
        </View>

        {/* Quick Category Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 40, paddingRight: 40 }}
        >
          <TouchableOpacity
            onPress={() => onCategoryPress?.("cattle")}
            className="mr-2 px-4 py-2 bg-white/95 rounded-full flex-row items-center gap-2 border border-green-200 shadow-sm"
            activeOpacity={0.7}
          >
            <Text className="text-base">🐄</Text>
            <Text className="text-xs font-semibold text-gray-900">Cattle</Text>
            {cattleCount > 0 && (
              <View className="bg-primary rounded-full px-2 py-0.5">
                <Text className="text-white text-[10px] font-bold">{cattleCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onCategoryPress?.("goats")}
            className="mr-2 px-4 py-2 bg-white/95 rounded-full flex-row items-center gap-2 border border-blue-200 shadow-sm"
            activeOpacity={0.7}
          >
            <Text className="text-base">🐐</Text>
            <Text className="text-xs font-semibold text-gray-900">Goats</Text>
            {goatsCount > 0 && (
              <View className="bg-blue-600 rounded-full px-2 py-0.5">
                <Text className="text-white text-[10px] font-bold">{goatsCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onCategoryPress?.("poultry")}
            className="mr-2 px-4 py-2 bg-white/95 rounded-full flex-row items-center gap-2 border border-orange-200 shadow-sm"
            activeOpacity={0.7}
          >
            <Text className="text-base">🐓</Text>
            <Text className="text-xs font-semibold text-gray-900">Poultry</Text>
            {poultryCount > 0 && (
              <View className="bg-orange-600 rounded-full px-2 py-0.5">
                <Text className="text-white text-[10px] font-bold">{poultryCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onCategoryPress?.("sheep")}
            className="mr-2 px-4 py-2 bg-white/95 rounded-full flex-row items-center gap-2 border border-purple-200 shadow-sm"
            activeOpacity={0.7}
          >
            <Text className="text-base">🐑</Text>
            <Text className="text-xs font-semibold text-gray-900">Sheep</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/search")}
            className="px-4 py-2 bg-gray-900/90 rounded-full flex-row items-center gap-2 shadow-md"
            activeOpacity={0.7}
          >
            <Text className="text-base">✨</Text>
            <Text className="text-xs font-semibold text-white">View All</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {/* Wavy Bottom Edge */}
      <View className="absolute bottom-0 left-0 right-0" style={{ height: 40 }}>
        <Svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
          <Path
            d="M0,40 Q25,30 50,35 T100,35 L100,40 Z"
            fill="#ffffff"
          />
        </Svg>
      </View>
    </View>
  );
}

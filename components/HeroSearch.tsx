import { cva, type VariantProps } from "class-variance-authority";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
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
  placeholder?: string;
  categorySize?: VariantProps<typeof categoryCardVariants>["size"];
  categoryVariant?: VariantProps<typeof categoryCardVariants>["variant"];
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
  placeholder = "Search for livestock...",
  categorySize = "md",
  categoryVariant = "default",
}: HeroSearchProps) {
  const router = useRouter();

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: "/(tabs)/search",
      params: { category },
    });
  };

  return (
    <View className="relative pb-10 overflow-hidden">
      <LinearGradient
        colors={["#fffbeb33","#fffbeb33","#fffbeb33"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="absolute inset-0"
      />
      <View className="pr-16 pl-10 pt-20">
        {/* Header Text */}
        <View className="mb-5 ">
          <Text className=" text-primary  font-semibold text-2xl   leading-tight">
            Find the perfect <Text className="text-primary-dark font-semibold text-2xl">livestock/meat</Text> for your needs.
          </Text>
        </View>

        {/* Search Bar with White Background and Shadow */}
        <View className="flex-row items-center gap-2 mb-4">
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

        {/* Category Tabs */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20, gap: 12 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.value}
              onPress={() => handleCategoryPress(category.value)}
              className={cn(categoryCardVariants({ size: categorySize, variant: categoryVariant }))}
              activeOpacity={0.7}
            >
              <View className="mb-2">
                <FontAwesome5 
                  name={category.icon} 
                  size={categoryIconSizes[categorySize || "md"]} 
                  color="#11964a" 
                />
              </View>
              <Text 
                className={cn(
                  "font-semibold text-gray-900",
                  categorySize === "sm" && "text-sm",
                  categorySize === "md" && "text-base",
                  categorySize === "lg" && "text-lg"
                )} 
                variant="semibold"
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView> */}
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

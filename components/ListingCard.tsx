import { Heart, Sparkles, Users } from "lucide-react-native";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Listing } from "../lib/types/listing";
import { Text } from "./ui/Text";

interface ListingCardProps {
  listing: Listing;
  onPress?: () => void;
  isHandpicked?: boolean;
  width?: number;
}

export function ListingCard({
  listing,
  onPress,
  isHandpicked = false,
  width,
}: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const {
    title,
    farm_name: farmName,
    farm_location,
    location,
    images,
    selling_price_per_unit: price,
    type,
    slaughterable,
    number_of_portions,
  } = listing;

  const displayLocation = farm_location || location;
  const imageSrc = images?.find((img) => img.is_primary)?.image_url || images?.[0]?.image_url;

  const supportsGroupBuying =
    type === "FULL_ANIMAL" &&
    slaughterable === true &&
    (number_of_portions === undefined || number_of_portions >= 2);

  const handleSavePress = (e: any) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
      style={width ? { width, height: 100 } : { flex: 1, height: 100 }}
    >
      <View className="flex-row p-2 h-full">
        {/* Image */}
        <View className="w-20 h-full rounded-xl bg-gray-100 mr-3 overflow-hidden">
          {imageSrc ? (
            <Image
              source={{ uri: imageSrc }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Text className="text-gray-400 text-2xl">🐄</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          {/* Title and Save */}
          <View className="flex-row items-start justify-between mb-1">
            <Text className="text-sm font-semibold text-gray-900 flex-1" numberOfLines={2}>
              {title}
            </Text>
            <TouchableOpacity
              onPress={handleSavePress}
              className="ml-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Heart
                size={16}
                color={isSaved ? "#EF4444" : "#9CA3AF"}
                fill={isSaved ? "#EF4444" : "transparent"}
              />
            </TouchableOpacity>
          </View>

          {/* Farm Name */}
          <Text className="text-[9px] text-gray-500 mb-2" numberOfLines={1}>
            {farmName}
          </Text>

          {/* Price and Badges */}
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-primary">
              GHS {price ? price.toLocaleString() : "0"}
            </Text>
            <View className="flex-row items-center gap-1.5">
              {isHandpicked && (
                <View className="bg-yellow-100 rounded-full px-2 py-0.5">
                  <Sparkles size={10} color="#EAB308" fill="#EAB308" />
                </View>
              )}
              {supportsGroupBuying && (
                <View className="bg-green-100 rounded-full px-2 py-0.5">
                  <Users size={10} color="#11964a" />
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

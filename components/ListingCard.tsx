import { Heart, MapPin, Sparkles, Users } from "lucide-react-native";
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
  const imageSrc =
    images?.find((img) => img.is_primary)?.image_url || images?.[0]?.image_url;

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
      className="bg-white rounded-2xl overflow-hidden"
      style={width ? { width, height: 180 } : { flex: 1, height: 200 }}
    >
      <View className="flex-col h-full">
        {/* Image Container with Save Button Overlay */}
        <View className="relative w-full h-32 bg-gray-100 overflow-hidden">
          {imageSrc ? (
            <Image
              source={{ uri: imageSrc }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-100">
              <Text className="text-gray-400 text-4xl">🐄</Text>
            </View>
          )}

          {/* Save Button Overlay */}
          <TouchableOpacity
            onPress={handleSavePress}
            className="absolute top-2 right-2 bg-white/90 rounded-full p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart
              size={18}
              color={isSaved ? "#EF4444" : "#6B7280"}
              fill={isSaved ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>

          {/* Badges Overlay on Image */}
          {(isHandpicked || supportsGroupBuying) && (
            <View className="absolute top-2 left-2 flex-row gap-1.5">
              {isHandpicked && (
                <View className="bg-yellow-500 rounded-full px-2.5 py-1 flex-row items-center gap-1">
                  <Sparkles size={12} color="#FFFFFF" fill="#FFFFFF" />
                </View>
              )}
              {supportsGroupBuying && (
                <View className="bg-primary rounded-full px-2.5 py-1 flex-row items-center gap-1">
                  <Users size={12} color="#FFFFFF" />
                </View>
              )}
            </View>
          )}
        </View>

        {/* Content */}
        <View className="flex-1 pt-2 px-2 justify-between">
          {/* Title and Farm Name */}
          <View>
            <Text
              className="text-base font-semibold text-gray-900"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>

            {/* Price */}
            <View className="flex-row items-center justify-start gap-2">
              <Text className="text-sm  text-primary">
                GHS {price ? price.toLocaleString() : "0"}
              </Text>

              <View className="flex-row items-center gap-1">
                <MapPin size={8} color="#6B7280" />
                <Text
                  className="text-[8px] text-gray-600 mt-0.5"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {farmName}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

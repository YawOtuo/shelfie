import { Heart, MapPin, Sparkles, Users } from "lucide-react-native";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Listing } from "../lib/types/listing";
import { Text } from "./ui/Text";

interface ListingCardV3Props {
  listing: Listing;
  onPress?: () => void;
  isHandpicked?: boolean;
  width?: number;
}

export function ListingCardV3({
  listing,
  onPress,
  isHandpicked = false,
  width,
}: ListingCardV3Props) {
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
      className="bg-white rounded-2xl overflow-hidden border border-gray-50"
      style={width ? { width } : { minWidth: 240, maxWidth: 320 }}
    >
      <View className="flex-row h-24">
        {/* Image Container */}
        <View className="relative w-24 h-full bg-gray-100 overflow-hidden">
          {imageSrc ? (
            <Image
              source={{ uri: imageSrc }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-100">
              <Text className="text-gray-400 text-2xl">🐄</Text>
            </View>
          )}

          {/* Save Button Overlay */}
          <TouchableOpacity
            onPress={handleSavePress}
            className="absolute top-1.5 right-1.5 bg-white/90 rounded-full p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart
              size={14}
              color={isSaved ? "#EF4444" : "#6B7280"}
              fill={isSaved ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>

          {/* Badges Overlay on Image */}
          {(isHandpicked || supportsGroupBuying) && (
            <View className="absolute top-1.5 left-1.5 flex-row gap-1">
              {isHandpicked && (
                <View className="bg-yellow-500 rounded-full px-1.5 py-0.5 flex-row items-center gap-0.5">
                  <Sparkles size={9} color="#FFFFFF" fill="#FFFFFF" />
                </View>
              )}
              {supportsGroupBuying && (
                <View className="bg-primary rounded-full px-1.5 py-0.5 flex-row items-center gap-0.5">
                  <Users size={9} color="#FFFFFF" />
                </View>
              )}
            </View>
          )}
        </View>

        {/* Content */}
        <View className="px-2.5 py-1.5 justify-between" style={{ flex: 1, minWidth: 140 }}>
          {/* Title */}
          <View style={{ flex: 1 }}>
            <Text
              className="text-sm font-semibold text-gray-900"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>

          {/* Price and Farm Info */}
          <View className="gap-0.5">
            <Text className="text-base font-semibold text-primary">
              GHS {price ? price.toLocaleString() : "0"}
            </Text>

            <View className="flex-row items-center gap-1">
              <MapPin size={9} color="#6B7280" />
              <Text
                className="text-[10px] text-gray-600 flex-1"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {farmName}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}


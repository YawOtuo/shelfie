import { Building2, Heart, Star, Verified } from "lucide-react-native";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Farm } from "../lib/types/farm";
import { Text } from "./ui/Text";

interface FarmCardV3Props {
  farm: Farm;
  onPress?: () => void;
  width?: number;
}

export function FarmCardV3({ farm, onPress, width }: FarmCardV3Props) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSavePress = (e: any) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100"
      style={width ? { width } : { minWidth: 240, maxWidth: 320 }}
    >
      <View className="flex-row h-24">
        {/* Image Container */}
        <View className="relative w-24 h-full bg-gray-100 overflow-hidden">
          {farm.avatar_url ? (
            <Image
              source={{ uri: farm.avatar_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-100">
              <Building2 size={32} color="#9CA3AF" />
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

          {/* Verified Badge Overlay */}
          {farm.email_verified && (
            <View className="absolute top-1.5 left-1.5 bg-blue-500 rounded-full p-1">
              <Verified size={10} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Content */}
        <View className="px-2.5 py-1.5 justify-between" style={{ flex: 1, minWidth: 140 }}>
          {/* Farm Name */}
          <View style={{ flex: 1 }}>
            <Text
              className="text-sm font-semibold text-gray-900"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {farm.name}
            </Text>
          </View>

          {/* Rating */}
          <View className="flex-row items-center gap-1 mt-0.5">
            <Star size={12} color="#EAB308" fill="#EAB308" />
            <Text className="text-xs font-semibold text-gray-900">
              {farm.total_rating?.toFixed(1) || "0.0"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}


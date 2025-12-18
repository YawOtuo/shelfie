import { Building2, Heart, Star, Verified } from "lucide-react-native";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Farm } from "../lib/types/farm";
import { Text } from "./ui/Text";

interface FarmCardProps {
  farm: Farm;
  onPress?: () => void;
  width?: number;
}

export function FarmCard({ farm, onPress, width }: FarmCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSavePress = (e: any) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-2xl overflow-hidden"
      style={width ? { width, height: 200 } : { flex: 1, height: 200 }}
    >
      <View className="flex-col h-full">
        {/* Image Container with Save Button Overlay */}
        <View className="relative w-full h-32 bg-gray-100 overflow-hidden">
          {farm.avatar_url ? (
            <Image
              source={{ uri: farm.avatar_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-100">
              <Building2 size={40} color="#9CA3AF" />
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

          {/* Verified Badge Overlay */}
          {farm.email_verified && (
            <View className="absolute top-2 left-2 bg-blue-500 rounded-full p-1.5">
              <Verified size={14} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Content */}
        <View className="flex-1 p-3 justify-between">
          {/* Farm Name */}
          <View>
            <Text className="text-base font-bold text-gray-900" numberOfLines={2}>
              {farm.name}
            </Text>
          </View>

          {/* Rating */}
          <View className="flex-row items-center gap-1.5 mt-1">
            <Star size={16} color="#EAB308" fill="#EAB308" />
            <Text className="text-sm font-semibold text-gray-900">
              {farm.total_rating?.toFixed(1) || "0.0"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

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
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
      style={width ? { width, height: 100 } : { flex: 1, height: 100 }}
    >
      <View className="flex-row p-3 h-full">
        {/* Image */}
        <View className="w-20 h-full rounded-xl bg-gray-100 mr-3 overflow-hidden">
          {farm.avatar_url ? (
            <Image
              source={{ uri: farm.avatar_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Building2 size={32} color="#9CA3AF" />
            </View>
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          {/* Name and Save */}
          <View className="flex-row items-start justify-between mb-1">
            <View className="flex-row items-center gap-1.5 flex-1">
              <Text className="text-sm font-semibold text-gray-900 flex-1" numberOfLines={1}>
                {farm.name}
              </Text>
              {farm.verified && (
                <Verified size={14} color="#3B82F6" fill="#3B82F6" />
              )}
            </View>
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

          {/* Rating and Listings */}
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Star size={12} color="#EAB308" fill="#EAB308" />
              <Text className="text-xs font-medium text-gray-900">
                {farm.total_rating.toFixed(1)}
              </Text>
            </View>
            {farm.listings_count !== undefined && (
              <Text className="text-xs text-gray-500">
                {farm.listings_count} listings
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

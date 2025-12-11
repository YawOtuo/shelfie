import { Building2, MapPin, Verified } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "../ui/Text";
import { Farm } from "../../lib/types/farm";
import { Listing } from "../../lib/types/listing";

interface ListingHeaderProps {
  title: string;
  farm: Farm | null;
  displayLocation: string;
  listing: Listing;
}

export function ListingHeader({ title, farm, displayLocation, listing }: ListingHeaderProps) {
  return (
    <View className="px-4 pb-3">
      {/* Title */}
      <Text className="text-2xl font-bold text-gray-900 mb-4" numberOfLines={3}>
        {title}
      </Text>
      
      {/* Farm Info Row */}
      <View className="flex-row items-center flex-wrap gap-2">
        <Building2 size={16} color="#11964a" />
        <Text className="text-sm font-semibold text-gray-700 uppercase">
          {farm?.name || "Farm"}
        </Text>
        {farm?.verified && (
          <View className="flex-row items-center gap-1 bg-green-100 px-2.5 py-1 rounded-full">
            <Verified size={12} color="#11964a" fill="#11964a" />
            <Text className="text-xs font-semibold text-green-700">Verified Farm</Text>
          </View>
        )}
        <MapPin size={16} color="#EF4444" />
        <Text className="text-sm text-gray-500">
          {displayLocation || "Location not specified"}
          {listing.distance_meters && ` • ${(listing.distance_meters / 1000).toFixed(0)}km away`}
        </Text>
      </View>
    </View>
  );
}


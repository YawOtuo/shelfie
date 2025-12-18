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
    <View>
      {/* Farm Info Row */}
      <View className="flex-row items-center flex-wrap gap-2 mb-2">
        <View className="flex-row items-center gap-2">
          <Building2 size={16} color="#11964a" strokeWidth={2.5} />
          <Text className="text-sm font-semibold text-gray-900">
            {farm?.name || "Farm"}
          </Text>
        </View>
        {farm?.verified && (
          <View className="flex-row items-center gap-1 bg-primary/5 px-2.5 py-1 rounded-full">
            <Verified size={12} color="#11964a" fill="#11964a" strokeWidth={2.5} />
            <Text className="text-[10px] font-semibold text-primary">Verified</Text>
          </View>
        )}
      </View>

      {/* Location Row */}
      <View className="flex-row items-center gap-2">
        <MapPin size={14} color="#6B7280" strokeWidth={2} />
        <Text className="text-xs text-gray-600">
          {displayLocation || "Location not specified"}
          {listing.distance_meters && ` • ${(listing.distance_meters / 1000).toFixed(1)}km away`}
        </Text>
      </View>
    </View>
  );
}


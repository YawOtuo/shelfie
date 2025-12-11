import { TouchableOpacity, View } from "react-native";
import { Clock, Heart, MapPin, Shield, Truck } from "lucide-react-native";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { Listing } from "../../lib/types/listing";

interface PriceCardProps {
  listing: Listing;
  price: number | null;
  displayLocation: string;
  isSaved: boolean;
  onSave: () => void;
  onPlaceOrder: () => void;
}

export function PriceCard({
  listing,
  price,
  displayLocation,
  isSaved,
  onSave,
  onPlaceOrder,
}: PriceCardProps) {
  const { type, delivery } = listing;

  return (
    <View className="px-4 py-3">
      <View className="bg-white rounded-2xl shadow-md p-7">
        {/* Type Badge */}
        {type && (
          <View className="mb-2">
            <View className="bg-green-50 px-3 py-1.5 rounded-full self-start">
              <Text className="text-xs font-semibold text-green-700 uppercase">
                {type === "FULL_ANIMAL" ? "FULL ANIMAL" : type === "SHARED_PORTIONS" ? "SHARED PORTIONS" : "FROZEN"}
              </Text>
            </View>
          </View>
        )}

        {/* Price */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-primary">
            GHS {price?.toLocaleString() || "0"} / unit
          </Text>
        </View>

        {/* Delivery Fee */}
        <View className="mb-4 pb-3 border-b border-gray-200">
          <Text className="text-sm text-gray-600">
            Delivery fee: {delivery ? "GHS 50.40" : "Free"} to {displayLocation.split(",")[0] || displayLocation} (estimated)
          </Text>
        </View>

        {/* Info Sections */}
        <View className="mb-4">
          {/* Pickup/Delivery Info */}
          <View className="flex-row items-start gap-3 mb-3">
            <Truck size={18} color="#11964a" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 mb-1">
                {delivery ? "Delivery Available" : "Pickup Only"}
              </Text>
              <Text className="text-xs text-gray-600 leading-4">
                {delivery 
                  ? `Delivery would cost: GHS 50.40 to ${displayLocation.split(",")[0] || displayLocation} (estimated)`
                  : "This item is available for pickup only"}
              </Text>
            </View>
          </View>

          {/* Availability */}
          <View className="flex-row items-start gap-3 mb-3">
            <Clock size={18} color="#11964a" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 mb-1">
                Available Now
              </Text>
              <Text className="text-xs text-gray-600 leading-4">
                Order today, delivered within 3 days
              </Text>
            </View>
          </View>

          {/* Secure Payment */}
          <View className="flex-row items-start gap-3 mb-3">
            <Shield size={18} color="#11964a" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 mb-1">
                Secure Payment
              </Text>
              <Text className="text-xs text-gray-600 leading-4">
                100% secure payment protection
              </Text>
            </View>
          </View>

          {/* Location */}
          <View className="flex-row items-start gap-3">
            <MapPin size={18} color="#11964a" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 mb-1">
                Location
              </Text>
              <Text className="text-xs text-gray-600 leading-4">
                {displayLocation}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row items-center gap-3 pt-3 border-t border-gray-200">
          <TouchableOpacity
            onPress={onSave}
            className="w-12 h-12 items-center justify-center rounded-2xl border-2 border-gray-200"
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={isSaved ? "#EF4444" : "#6B7280"}
              fill={isSaved ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>
          <Button
            onPress={onPlaceOrder}
            variant="primary"
            size="md"
            className="flex-1"
          >
            I'm interested
          </Button>
        </View>
      </View>
    </View>
  );
}


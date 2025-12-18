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
    <View className="px-4 mb-6">
      <View className="bg-white rounded-2xl p-5">
        {/* Type Badge */}
        {type && (
          <View className="mb-3">
            <View className="bg-primary/10 px-3 py-1.5 rounded-full self-start">
              <Text className="text-xs font-semibold text-primary uppercase">
                {type === "FULL_ANIMAL" ? "Full Animal" : type === "SHARED_PORTIONS" ? "Shared Portions" : "Frozen"}
              </Text>
            </View>
          </View>
        )}

        {/* Price */}
        <View className="mb-5">
          <Text className="text-3xl font-bold text-primary mb-1">
            GHS {price?.toLocaleString() || "0"}
          </Text>
          <Text className="text-sm text-gray-500">per unit</Text>
        </View>

        {/* Info Sections */}
        <View className="mb-5">
          {/* Pickup/Delivery Info */}
          <View className="flex-row items-start gap-3 mb-4">
            <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
              <Truck size={20} color="#11964a" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900 mb-0.5">
                {delivery ? "Delivery Available" : "Pickup Only"}
              </Text>
              <Text className="text-sm text-gray-600">
                {delivery 
                  ? `GHS 50.40 to ${displayLocation.split(",")[0] || displayLocation} (estimated)`
                  : "Available for pickup only"}
              </Text>
            </View>
          </View>

          {/* Availability */}
          <View className="flex-row items-start gap-3 mb-4">
            <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
              <Clock size={20} color="#11964a" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900 mb-0.5">
                Available Now
              </Text>
              <Text className="text-sm text-gray-600">
                Order today, delivered within 3 days
              </Text>
            </View>
          </View>

          {/* Secure Payment */}
          <View className="flex-row items-start gap-3">
            <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
              <Shield size={20} color="#11964a" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900 mb-0.5">
                Secure Payment
              </Text>
              <Text className="text-sm text-gray-600">
                100% secure payment protection
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row items-center gap-3 pt-4 border-t border-gray-100">
          <TouchableOpacity
            onPress={onSave}
            className="w-14 h-14 items-center justify-center rounded-2xl border-2 border-gray-200"
            activeOpacity={0.7}
          >
            <Heart
              size={22}
              color={isSaved ? "#EF4444" : "#6B7280"}
              fill={isSaved ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>
          <Button
            onPress={onPlaceOrder}
            variant="primary"
            size="lg"
            className="flex-1"
          >
            I'm interested
          </Button>
        </View>
      </View>
    </View>
  );
}


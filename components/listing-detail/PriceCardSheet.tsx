import { View } from "react-native";
import { Calendar, MapPin, Package } from "lucide-react-native";
import { BottomSheet } from "../ui/BottomSheet";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { Listing } from "../../lib/types/listing";

interface PriceCardSheetProps {
  visible: boolean;
  onClose: () => void;
  listing: Listing;
  price: number | null;
  displayLocation: string;
  onPlaceOrder: () => void;
}

export function PriceCardSheet({
  visible,
  onClose,
  listing,
  price,
  displayLocation,
  onPlaceOrder,
}: PriceCardSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Pricing & Delivery"
      height={400}
      footer={
        <Button
          onPress={onPlaceOrder}
          variant="primary"
          size="lg"
          className="w-full"
        >
          Place Order
        </Button>
      }
    >
      <View className="px-6 pt-4">
        {/* Price Breakdown */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Price Breakdown
          </Text>
          
          <View className="bg-white rounded-2xl shadow-md p-4 mb-3">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base text-gray-700">Item Price</Text>
              <Text className="text-xl font-bold text-gray-900">
                GHS {price?.toLocaleString() || "0"}
              </Text>
            </View>
            
            <View className="h-px bg-gray-200 my-3" />
            
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <Package size={16} color="#6B7280" />
                <Text className="text-base text-gray-700">Delivery Fee</Text>
              </View>
              <Text className="text-lg font-semibold text-gray-900">
                {listing.delivery ? "GHS 50.00" : "Free"}
              </Text>
            </View>
            
            <View className="h-px bg-gray-200 my-3" />
            
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">Total</Text>
              <Text className="text-2xl font-bold text-primary">
                GHS {listing.delivery ? ((price || 0) + 50).toLocaleString() : price?.toLocaleString() || "0"}
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Information */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Delivery Information
          </Text>
          
          <View className="bg-white rounded-2xl shadow-md p-4">
            <View className="flex-row items-start gap-3 mb-4">
              <Calendar size={20} color="#11964a" />
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-1">Estimated Delivery</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {listing.delivery ? "3-5 business days" : "Pickup only"}
                </Text>
              </View>
            </View>
            
            {listing.delivery && (
              <View className="flex-row items-start gap-3">
                <MapPin size={20} color="#11964a" />
                <View className="flex-1">
                  <Text className="text-sm text-gray-500 mb-1">Delivery Location</Text>
                  <Text className="text-base text-gray-700">{displayLocation}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}


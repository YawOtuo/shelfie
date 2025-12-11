import { ScrollView, View } from "react-native";
import { BottomSheet } from "../ui/BottomSheet";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { Listing } from "../../lib/types/listing";

interface PlaceOrderSheetProps {
  visible: boolean;
  onClose: () => void;
  listing: Listing;
  price: number | null;
  displayLocation: string;
  onConfirmOrder: () => void;
}

export function PlaceOrderSheet({
  visible,
  onClose,
  listing,
  price,
  displayLocation,
  onConfirmOrder,
}: PlaceOrderSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Place Order"
      height={500}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-3">
          {/* Order Summary */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">Order Summary</Text>
            
            <View className="mb-3">
              <Text className="text-sm text-gray-600 mb-1">Item Price</Text>
              <Text className="text-xl font-bold text-gray-900">
                GHS {price?.toLocaleString() || "0"}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-sm text-gray-600 mb-1">Delivery Cost</Text>
              <Text className="text-lg font-semibold text-gray-900">
                {listing.delivery ? "GHS 50.00" : "Not available"}
              </Text>
            </View>

            <View className="pt-3 border-t border-gray-200">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-base font-semibold text-gray-900">Total</Text>
                <Text className="text-2xl font-bold text-primary">
                  GHS {listing.delivery ? ((price || 0) + 50).toLocaleString() : price?.toLocaleString() || "0"}
                </Text>
              </View>
            </View>
          </View>

          {/* Delivery Information */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">Delivery Information</Text>
            <View className="mb-2">
              <Text className="text-sm text-gray-600 mb-1">Estimated Delivery</Text>
              <Text className="text-base font-semibold text-gray-900">
                {listing.delivery ? "3-5 business days" : "Pickup only"}
              </Text>
            </View>
            {listing.delivery && (
              <View className="mt-2">
                <Text className="text-sm text-gray-600 mb-1">Delivery Location</Text>
                <Text className="text-sm text-gray-700">{displayLocation}</Text>
              </View>
            )}
          </View>

          {/* Place Order Button */}
          <Button
            onPress={onConfirmOrder}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Confirm Order
          </Button>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}


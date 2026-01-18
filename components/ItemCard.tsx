import { LinearGradient } from "expo-linear-gradient";
import { AlertTriangle } from "lucide-react-native";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Item } from "../lib/types/item";
import { Card } from "./ui/Card";
import { Text } from "./ui/Text";

interface ItemCardProps {
  item: Item;
  onPress: () => void;
}

export function ItemCard({ item, onPress }: ItemCardProps) {
  const hasImage = !!item.image_url;
  // Calculate low stock: if quantity is less than or equal to refill_count (or 5 if not set)
  const refillThreshold = item.refill_count || 5;
  const isLowStock = item.quantity <= refillThreshold;
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className="mb-4 overflow-hidden shadow-md" variant="default" padding="none">
        <View className="flex-row items-center justify-center px-1">
          {/* Image Section with Gradient Overlay */}
          <View className="w-20 h-20 relative overflow-hidden rounded-2xl">
            {hasImage && !imageError && item.image_url ? (
              <>
                <Image
                  source={{ uri: item.image_url }}
                  className="w-full h-full "
                  resizeMode="cover"
                  onError={() => setImageError(true)}
                />
                {isLowStock && (
                  <LinearGradient
                    colors={["transparent", "rgba(220, 38, 38, 0.9)"]}
                    className="absolute inset-0"
                  />
                )}
              </>
            ) : (
              <View className="w-full h-full bg-primary-50" />
            )}

            {/* Low Stock Badge on Image */}
            {isLowStock && (
              <View className="absolute bottom-2 left-2 right-2">
                <View className="flex-row items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1">
                  <AlertTriangle size={12} color="#DC2626" strokeWidth={2.5} />
                  <Text className="text-xxs font-semibold text-red-600 ml-1" variant="semibold">
                    Low Stock
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Content Section */}
          <View className="flex-1 p-4 justify-between">
            {/* Top Section - Name and Category */}
            <View>
              <Text
                className="text-base  text-gray-900"
                variant="medium"
                numberOfLines={2}
              >
                {item.name}
              </Text>

              {/* <View className="flex-row items-center gap-2">
                {item.category && (
                  <View className="bg-primary/10 px-2 py-0.5 rounded-md">
                    <Text className="text-xs text-primary font-medium" variant="medium">
                      {item.category}
                    </Text>
                  </View>
                )}
              </View> */}
            </View>

            {/* Bottom Section - Stock Info */}
            <View className="flex-row items-center justify-between mt-1">

              {/* <Text className="text-xs text-gray-500 mb-0.5">In Stock</Text> */}
              <View className="flex-row items-baseline">

                <Text className="text-sm text-gray-400 ml-1">
                  GHS {" "}
                </Text>

                <Text
                  className={`text-base text-gray-900`}
                  variant="regular"
                >
                  {item.unit_price}
                </Text>

              </View>


              <View>
                {/* <Text className="text-xs text-gray-500 mb-0.5">In Stock</Text> */}
                <View className="flex-row items-baseline">
                  <Text
                    className={`text-base ${isLowStock ? "text-red-600" : "text-gray-900"}`}
                    variant="regular"
                  >
                    {item.quantity}
                  </Text>
                  <Text className="text-xs text-gray-400 ml-1">
                    units rem.
                  </Text>
                </View>
              </View>

              {/* Stock Level Indicator */}
              {/* <View className="items-end">
                <Text className="text-xs text-gray-500 mb-1">Stock Level</Text>
                <View className="flex-row items-center gap-1">
                  {[...Array(5)].map((_, i) => {
                    const threshold = item.refill_count || 5;
                    const maxLevel = threshold * 2;
                    const percentage = (item.quantity / maxLevel) * 5;
                    const filled = i < Math.ceil(percentage);
                    return (
                      <View
                        key={i}
                        className={`w-1.5 h-6 rounded-full ${
                          filled
                            ? isLowStock
                              ? "bg-red-500"
                              : "bg-primary"
                            : "bg-gray-200"
                        }`}
                      />
                    );
                  })}
                </View>
              </View> */}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

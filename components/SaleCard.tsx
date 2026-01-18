import { Calendar, ShoppingBag } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { Sale } from "../lib/types/sale";
import { Card } from "./ui/Card";
import { Text } from "./ui/Text";

interface SaleCardProps {
  sale: Sale;
  onPress: () => void;
}

export function SaleCard({ sale, onPress }: SaleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const itemCount = sale.items.length;
  const itemText = itemCount === 1 ? "item" : "items";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className="mb-3 overflow-hidden" variant="default">
        <View className="flex-row items-center justify-between">
          {/* Left: Amount and Items */}
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900 mb-1" variant="bold">
              GHS {sale.totalAmount.toFixed(2)}
            </Text>
            <View className="flex-row items-center gap-1">
              <ShoppingBag size={12} color="#9CA3AF" strokeWidth={2} />
              <Text className="text-xs text-gray-500">
                {itemCount} {itemText}
              </Text>
              {sale.customerName && (
                <>
                  <Text className="text-xs text-gray-400 mx-1">•</Text>
                  <Text className="text-xs text-gray-500" numberOfLines={1}>
                    {sale.customerName}
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Right: Date */}
          <View className="items-end">
            <View className="flex-row items-center gap-1 mb-1">
              <Calendar size={12} color="#9CA3AF" strokeWidth={2} />
              <Text className="text-xs text-gray-500">
                {formatDate(sale.createdAt)}
              </Text>
            </View>
            {sale.items.length > 0 && (
              <Text className="text-xs text-gray-400" numberOfLines={1}>
                {sale.items[0].itemName}
                {sale.items.length > 1 && ` +${sale.items.length - 1}`}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

import { Calendar, ShoppingBag, User } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { Sale } from "../lib/types/sale";
import { Card } from "./ui/Card";
import { Text } from "./ui/Text";

interface SaleCardProps {
  sale: Sale;
  onPress: () => void;
}

export function SaleCard({ sale, onPress }: SaleCardProps) {
  const formatDateWithTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: "numeric"
    });
    const timeStr = date.toLocaleTimeString("en-US", { 
      hour: "2-digit",
      minute: "2-digit"
    });
    return `${dateStr} • ${timeStr}`;
  };

  const itemCount = sale.items.length;
  const itemText = itemCount === 1 ? "item" : "items";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className="mb-4 overflow-hidden shadow-md" variant="default" padding="none">
        {/* Top Section with Amount */}
        <View className="bg-primary/5 px-5 py-4 border-b border-gray-100">
          <View>
            <Text className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 font-medium">
              Transaction
            </Text>
            <Text className="text-3xl font-bold text-gray-900" variant="bold">
              GHS {sale.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Middle Section - Metadata */}
        <View className="px-5 py-3.5 border-b border-gray-100">
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-start flex-[3] mr-4">
              <View className="w-9 h-9 bg-primary/10 rounded-full items-center justify-center mr-3 mt-0.5">
                <Calendar size={16} color="#b49a67" strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-0.5">Date & Time</Text>
                <Text className="text-sm font-semibold text-gray-900 leading-tight" variant="semibold" numberOfLines={2}>
                  {formatDateWithTime(sale.createdAt)}
                </Text>
              </View>
            </View>
            <View className="flex-row items-start flex-1">
              <View className="w-9 h-9 bg-primary/10 rounded-full items-center justify-center mr-3 mt-0.5">
                <ShoppingBag size={16} color="#b49a67" strokeWidth={2.5} />
              </View>
              <View>
                <Text className="text-xs text-gray-500 mb-0.5">Items</Text>
                <Text className="text-sm font-semibold text-gray-900" variant="semibold">
                  {itemCount} {itemText}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customer Section */}
        {sale.customerName && (
          <View className="px-5 py-3 bg-gray-50/50 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-9 h-9 bg-primary/10 rounded-full items-center justify-center mr-3">
                <User size={16} color="#b49a67" strokeWidth={2.5} />
              </View>
              <View>
                <Text className="text-xs text-gray-500 mb-0.5">Customer</Text>
                <Text className="text-sm font-semibold text-gray-900" variant="semibold">
                  {sale.customerName}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Items Preview Section */}
        <View className="px-5 py-4">
          <Text className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-medium">
            Items Sold
          </Text>
          <View className="gap-3">
            {sale.items.slice(0, 3).map((item, index) => (
              <View key={index} className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-sm font-semibold text-gray-900 mb-0.5" variant="semibold" numberOfLines={1}>
                    {item.itemName}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Quantity: {item.quantity}
                  </Text>
                </View>
                <Text className="text-sm font-bold text-primary" variant="bold">
                  GHS {item.total.toFixed(2)}
                </Text>
              </View>
            ))}
            {sale.items.length > 3 && (
              <View className="mt-1 pt-2 border-t border-gray-100">
                <Text className="text-xs text-gray-500 text-center font-medium">
                  +{sale.items.length - 3} more {sale.items.length - 3 === 1 ? 'item' : 'items'}
                </Text>
              </View>
            )}
          </View>
        </View>

      </Card>
    </TouchableOpacity>
  );
}

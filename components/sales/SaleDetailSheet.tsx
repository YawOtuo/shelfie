import { ScrollView, View } from "react-native";
import { BottomSheet } from "../ui/BottomSheet";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { colors } from "../../lib/colors";
import { Sale } from "../../lib/types/sale";

interface SaleDetailSheetProps {
  visible: boolean;
  sale: Sale | null;
  onClose: () => void;
}

export function SaleDetailSheet({ visible, sale, onClose }: SaleDetailSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Sale Details"
      height={500}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {sale && (
          <View className="px-6 pt-4">
            {/* Total */}
            <Card
              className="mb-4"
              style={{ backgroundColor: colors.primary[100] }}
            >
              <Text className="text-xs text-gray-600 mb-1">Total Amount</Text>
              <Text className="text-2xl text-gray-900" variant="bold">
                GHS {(sale.totalAmount || 0).toFixed(2)}
              </Text>
            </Card>

            {/* Customer */}
            {sale.customerName && (
              <View className="mb-4">
                <Text className="text-sm text-gray-700 mb-1" variant="medium">
                  Customer
                </Text>
                <Text className="text-base text-gray-900">
                  {sale.customerName}
                </Text>
              </View>
            )}

            {/* Items */}
            <View className="mb-4">
              <Text className="text-sm text-gray-700 mb-3" variant="medium">
                Items ({sale.items.length})
              </Text>
              {sale.items.map((item, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                >
                  <View className="flex-1">
                    <Text className="text-base text-gray-900" variant="medium">
                      {item.itemName}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {item.quantity} × GHS {(item.unitPrice || 0).toFixed(2)}
                    </Text>
                  </View>
                  <Text className="text-base text-gray-900" variant="semibold">
                    GHS {(item.total || 0).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Notes */}
            {sale.notes && (
              <View className="mb-4">
                <Text className="text-sm text-gray-700 mb-1" variant="medium">
                  Notes
                </Text>
                <Text className="text-base text-gray-900">
                  {sale.notes}
                </Text>
              </View>
            )}

            {/* Date */}
            <View>
              <Text className="text-sm text-gray-700 mb-1" variant="medium">
                Date
              </Text>
              <Text className="text-base text-gray-900">
                {new Date(sale.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </BottomSheet>
  );
}

import { DollarSign, ShoppingBag, TrendingUp } from "lucide-react-native";
import { View, Platform } from "react-native";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { colors } from "../../lib/colors";

interface SalesStatsProps {
  todayRevenue: number;
  totalRevenue: number;
  totalSales: number;
}

export function SalesStats({ todayRevenue, totalRevenue, totalSales }: SalesStatsProps) {
  return (
    <View className="px-5 pt-4 pb-6">
      <View className="flex-row gap-3 mb-4">
        <Card
          className="flex-1"
          style={{
            backgroundColor: colors.primary[50],
            ...Platform.select({
              ios: {
                shadowColor: colors.gray[400],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              },
              android: {
                elevation: 2,
              },
            }),
          }}
        >
          <View className="flex-row items-center mb-2">
            <View 
              className="w-7 h-7 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.white }}
            >
              <DollarSign size={16} color={colors.primary.DEFAULT} strokeWidth={2.5} />
            </View>
            <Text className="text-xs text-gray-600 ml-2" variant="medium">Today's Revenue</Text>
          </View>
          <Text className="text-xl text-gray-900" variant="bold">
            GHS {(todayRevenue || 0).toFixed(2)}
          </Text>
        </Card>
        <Card
          className="flex-1"
          style={{
            backgroundColor: colors.gray[50],
            ...Platform.select({
              ios: {
                shadowColor: colors.gray[400],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              },
              android: {
                elevation: 2,
              },
            }),
          }}
        >
          <View className="flex-row items-center mb-2">
            <View 
              className="w-7 h-7 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.white }}
            >
              <TrendingUp size={16} color={colors.gray[500]} strokeWidth={2.5} />
            </View>
            <Text className="text-xs text-gray-600 ml-2" variant="medium">All Time</Text>
          </View>
          <Text className="text-xl text-gray-900" variant="bold">
            GHS {(totalRevenue || 0).toFixed(2)}
          </Text>
        </Card>
      </View>
      <Card
        style={{
          backgroundColor: colors.white,
          ...Platform.select({
            ios: {
              shadowColor: colors.gray[400],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 2,
            },
          }),
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View 
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.gray[100] }}
            >
              <ShoppingBag size={18} color={colors.gray[500]} strokeWidth={2.5} />
            </View>
            <View className="ml-3">
              <Text className="text-xs text-gray-500 mb-0.5">Total Transactions</Text>
              <Text className="text-lg text-gray-900" variant="bold">
                {totalSales} sales
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}

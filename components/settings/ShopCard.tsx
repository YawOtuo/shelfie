import { TouchableOpacity, View, Platform } from "react-native";
import { Building2, ChevronRight, MapPin, Phone, Mail } from "lucide-react-native";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { colors } from "../../lib/colors";

interface Shop {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface ShopCardProps {
  shop: Shop;
  onPress: () => void;
}

export function ShopCard({ shop, onPress }: ShopCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
    >
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
        <View className="p-4">
          <View className="flex-row items-center mb-3">
            <View 
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: colors.primary[100] }}
            >
              <Building2 color={colors.primary.DEFAULT} size={20} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-sm text-gray-900 mr-2" variant="semibold">
                  {shop.name || "Unnamed Shop"}
                </Text>
                <View 
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: colors.primary[100] }}
                >
                  <Text className="text-[10px] text-primary" variant="medium">
                    Active
                  </Text>
                </View>
              </View>
              <Text className="text-[10px] text-gray-500">
                Tap to view all shops
              </Text>
            </View>
            <ChevronRight color={colors.gray[400]} size={20} />
          </View>
          
          {(shop.address || shop.phone || shop.email) && (
            <View 
              className="pt-3 mt-2"
              style={{ 
                borderTopWidth: 1,
                borderTopColor: colors.gray[100],
              }}
            >
              {shop.address && (
                <View className="flex-row items-center mb-2">
                  <MapPin color={colors.gray[400]} size={12} />
                  <Text className="text-[10px] text-gray-600 ml-2 flex-1" numberOfLines={1}>
                    {shop.address}
                  </Text>
                </View>
              )}
              {shop.phone && (
                <View className="flex-row items-center mb-2">
                  <Phone color={colors.gray[400]} size={12} />
                  <Text className="text-[10px] text-gray-600 ml-2">
                    {shop.phone}
                  </Text>
                </View>
              )}
              {shop.email && (
                <View className="flex-row items-center">
                  <Mail color={colors.gray[400]} size={12} />
                  <Text className="text-[10px] text-gray-600 ml-2 flex-1" numberOfLines={1}>
                    {shop.email}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

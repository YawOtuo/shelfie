import { View, TouchableOpacity, Platform } from "react-native";
import { Building2, Mail, Phone, MapPin, Globe, Check } from "lucide-react-native";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";
import { colors } from "../../lib/colors";

interface Shop {
  id: number;
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface ShopListItemProps {
  shop: Shop;
  isCurrentShop: boolean;
  onSwitchShop: (shop: Shop) => void;
  isLoading?: boolean;
}

export function ShopListItem({
  shop,
  isCurrentShop,
  onSwitchShop,
  isLoading = false,
}: ShopListItemProps) {
  return (
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
        <View className="flex-row items-start mb-3">
          <View 
            className="w-12 h-12 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: colors.primary[100] }}
          >
            <Building2 color={colors.primary.DEFAULT} size={20} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center mb-1 flex-wrap">
              <Text className="text-sm text-gray-900 mr-2" variant="semibold">
                {shop.name || "Unnamed Shop"}
              </Text>
              {isCurrentShop && (
                <View 
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: colors.primary[100] }}
                >
                  <Text className="text-[10px] text-primary" variant="medium">
                    Active
                  </Text>
                </View>
              )}
            </View>
            {shop.description && (
              <Text className="text-xs text-gray-600 mb-2">
                {shop.description}
              </Text>
            )}

            {/* Shop Details */}
            {(shop.address || shop.phone || shop.email || shop.website) && (
              <View 
                className="pt-2 mt-2"
                style={{ 
                  borderTopWidth: 1,
                  borderTopColor: colors.gray[100],
                }}
              >
                <View style={{ gap: 6 }}>
                  {shop.address && (
                    <View className="flex-row items-center">
                      <MapPin color={colors.gray[400]} size={12} />
                      <Text className="text-[10px] text-gray-600 ml-2 flex-1" numberOfLines={1}>
                        {shop.address}
                      </Text>
                    </View>
                  )}
                  {shop.phone && (
                    <View className="flex-row items-center">
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
                  {shop.website && (
                    <View className="flex-row items-center">
                      <Globe color={colors.gray[400]} size={12} />
                      <Text className="text-[10px] text-primary ml-2 flex-1" numberOfLines={1}>
                        {shop.website}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Action Button */}
        <View className="mt-3">
          {!isCurrentShop ? (
            <Button
              onPress={() => onSwitchShop(shop)}
              variant="primary"
              size="sm"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              <View className="flex-row items-center">
                <Check color={colors.white} size={14} style={{ marginRight: 6 }} />
                <Text className="text-white text-xs" variant="medium">
                  Switch to Shop
                </Text>
              </View>
            </Button>
          ) : (
            <View 
              className="flex-row items-center justify-center py-2 px-4 rounded-lg"
              style={{ backgroundColor: colors.primary[100] }}
            >
              <Check color={colors.primary.DEFAULT} size={14} style={{ marginRight: 6 }} />
              <Text className="text-primary text-xs" variant="medium">
                Currently Active
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

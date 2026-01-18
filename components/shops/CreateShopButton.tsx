import { TouchableOpacity, View, Platform } from "react-native";
import { Plus } from "lucide-react-native";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { colors } from "../../lib/colors";

interface CreateShopButtonProps {
  onPress: () => void;
}

export function CreateShopButton({ onPress }: CreateShopButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Card
        className="border-2 border-dashed overflow-hidden"
        style={{
          borderColor: colors.primary[300],
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
        <View className="p-4">
          <View className="flex-row items-center justify-center">
            <View 
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: colors.primary[100] }}
            >
              <Plus color={colors.primary.DEFAULT} size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-primary text-center" variant="semibold">
                Create a New Shop
              </Text>
              <Text className="text-xs text-gray-500 text-center mt-0.5">
                Add another shop to manage
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

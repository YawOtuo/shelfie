import { View } from "react-native";
import { BottomSheet } from "../ui/BottomSheet";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Text } from "../ui/Text";

interface QuantityRefillSheetProps {
  visible: boolean;
  quantity: string;
  isLoading: boolean;
  onClose: () => void;
  onQuantityChange: (value: string) => void;
  onConfirm: () => void;
}

export function QuantityRefillSheet({
  visible,
  quantity,
  isLoading,
  onClose,
  onQuantityChange,
  onConfirm,
}: QuantityRefillSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Refill Quantity"
      height={300}
    >
      <View className="px-6 py-4">
        <Text className="text-gray-600 text-sm mb-4">
          How many items would you like to add?
        </Text>
        <Input
          label="Quantity to Add"
          value={quantity}
          onChangeText={onQuantityChange}
          placeholder="Enter amount"
          keyboardType="numeric"
          className="mb-6"
        />
        <View className="gap-3">
          <Button
            onPress={onConfirm}
            loading={isLoading}
            disabled={isLoading}
            size="sm"
            className="w-full"
          >
            <Text className="text-sm" variant="medium">Refill Quantity</Text>
          </Button>
          <Button
            onPress={onClose}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={isLoading}
          >
            <Text className="text-sm" variant="medium">Cancel</Text>
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}

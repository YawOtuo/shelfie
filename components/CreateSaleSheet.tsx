import { Minus, Plus, X } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomSheet } from "./ui/BottomSheet";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Text } from "./ui/Text";
import { CreateSaleInput, SaleItem } from "../lib/types/sale";
import { Item } from "../lib/types/item";
import { colors } from "../lib/colors";

interface CreateSaleSheetProps {
  visible: boolean;
  items: Item[];
  onClose: () => void;
  onCreate: (sale: CreateSaleInput) => void;
}

export function CreateSaleSheet({
  visible,
  items,
  onClose,
  onCreate,
}: CreateSaleSheetProps) {
  const [selectedItems, setSelectedItems] = useState<
    Array<{ item: Item; quantity: number; unitPrice: number }>
  >([]);
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      initializedRef.current = false;
      setSelectedItems([]);
      setCustomerName("");
      setNotes("");
      setSearchQuery("");
      return;
    }
    if (!initializedRef.current) {
      initializedRef.current = true;
    }
  }, [visible]);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addItem = (item: Item) => {
    const existing = selectedItems.find((si) => si.item.id === item.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((si) =>
          si.item.id === item.id
            ? { ...si, quantity: si.quantity + 1 }
            : si
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        { item, quantity: 1, unitPrice: 0 },
      ]);
    }
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setSelectedItems(
      selectedItems.map((si) => {
        if (si.item.id === itemId) {
          const newQuantity = Math.max(0, si.quantity + delta);
          if (newQuantity === 0) {
            return null;
          }
          return { ...si, quantity: newQuantity };
        }
        return si;
      }).filter(Boolean) as Array<{ item: Item; quantity: number; unitPrice: number }>
    );
  };

  const updatePrice = (itemId: number, price: string) => {
    const priceNum = parseFloat(price) || 0;
    setSelectedItems(
      selectedItems.map((si) =>
        si.item.id === itemId ? { ...si, unitPrice: priceNum } : si
      )
    );
  };

  const removeItem = (itemId: number) => {
    setSelectedItems(selectedItems.filter((si) => si.item.id !== itemId));
  };

  const totalAmount = selectedItems.reduce(
    (sum, si) => sum + si.quantity * si.unitPrice,
    0
  );

  const handleCreate = () => {
    if (selectedItems.length === 0) {
      alert("Please add at least one item to the sale");
      return;
    }

    const hasInvalidPrice = selectedItems.some((si) => si.unitPrice <= 0);
    if (hasInvalidPrice) {
      alert("Please set a valid price for all items");
      return;
    }

    const saleItems: Omit<SaleItem, "total">[] = selectedItems.map((si) => ({
      itemId: si.item.id.toString(),
      itemName: si.item.name,
      quantity: si.quantity,
      unitPrice: si.unitPrice,
    }));

    onCreate({
      items: saleItems,
      customerName: customerName.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Create Sale"
      height={700}
      showCloseButton={true}
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="px-6 pt-4">
            {/* Search Items */}
            <View className="mb-4">
              <Input
                label="Search Items"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by name or SKU..."
                className="mb-3"
              />
              <Text className="text-sm font-medium text-gray-700 mb-2" variant="medium">
                Available Items
              </Text>
              <View className="max-h-40">
                <ScrollView className="border border-gray-200 rounded-2xl">
                  {filteredItems.length === 0 ? (
                    <View className="p-4">
                      <Text className="text-sm text-gray-500 text-center">
                        No items found
                      </Text>
                    </View>
                  ) : (
                    filteredItems.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => addItem(item)}
                        className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                        activeOpacity={0.7}
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-900" variant="medium">
                              {item.name}
                            </Text>
                            <Text className="text-xs text-gray-500">
                              Stock: {item.quantity} {item.unit_price && typeof item.unit_price === 'number' ? `• Unit Price: GHS ${item.unit_price.toFixed(2)}` : ''} {item.category && `• ${item.category}`}
                            </Text>
                          </View>
                          <Plus size={18} color={colors.primary.DEFAULT} />
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            </View>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2" variant="medium">
                  Selected Items
                </Text>
                {selectedItems.map((si) => (
                  <Card key={si.item.id} className="mb-2" variant="outline" padding="md">
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-gray-900" variant="medium">
                          {si.item.name}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Available: {si.item.quantity}
                        </Text>
                      </View>
                        <TouchableOpacity
                          onPress={() => removeItem(si.item.id)}
                          className="p-1"
                        >
                          <X size={16} color={colors.red[500]} />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-end gap-3">
                      <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1" variant="medium">
                          Quantity
                        </Text>
                        <View className="flex-row items-center bg-gray-100 rounded-xl">
                          <TouchableOpacity
                            onPress={() => updateQuantity(si.item.id, -1)}
                            className="p-2"
                            disabled={si.quantity <= 1}
                          >
                            <Minus
                              size={16}
                              color={si.quantity <= 1 ? colors.gray[300] : colors.gray[500]}
                            />
                          </TouchableOpacity>
                          <Text className="px-4 py-2 text-sm font-medium text-gray-900" variant="medium">
                            {si.quantity}
                          </Text>
                          <TouchableOpacity
                            onPress={() => updateQuantity(si.item.id, 1)}
                            className="p-2"
                            disabled={si.quantity >= si.item.quantity}
                          >
                            <Plus
                              size={16}
                              color={
                                si.quantity >= si.item.quantity ? colors.gray[300] : colors.gray[500]
                              }
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View className="flex-1">
                        <Input
                          label="Price"
                          value={si.unitPrice > 0 ? si.unitPrice.toString() : (si.item.unit_price?.toString() || "")}
                          onChangeText={(text) => updatePrice(si.item.id, text)}
                          placeholder={si.item.unit_price?.toString() || "0.00"}
                          keyboardType="numeric"
                          size="sm"
                        />
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            )}

            {/* Customer Name */}
            <Input
              label="Customer Name (Optional)"
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Enter customer name"
              className="mb-4"
            />

            {/* Notes */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1" variant="medium">
                Notes
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about this sale..."
                multiline
                numberOfLines={3}
                className="w-full rounded-2xl px-4 py-3 border border-gray-300 bg-white text-base text-gray-900"
                placeholderTextColor="#9CA3AF"
                style={{ textAlignVertical: "top" }}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer with Total and Create Button */}
        <View className="px-6 pb-6 pt-4 border-t border-gray-100 bg-white">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900" variant="semibold">
              Total:
            </Text>
            <Text className="text-2xl font-bold text-gray-900" variant="bold">
              GHS {totalAmount.toFixed(2)}
            </Text>
          </View>
          <Button onPress={handleCreate} size="lg" className="w-full">
            Create Sale
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}


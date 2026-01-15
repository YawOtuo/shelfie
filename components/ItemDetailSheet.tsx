import { Edit, Trash2 } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomSheet } from "./ui/BottomSheet";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Text } from "./ui/Text";
import { CreateItemInput, Item, UpdateItemInput } from "../lib/types/item";

interface ItemDetailSheetProps {
  visible: boolean;
  item: Item | null;
  mode: "create" | "edit" | "view";
  onClose: () => void;
  onSave: (data: CreateItemInput | UpdateItemInput) => void;
  onDelete?: (id: string) => void;
  onEdit?: () => void;
}

export function ItemDetailSheet({
  visible,
  item,
  mode,
  onClose,
  onSave,
  onDelete,
  onEdit,
}: ItemDetailSheetProps) {
  const isEditMode = mode === "edit" || mode === "create";
  const isViewMode = mode === "view";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [unitPrice, setUnitPrice] = useState("0");
  const [refillCount, setRefillCount] = useState("5");
  const [imageUrl, setImageUrl] = useState("");

  // Note: Image picker removed as backend uses image_url string, not array

  const initializedRef = useRef<string>("");

  useEffect(() => {
    if (!visible) {
      initializedRef.current = "";
      return;
    }

    const key = `${item?.id || "create"}-${mode}`;
    
    // Skip if already initialized for this key
    if (initializedRef.current === key) {
      return;
    }

    if (item && mode !== "create") {
      setName(item.name);
      setDescription(item.description || "");
      setCategory(item.category || "");
      setQuantity(item.quantity.toString());
      setUnitPrice(item.unit_price?.toString() || "0");
      setRefillCount(item.refill_count?.toString() || "5");
      setImageUrl(item.image_url || "");
      initializedRef.current = key;
    } else if (mode === "create") {
      setName("");
      setDescription("");
      setCategory("");
      setQuantity("0");
      setUnitPrice("0");
      setRefillCount("5");
      setImageUrl("");
      initializedRef.current = key;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, item?.id, mode]);

  const handleSave = () => {
    if (!name.trim()) {
      alert("Item name is required");
      return;
    }

    const quantityNum = parseInt(quantity, 10);
    const unitPriceNum = parseFloat(unitPrice);
    const refillCountNum = parseInt(refillCount, 10);

    if (isNaN(quantityNum) || quantityNum < 0) {
      alert("Quantity must be a valid number");
      return;
    }

    if (isNaN(unitPriceNum) || unitPriceNum < 0) {
      alert("Unit price must be a valid number");
      return;
    }

    if (isNaN(refillCountNum) || refillCountNum < 0) {
      alert("Refill count must be a valid number");
      return;
    }

    const itemData: CreateItemInput | UpdateItemInput = {
      ...(mode === "edit" && item ? { id: item.id } : {}),
      name: name.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      quantity: quantityNum,
      unit_price: unitPriceNum,
      refill_count: refillCountNum,
      image_url: imageUrl.trim() || undefined,
    };

    onSave(itemData);
    onClose();
  };

  const handleDelete = () => {
    if (item && onDelete) {
      onDelete(item.id.toString());
      onClose();
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={mode === "create" ? "Create Item" : mode === "edit" ? "Edit Item" : "Item Details"}
      height={600}
      showCloseButton={true}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="px-6 pt-4">
          {/* Name */}
          <Input
            label="Item Name *"
            value={name}
            onChangeText={setName}
            placeholder="Enter item name"
            editable={isEditMode}
            className="mb-4"
          />

          {/* Description */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1" variant="medium">
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              editable={isEditMode}
              multiline
              numberOfLines={3}
              className="w-full rounded-2xl px-4 py-3 border border-gray-300 bg-white text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
              style={{ textAlignVertical: "top" }}
            />
          </View>

          {/* Category */}
          <View className="mb-4">
            <Input
              label="Category"
              value={category}
              onChangeText={setCategory}
              placeholder="Category"
              editable={isEditMode}
            />
          </View>

          {/* Quantity, Unit Price, and Refill Count Row */}
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Input
                label="Quantity *"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="0"
                editable={isEditMode}
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <Input
                label="Unit Price *"
                value={unitPrice}
                onChangeText={setUnitPrice}
                placeholder="0.00"
                editable={isEditMode}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View className="mb-4">
            <Input
              label="Refill Count"
              value={refillCount}
              onChangeText={setRefillCount}
              placeholder="5"
              editable={isEditMode}
              keyboardType="numeric"
            />
          </View>

          {/* Image URL Section */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2" variant="medium">
              Image URL
            </Text>
            <Input
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://example.com/image.jpg"
              editable={isEditMode}
              keyboardType="url"
            />
            {imageUrl && (
              <View className="mt-2">
                <Image
                  source={{ uri: imageUrl }}
                  className="w-full h-40 rounded-xl"
                  resizeMode="cover"
                />
              </View>
            )}
          </View>

          {/* Action Buttons */}
          {isViewMode && onEdit && (
            <View className="gap-3 mt-4">
              <Button onPress={onEdit} size="lg" className="w-full">
                <View className="flex-row items-center justify-center">
                  <Edit size={18} color="#FFFFFF" />
                  <Text className="text-white ml-2" variant="semibold">
                    Edit Item
                  </Text>
                </View>
              </Button>
            </View>
          )}
          {isEditMode && (
            <View className="gap-3 mt-4">
              <Button onPress={handleSave} size="lg" className="w-full">
                {mode === "create" ? "Create Item" : "Save Changes"}
              </Button>
              {mode === "edit" && item && onDelete && (
                <Button
                  onPress={handleDelete}
                  variant="danger"
                  size="lg"
                  className="w-full"
                >
                  <View className="flex-row items-center justify-center">
                    <Trash2 size={18} color="#FFFFFF" />
                    <Text className="text-white ml-2" variant="semibold">
                      Delete Item
                    </Text>
                  </View>
                </Button>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}


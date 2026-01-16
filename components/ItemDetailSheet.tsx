import { Edit, Trash2, ImageIcon } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import {
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { BottomSheet } from "./ui/BottomSheet";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Text } from "./ui/Text";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { useToast } from "./ui/ToastProvider";
import { CreateItemInput, Item, UpdateItemInput } from "../lib/types/item";

interface ItemDetailSheetProps {
  visible: boolean;
  item: Item | null;
  mode: "create" | "edit" | "view";
  onClose: () => void;
  onSave: (data: CreateItemInput | UpdateItemInput) => void;
  onDelete?: (id: string) => void;
  onEdit?: () => void;
  isLoading?: boolean;
}

export function ItemDetailSheet({
  visible,
  item,
  mode,
  onClose,
  onSave,
  onDelete,
  onEdit,
  isLoading = false,
}: ItemDetailSheetProps) {
  const isEditMode = mode === "edit" || mode === "create";
  const isViewMode = mode === "view";
  const { showError } = useToast();

  // Helper function to capitalize labels for view mode
  const capitalizeLabel = (label: string): string => {
    return label.toUpperCase();
  };

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

  const handlePickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        showError("Permission to access camera roll is required!");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Set the first selected image URI
        setImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showError("Failed to pick image");
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
      {isLoading && (
        <View className="absolute inset-0 bg-white/80 z-50 items-center justify-center">
          <LoadingSpinner size="large" text="Saving item..." />
        </View>
      )}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        pointerEvents={isLoading ? "none" : "auto"}
      >
        <View className="px-6 pt-4">
          {/* Name */}
          {isViewMode ? (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-500 mb-1" variant="medium">
                {capitalizeLabel("Item Name *")}
              </Text>
              <Text className="text-base text-gray-900">{name || "—"}</Text>
            </View>
          ) : (
            <Input
              label="Item Name *"
              value={name}
              onChangeText={setName}
              placeholder="Enter item name"
              className="mb-4"
            />
          )}

          {/* Description */}
          {isViewMode ? (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-500 mb-1" variant="medium">
                {capitalizeLabel("Description")}
              </Text>
              <Text className="text-base text-gray-900">{description || "—"}</Text>
            </View>
          ) : (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-500 mb-1" variant="medium">
                Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                multiline
                numberOfLines={3}
                className="w-full rounded-2xl px-4 py-3 border border-gray-300 bg-white text-base text-gray-900"
                placeholderTextColor="#9CA3AF"
                style={{ textAlignVertical: "top" }}
              />
            </View>
          )}

          {/* Category */}
          {isViewMode ? (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-500 mb-1" variant="medium">
                {capitalizeLabel("Category")}
              </Text>
              <Text className="text-base text-gray-900">{category || "—"}</Text>
            </View>
          ) : (
            <View className="mb-4">
              <Input
                label="Category"
                value={category}
                onChangeText={setCategory}
                placeholder="Category"
              />
            </View>
          )}

          {/* Quantity, Unit Price, and Refill Count Row */}
          {isViewMode ? (
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500 mb-1" variant="medium">
                  {capitalizeLabel("Quantity *")}
                </Text>
                <Text className="text-base text-gray-900">{quantity || "—"}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-500 mb-1" variant="medium">
                  {capitalizeLabel("Unit Price *")}
                </Text>
                <Text className="text-base text-gray-900">{unitPrice || "—"}</Text>
              </View>
            </View>
          ) : (
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Input
                  label="Quantity *"
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Unit Price *"
                  value={unitPrice}
                  onChangeText={setUnitPrice}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          )}

          {isViewMode ? (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-500 mb-1" variant="medium">
                {capitalizeLabel("Refill Count")}
              </Text>
              <Text className="text-base text-gray-900">{refillCount || "—"}</Text>
              <Text className="text-xs text-gray-500 mt-1">
                An alert will be generated when quantity falls below this value
              </Text>
            </View>
          ) : (
            <View className="mb-4">
              <Input
                label="Refill Count"
                value={refillCount}
                onChangeText={setRefillCount}
                placeholder="5"
                keyboardType="numeric"
              />
              <Text className="text-xs text-gray-500 mt-1">
                An alert will be generated when quantity falls below this value
              </Text>
            </View>
          )}

          {/* Image Section */}
          <View className="mb-4">
            {isViewMode ? (
              <>
                <Text className="text-sm font-medium text-gray-500 mb-1" variant="medium">
                  {capitalizeLabel("Image")}
                </Text>
                {imageUrl ? (
                  <>
                    <Image
                      source={{ uri: imageUrl }}
                      className="w-full h-40 rounded-xl mt-2"
                      resizeMode="cover"
                    />
                  </>
                ) : (
                  <Text className="text-base text-gray-400 mb-2">No image</Text>
                )}
              </>
            ) : (
              <>
                <Text className="text-sm font-medium text-gray-500 mb-2" variant="medium">
                  Image
                </Text>
                <TouchableOpacity
                  onPress={handlePickImage}
                  className="w-full rounded-2xl px-4 py-3 border border-gray-300 bg-white items-center justify-center flex-row"
                  activeOpacity={0.7}
                >
                  <ImageIcon size={20} color="#6B7280" />
                  <Text className="text-base text-gray-700 ml-2">
                    {imageUrl ? "Change Image" : "Select Image from Gallery"}
                  </Text>
                </TouchableOpacity>
                {imageUrl && (
                  <View className="mt-3">
                    <Image
                      source={{ uri: imageUrl }}
                      className="w-full h-40 rounded-xl"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => setImageUrl("")}
                      className="mt-2 items-center"
                    >
                      <Text className="text-sm text-red-500">Remove Image</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
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
              <Button 
                onPress={handleSave} 
                size="lg" 
                className="w-full"
                disabled={isLoading}
                loading={isLoading}
              >
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


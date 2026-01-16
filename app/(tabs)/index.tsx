import { StatusBar } from "expo-status-bar";
import { Plus } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components/Header";
import { ItemCard } from "../../components/ItemCard";
import { ItemDetailSheet } from "../../components/ItemDetailSheet";
import { NoShopConnected } from "../../components/NoShopConnected";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { SearchInput } from "../../components/ui/SearchInput";
import { Text } from "../../components/ui/Text";
import { useToast } from "../../components/ui/ToastProvider";
import { useRefillInventory } from "../../lib/hooks/useInventory";
import { useCreateItem, useDeleteItem, useItems, useSearchItems, useUpdateItem } from "../../lib/hooks/useItems";
import { useAuthStore } from "../../lib/stores/authStore";
import { CreateItemInput, Item, UpdateItemInput } from "../../lib/types/item";

export default function InventoryScreen() {
  const { user } = useAuthStore();
  const shopId = user?.shopId;
  const userId = user?.id;
  const { showSuccess, showError } = useToast();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [sheetMode, setSheetMode] = useState<"create" | "edit" | "view">("view");
  const [sheetVisible, setSheetVisible] = useState(false);
  const [quantitySheetVisible, setQuantitySheetVisible] = useState(false);
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [refillingItemId, setRefillingItemId] = useState<number | null>(null);

  // Fetch items
  const { data: itemsData, isLoading, error, refetch, isRefetching } = useItems(
    page,
    25,
    !!shopId
  );
  
  // Search items
  const { data: searchData, isLoading: isSearching } = useSearchItems(
    searchQuery,
    !!searchQuery && !!shopId
  );

  // Mutations
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();
  const deleteItemMutation = useDeleteItem();
  const refillInventoryMutation = useRefillInventory();

  // Determine which items to display
  const items = useMemo(() => {
    if (searchQuery && searchData) {
      return searchData;
    }
    return itemsData?.items || [];
  }, [searchQuery, searchData, itemsData]);

  const filteredItems = items; // Already filtered by backend

  const handleCreateItem = () => {
    setSelectedItem(null);
    setSheetMode("create");
    setSheetVisible(true);
  };

  const handleViewItem = (item: Item) => {
    setSelectedItem(item);
    setSheetMode("view");
    setSheetVisible(true);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setSheetMode("edit");
    setSheetVisible(true);
  };

  const handleSaveItem = async (data: CreateItemInput | UpdateItemInput) => {
    if (!shopId || !userId) {
      showError("Shop ID or User ID not available");
      return;
    }

    try {
      if ("id" in data) {
        // Update existing item
        await updateItemMutation.mutateAsync({
          id: Number(data.id),
          data: {
            name: data.name,
            description: data.description,
            category: data.category,
            quantity: data.quantity,
            unit_price: data.unit_price,
            refill_count: data.refill_count,
            image_url: data.image_url,
            shopId: shopId,
          },
        });
        showSuccess("Item updated successfully");
      } else {
        // Create new item
        await createItemMutation.mutateAsync({
          ...data,
          shopId: shopId,
        });
        showSuccess("Item created successfully");
      }
      setSheetVisible(false);
      setSelectedItem(null);
    } catch (error: any) {
      showError(error?.response?.data?.message || "Failed to save item");
    }
  };

  const handleDeleteItem = async (id: number) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteItemMutation.mutateAsync(id);
              Alert.alert("Success", "Item deleted successfully");
              setSheetVisible(false);
              setSelectedItem(null);
            } catch (error: any) {
              Alert.alert("Error", error?.response?.data?.message || "Failed to delete item");
            }
          },
        },
      ]
    );
  };

  const handleRefillQuantity = (item: Item) => {
    setRefillingItemId(item.id);
    setQuantityToAdd("");
    setQuantitySheetVisible(true);
  };

  const handleConfirmRefillQuantity = async () => {
    if (!refillingItemId || !shopId || !userId) {
      Alert.alert("Error", "Missing required information");
      return;
    }

    const addAmount = parseInt(quantityToAdd, 10);
    if (isNaN(addAmount) || addAmount <= 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }

    try {
      await refillInventoryMutation.mutateAsync({
        action: "refill",
        quantity: addAmount,
        date: new Date().toISOString(),
        cost: 0, // You may want to add cost input
        itemId: refillingItemId,
        userId: userId,
        shopId: shopId,
      });
      Alert.alert("Success", "Quantity refilled successfully");
      setQuantitySheetVisible(false);
      setQuantityToAdd("");
      setRefillingItemId(null);
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Failed to refill quantity");
    }
  };

  const onRefresh = () => {
    refetch();
  };

  // Show loading state
  if (isLoading && !items.length) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
        <Header />
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" />
          <Text className="text-gray-600 mt-4">Loading items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error && !items.length) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
        <Header />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 text-center mb-4">
            {error instanceof Error ? error.message : "Failed to load items"}
          </Text>
          <Button onPress={() => refetch()} size="lg">
            Retry
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // Show message if no shop
  if (!shopId) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
        <Header />
        <NoShopConnected message="Please connect to a shop or create one to view inventory" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <StatusBar style="dark" />
      <Header />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
      >
        {/* Search Section */}
        <View className="px-5 pt-4 pb-6">
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search inventory..."
            onSearchPress={() => {
              // Search is handled automatically by useSearchItems hook
            }}
          />
        </View>

        {/* Items List */}
        <View className="px-5">
          {filteredItems.length === 0 ? (
            <EmptyState
              title={searchQuery ? "No items found" : "No items yet"}
              message={
                searchQuery
                  ? "Try adjusting your search"
                  : "Create your first item to get started"
              }
              action={
                !searchQuery ? (
                  <Button onPress={handleCreateItem} size="md">
                    Create Item
                  </Button>
                ) : undefined
              }
            />
          ) : (
             filteredItems.map((item: Item) => (
               <ItemCard
                 key={item.id}
                 item={item}
                 onPress={() => handleViewItem(item)}
               />
             ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleCreateItem}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Item Detail/Edit Sheet */}
      <ItemDetailSheet
        visible={sheetVisible}
        item={selectedItem}
        mode={sheetMode}
        onClose={() => {
          setSheetVisible(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveItem}
        onDelete={(id: string | number) => handleDeleteItem(Number(id))}
        onEdit={() => {
          if (selectedItem) {
            setSheetMode("edit");
          }
        }}
        isLoading={createItemMutation.isPending || updateItemMutation.isPending}
      />

      {/* Quantity Refill Sheet */}
      <BottomSheet
        visible={quantitySheetVisible}
        onClose={() => {
          setQuantitySheetVisible(false);
          setQuantityToAdd("");
          setRefillingItemId(null);
        }}
        title="Refill Quantity"
        height={300}
      >
        <View className="px-6 py-4">
          <Text className="text-gray-600 text-base mb-4">
            How many items would you like to add?
          </Text>
          <Input
            label="Quantity to Add"
            value={quantityToAdd}
            onChangeText={setQuantityToAdd}
            placeholder="Enter amount"
            keyboardType="numeric"
            className="mb-6"
          />
          <View className="gap-3">
            <Button
              onPress={handleConfirmRefillQuantity}
              loading={refillInventoryMutation.isPending}
              disabled={refillInventoryMutation.isPending}
              size="lg"
              className="w-full"
            >
              Refill Quantity
            </Button>
            <Button
              onPress={() => {
                setQuantitySheetVisible(false);
                setQuantityToAdd("");
                setRefillingItemId(null);
              }}
              variant="outline"
              size="lg"
              className="w-full"
              disabled={refillInventoryMutation.isPending}
            >
              Cancel
            </Button>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

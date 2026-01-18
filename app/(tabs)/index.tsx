import { StatusBar } from "expo-status-bar";
import { Plus } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components/Header";
import { ItemCard } from "../../components/ItemCard";
import { ItemDetailSheet } from "../../components/ItemDetailSheet";
import { NoShopConnected } from "../../components/NoShopConnected";
import { SwipeableTabWrapper } from "../../components/SwipeableTabWrapper";
import { FloatingActionButton, LoadingState, ErrorState } from "../../components/common";
import { QuantityRefillSheet } from "../../components/inventory";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { SearchInput } from "../../components/ui/SearchInput";
import { useToast } from "../../components/ui/ToastProvider";
import { colors } from "../../lib/colors";
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

  const filteredItems = items;

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

  const handleSaveItem = async (data: CreateItemInput | UpdateItemInput) => {
    if (!shopId || !userId) {
      showError("Shop ID or User ID not available");
      return;
    }

    try {
      if ("id" in data) {
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
              showSuccess("Item deleted successfully");
              setSheetVisible(false);
              setSelectedItem(null);
            } catch (error: any) {
              showError(error?.response?.data?.message || "Failed to delete item");
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
      showError("Missing required information");
      return;
    }

    const addAmount = parseInt(quantityToAdd, 10);
    if (isNaN(addAmount) || addAmount <= 0) {
      showError("Please enter a valid quantity");
      return;
    }

    try {
      await refillInventoryMutation.mutateAsync({
        action: "refill",
        quantity: addAmount,
        date: new Date().toISOString(),
        cost: 0,
        itemId: refillingItemId,
        userId: userId,
        shopId: shopId,
      });
      showSuccess("Quantity refilled successfully");
      setQuantitySheetVisible(false);
      setQuantityToAdd("");
      setRefillingItemId(null);
    } catch (error: any) {
      showError(error?.response?.data?.message || "Failed to refill quantity");
    }
  };

  const onRefresh = () => {
    refetch();
  };

  // Show loading state
  if (isLoading && !items.length) {
    return (
      <SwipeableTabWrapper tabIndex={0}>
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.white }} edges={["left", "right"]}>
          <StatusBar style="dark" />
          <Header />
          <LoadingState message="Loading items..." />
        </SafeAreaView>
      </SwipeableTabWrapper>
    );
  }

  // Show error state
  if (error && !items.length) {
    return (
      <SwipeableTabWrapper tabIndex={0}>
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.white }} edges={["left", "right"]}>
          <StatusBar style="dark" />
          <Header />
          <ErrorState
            message={error instanceof Error ? error.message : "Failed to load items"}
            onRetry={refetch}
          />
        </SafeAreaView>
      </SwipeableTabWrapper>
    );
  }

  // Show message if no shop
  if (!shopId) {
    return (
      <SwipeableTabWrapper tabIndex={0}>
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.white }} edges={["left", "right"]}>
          <StatusBar style="dark" />
          <Header />
          <NoShopConnected message="Please connect to a shop or create one to view inventory" />
        </SafeAreaView>
      </SwipeableTabWrapper>
    );
  }

  return (
    <SwipeableTabWrapper tabIndex={0}>
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.white }} edges={["left", "right"]}>
        <StatusBar style="dark" />
        <Header />
        <ScrollView
          className="flex-1"
          style={{ backgroundColor: colors.white }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
        >
          <View className="px-5 pt-4 pb-6">
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search inventory..."
              onSearchPress={() => {}}
            />
          </View>

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

        <FloatingActionButton
          onPress={handleCreateItem}
          icon={Plus}
        />

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

        <QuantityRefillSheet
          visible={quantitySheetVisible}
          quantity={quantityToAdd}
          isLoading={refillInventoryMutation.isPending}
          onClose={() => {
            setQuantitySheetVisible(false);
            setQuantityToAdd("");
            setRefillingItemId(null);
          }}
          onQuantityChange={setQuantityToAdd}
          onConfirm={handleConfirmRefillQuantity}
        />
      </SafeAreaView>
    </SwipeableTabWrapper>
  );
}

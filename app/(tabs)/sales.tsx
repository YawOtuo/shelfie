import { DollarSign, Plus, ShoppingBag, TrendingUp } from "lucide-react-native";
import { useState, useMemo } from "react";
import {
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateSaleSheet } from "../../components/CreateSaleSheet";
import { Header } from "../../components/Header";
import { NoShopConnected } from "../../components/NoShopConnected";
import { SaleCard } from "../../components/SaleCard";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { SearchInput } from "../../components/ui/SearchInput";
import { Text } from "../../components/ui/Text";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useItems } from "../../lib/hooks/useItems";
import { useRecentlySoldItems, useSellInventory } from "../../lib/hooks/useInventory";
import { useAuthStore } from "../../lib/stores/authStore";
import { Item } from "../../lib/types/item";
import { CreateSaleInput, Sale } from "../../lib/types/sale";
import { InventoryWithRelations } from "../../lib/types/inventory";

export default function SalesScreen() {
  const { user } = useAuthStore();
  const shopId = user?.shopId;
  const userId = user?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [createSaleVisible, setCreateSaleVisible] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleDetailVisible, setSaleDetailVisible] = useState(false);

  // Fetch data
  const { data: soldItemsData, isLoading: salesLoading, error: salesError, refetch: refetchSales } = useRecentlySoldItems(
    shopId || 0,
    !!shopId
  );
  
  const { data: itemsData, isLoading: itemsLoading } = useItems(1, 100, !!shopId);
  const items = itemsData?.items || [];

  // Mutations
  const sellInventoryMutation = useSellInventory();

  // Convert inventory records to Sale format
  const sales: Sale[] = useMemo(() => {
    if (!soldItemsData) return [];
    
    // Group by date or create individual sales from inventory records
    return soldItemsData.map((inventory: InventoryWithRelations) => {
      const item = inventory.Item;
      return {
        id: inventory.id.toString(),
        items: [{
          itemId: inventory.itemId.toString(),
          itemName: item?.name || "Unknown Item",
          quantity: inventory.quantity,
          unitPrice: inventory.cost / inventory.quantity, // Cost per unit
          total: inventory.cost,
        }],
        totalAmount: inventory.cost,
        customerName: undefined, // Not stored in inventory
        notes: undefined, // Not stored in inventory
        createdAt: inventory.date || inventory.createdAt,
        updatedAt: inventory.updatedAt,
      };
    });
  }, [soldItemsData]);

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.items.some((item) =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySales = sales.filter((sale) => {
    const saleDate = new Date(sale.createdAt);
    saleDate.setHours(0, 0, 0, 0);
    return saleDate.getTime() === today.getTime();
  });

  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalSales = sales.length;

  const handleCreateSale = async (saleInput: CreateSaleInput) => {
    if (!shopId || !userId) {
      Alert.alert("Error", "Shop ID or User ID not available");
      return;
    }

    try {
      // Create inventory records for each item sold
      const promises = saleInput.items.map((saleItem) => {
        const totalCost = saleItem.quantity * saleItem.unitPrice;
        return sellInventoryMutation.mutateAsync({
          action: "sell",
          quantity: saleItem.quantity,
          date: new Date().toISOString(),
          cost: totalCost,
          itemId: parseInt(saleItem.itemId),
          userId: userId,
          shopId: shopId,
        });
      });

      await Promise.all(promises);
      Alert.alert("Success", "Sale created successfully");
      setCreateSaleVisible(false);
      refetchSales();
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Failed to create sale");
    }
  };

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setSaleDetailVisible(true);
  };

  const onRefresh = () => {
    refetchSales();
  };

  // Show loading state
  if ((salesLoading || itemsLoading) && !sales.length) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
        <Header />
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" />
          <Text className="text-gray-600 mt-4">Loading sales...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (salesError && !sales.length) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
        <Header />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 text-center mb-4">
            {salesError instanceof Error ? salesError.message : "Failed to load sales"}
          </Text>
          <Button onPress={() => refetchSales()} size="lg">
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
        <NoShopConnected message="Please connect to a shop or create one to view sales" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <Header />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        refreshControl={
          <RefreshControl refreshing={salesLoading} onRefresh={onRefresh} />
        }
      >
        {/* Stats Section */}
        <View className="px-5 pt-4 pb-6">
          <View className="flex-row gap-3 mb-4">
            <View 
              className="flex-1 rounded-2xl p-4 shadow-md"
              style={{
                backgroundColor: '#FAF5F0',
              }}
            >
              <View className="flex-row items-center mb-2">
                <View className="w-7 h-7 rounded-full bg-white items-center justify-center">
                  <DollarSign size={16} color="#D2B48C" strokeWidth={2.5} />
                </View>
                <Text className="text-xs text-gray-600 ml-2 font-medium">Today's Revenue</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900" variant="bold">
                GHS {todayRevenue.toFixed(2)}
              </Text>
            </View>
            <View 
              className="flex-1 rounded-2xl p-4 shadow-md"
              style={{
                backgroundColor: '#F0F4F8',
              }}
            >
              <View className="flex-row items-center mb-2">
                <View className="w-7 h-7 rounded-full bg-white items-center justify-center">
                  <TrendingUp size={16} color="#64748B" strokeWidth={2.5} />
                </View>
                <Text className="text-xs text-gray-600 ml-2 font-medium">All Time</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900" variant="bold">
                GHS {totalRevenue.toFixed(2)}
              </Text>
            </View>
          </View>
          <View 
            className="rounded-2xl p-4 bg-white shadow-md"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center">
                  <ShoppingBag size={18} color="#6B7280" strokeWidth={2.5} />
                </View>
                <View className="ml-3">
                  <Text className="text-xs text-gray-500 mb-0.5">Total Transactions</Text>
                  <Text className="text-xl font-bold text-gray-900" variant="bold">
                    {totalSales} sales
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Search Section */}
        <View className="px-5 pb-6">
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search sales..."
            onSearchPress={() => {
              console.log("Search:", searchQuery);
            }}
          />
        </View>

        {/* Sales List */}
        <View className="px-5">
          {filteredSales.length === 0 ? (
            <EmptyState
              title={searchQuery ? "No sales found" : "No sales yet"}
              message={
                searchQuery
                  ? "Try adjusting your search"
                  : "Create your first sale to get started"
              }
              action={
                !searchQuery ? (
                  <Button
                    onPress={() => setCreateSaleVisible(true)}
                    size="md"
                  >
                    Create Sale
                  </Button>
                ) : undefined
              }
            />
          ) : (
            filteredSales.map((sale) => (
              <SaleCard
                key={sale.id}
                sale={sale}
                onPress={() => handleViewSale(sale)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setCreateSaleVisible(true)}
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

      {/* Create Sale Sheet */}
      <CreateSaleSheet
        visible={createSaleVisible}
        items={items}
        onClose={() => setCreateSaleVisible(false)}
        onCreate={handleCreateSale}
      />

      {/* Sale Detail Sheet */}
      <BottomSheet
        visible={saleDetailVisible}
        onClose={() => {
          setSaleDetailVisible(false);
          setSelectedSale(null);
        }}
        title="Sale Details"
        height={500}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {selectedSale && (
            <View className="px-6 pt-4">
              {/* Total */}
              <View className="bg-primary/10 rounded-2xl p-4 mb-4">
                <Text className="text-sm text-gray-600 mb-1">Total Amount</Text>
                <Text className="text-3xl font-bold text-gray-900" variant="bold">
                  GHS {selectedSale.totalAmount.toFixed(2)}
                </Text>
              </View>

              {/* Customer */}
              {selectedSale.customerName && (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-1" variant="medium">
                    Customer
                  </Text>
                  <Text className="text-base text-gray-900">
                    {selectedSale.customerName}
                  </Text>
                </View>
              )}

              {/* Items */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-3" variant="medium">
                  Items ({selectedSale.items.length})
                </Text>
                {selectedSale.items.map((item, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <View className="flex-1">
                      <Text className="text-base text-gray-900" variant="medium">
                        {item.itemName}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {item.quantity} × GHS {item.unitPrice.toFixed(2)}
                      </Text>
                    </View>
                    <Text className="text-base font-semibold text-gray-900" variant="semibold">
                      GHS {item.total.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Notes */}
              {selectedSale.notes && (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-1" variant="medium">
                    Notes
                  </Text>
                  <Text className="text-base text-gray-900">
                    {selectedSale.notes}
                  </Text>
                </View>
              )}

              {/* Date */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1" variant="medium">
                  Date
                </Text>
                <Text className="text-base text-gray-900">
                  {new Date(selectedSale.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
}

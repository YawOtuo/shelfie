import { StatusBar } from "expo-status-bar";
import { Plus } from "lucide-react-native";
import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateSaleSheet } from "../../components/CreateSaleSheet";
import { Header } from "../../components/Header";
import { NoShopConnected } from "../../components/NoShopConnected";
import { SaleCard } from "../../components/SaleCard";
import { SwipeableTabWrapper } from "../../components/SwipeableTabWrapper";
import { ErrorState, FloatingActionButton, LoadingState } from "../../components/common";
import { SaleDetailSheet, SalesStats } from "../../components/sales";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { SearchInput } from "../../components/ui/SearchInput";
import { useToast } from "../../components/ui/ToastProvider";
import { colors } from "../../lib/colors";
import { useRecentlySoldItems, useSellInventory } from "../../lib/hooks/useInventory";
import { useItems } from "../../lib/hooks/useItems";
import { useAuthStore } from "../../lib/stores/authStore";
import { InventoryWithRelations } from "../../lib/types/inventory";
import { CreateSaleInput, Sale } from "../../lib/types/sale";

export default function SalesScreen() {
  const { user } = useAuthStore();
  const shopId = user?.shopId;
  const userId = user?.id;
  const { showSuccess, showError } = useToast();

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
    
    return soldItemsData.map((inventory: InventoryWithRelations) => {
      // Response uses lowercase 'item', not uppercase 'Item'
      const item = (inventory as any).item || (inventory as any).Item;
      
      const cost = inventory.cost ? Number(inventory.cost) : 0;
      const quantity = inventory.quantity || 1;
      return {
        id: inventory.id.toString(),
        items: [{
          itemId: inventory.itemId.toString(),
          itemName: item?.name || "Unknown Item",
          quantity: quantity,
          unitPrice: quantity > 0 ? cost / quantity : 0,
          total: cost,
        }],
        totalAmount: cost,
        customerName: undefined,
        notes: undefined,
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

  const todayRevenue = (todaySales.reduce((sum, sale) => {
    const amount = typeof sale.totalAmount === 'number' ? sale.totalAmount : (Number(sale.totalAmount) || 0);
    return sum + amount;
  }, 0)) || 0;
  const totalRevenue = (sales.reduce((sum, sale) => {
    const amount = typeof sale.totalAmount === 'number' ? sale.totalAmount : (Number(sale.totalAmount) || 0);
    return sum + amount;
  }, 0)) || 0;
  const totalSales = sales.length;

  const handleCreateSale = async (saleInput: CreateSaleInput) => {
    if (!shopId || !userId) {
      showError("Shop ID or User ID not available");
      return;
    }

    try {
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
      showSuccess("Sale created successfully");
      setCreateSaleVisible(false);
      refetchSales();
    } catch (error: any) {
      showError(error?.response?.data?.message || "Failed to create sale");
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
      <SwipeableTabWrapper tabIndex={1}>
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.white }} edges={["left", "right"]}>
          <StatusBar style="dark" />
          <Header />
          <LoadingState message="Loading sales..." />
        </SafeAreaView>
      </SwipeableTabWrapper>
    );
  }

  // Show error state
  if (salesError && !sales.length) {
    return (
      <SwipeableTabWrapper tabIndex={1}>
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.white }} edges={["left", "right"]}>
          <StatusBar style="dark" />
          <Header />
          <ErrorState
            message={salesError instanceof Error ? salesError.message : "Failed to load sales"}
            onRetry={refetchSales}
          />
        </SafeAreaView>
      </SwipeableTabWrapper>
    );
  }

  // Show message if no shop
  if (!shopId) {
    return (
      <SwipeableTabWrapper tabIndex={1}>
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.white }} edges={["left", "right"]}>
          <StatusBar style="dark" />
          <Header />
          <NoShopConnected message="Please connect to a shop or create one to view sales" />
        </SafeAreaView>
      </SwipeableTabWrapper>
    );
  }

  return (
    <SwipeableTabWrapper tabIndex={1}>
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.white }} edges={["left", "right"]}>
        <StatusBar style="dark" />
        <Header />
        <ScrollView
          className="flex-1"
          style={{ backgroundColor: colors.white }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={salesLoading} onRefresh={onRefresh} />
          }
        >
          <SalesStats
            todayRevenue={todayRevenue}
            totalRevenue={totalRevenue}
            totalSales={totalSales}
          />

          <View className="px-5 pb-6">
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search sales..."
              onSearchPress={() => {}}
            />
          </View>

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

        <FloatingActionButton
          onPress={() => setCreateSaleVisible(true)}
          icon={Plus}
        />

        <CreateSaleSheet
          visible={createSaleVisible}
          items={items}
          onClose={() => setCreateSaleVisible(false)}
          onCreate={handleCreateSale}
        />

        <SaleDetailSheet
          visible={saleDetailVisible}
          sale={selectedSale}
          onClose={() => {
            setSaleDetailVisible(false);
            setSelectedSale(null);
          }}
        />
      </SafeAreaView>
    </SwipeableTabWrapper>
  );
}

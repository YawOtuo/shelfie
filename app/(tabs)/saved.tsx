import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart } from "lucide-react-native";
import { FarmCard } from "../../components/FarmCard";
import { ListingCard } from "../../components/ListingCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";
import { Tabs } from "../../components/ui/Tabs";
import { useListings } from "../../lib/hooks/useListings";
import { useGetAllFarms } from "../../lib/hooks/useFarms";
import { Listing } from "../../lib/types/listing";
import { Farm } from "../../lib/types/farm";

type TabType = "listings" | "farms";

const SAVED_TABS = [
  { id: "listings", label: "Listings" },
  { id: "farms", label: "Farms" },
];

export default function SavedScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("listings");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all listings and farms - in a real app, you'd fetch only saved items
  const { listings, isLoading: loadingListings, refetch: refetchListings } = useListings({
    limit: 50,
  });
  const { data: farms = []  , isLoading: loadingFarms, refetch: refetchFarms } = useGetAllFarms({
    limit: 50,
  });

  // Mock saved items - replace with actual saved items API call
  // In a real app, you'd have a separate API endpoint for saved items
  const savedListingIds = [1, 3, 5]; // Mock saved listing IDs
  const savedFarmIds = [1, 2]; // Mock saved farm IDs

  const savedListings = listings.filter((listing) => savedListingIds.includes(listing.id));
  const savedFarms = farms.filter((farm: Farm ) => savedFarmIds.includes(farm.id));

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchListings(), refetchFarms()]);
    } finally {
      setRefreshing(false);
    }
  };

  const renderListingItem = ({ item }: { item: Listing }) => (
    <View className="mb-4" style={{ width: "48%" }}>
      <ListingCard
        listing={item}
        onPress={() => router.push(`/listing/${item.id}`)}
        isHandpicked={false}
      />
    </View>
  );

  const renderFarmItem = ({ item }: { item: Farm }) => (
    <View className="mb-4" style={{ width: "48%" }}>
      <FarmCard farm={item} onPress={() => router.push(`/farm/${item.id}`)} />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={['left', 'right']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#11964a" />
        }
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <View className="px-5 pt-2 pb-3 border-b border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
          <Text className="text-xl font-bold text-gray-900 mb-2" variant="bold">
            Saved Items
          </Text>
          <Text className="text-sm text-gray-600">
            Your saved listings and farms
          </Text>
        </View>

        {/* Tabs */}
        <View className="pt-3 bg-white" style={{ backgroundColor: '#FFFFFF' }}>
          <Tabs
            tabs={SAVED_TABS.map((tab) => ({
              id: tab.id,
              label: `${tab.label} (${
                tab.id === "listings" ? savedListings.length : savedFarms.length
              })`,
            }))}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as TabType)}
            variant="rounded"
          />
        </View>

        {/* Content */}
        <View className="px-5 pb-6 bg-white" style={{ backgroundColor: '#FFFFFF' }}>
          {activeTab === "listings" ? (
            <>
              {loadingListings ? (
                <View className="py-8">
                  <LoadingSpinner size="large" color="#11964a" />
                </View>
              ) : savedListings.length > 0 ? (
                <View className="mt-4">
                  <FlatList
                    data={savedListings}
                    renderItem={renderListingItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between", gap: 12 }}
                    contentContainerStyle={{ paddingBottom: 8 }}
                  />
                </View>
              ) : (
                <EmptyState
                  iconType="package"
                  title="No Saved Listings"
                  message="You haven't saved any listings yet. Start browsing and save your favorites!"
                  action={
                    <Button
                      onPress={() => router.push("/(tabs)/")}
                      variant="primary"
                    >
                      Browse Listings
                    </Button>
                  }
                />
              )}
            </>
          ) : (
            <>
              {loadingFarms ? (
                <View className="py-8">
                  <LoadingSpinner size="large" color="#11964a" />
                </View>
              ) : savedFarms.length > 0 ? (
                <View className="mt-4">
                  <FlatList
                    data={savedFarms}
                    renderItem={renderFarmItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between", gap: 12 }}
                    contentContainerStyle={{ paddingBottom: 8 }}
                  />
                </View>
              ) : (
                <EmptyState
                  iconType="building"
                  title="No Saved Farms"
                  message="You haven't saved any farms yet. Discover quality farms and save your favorites!"
                  action={
                    <Button
                      onPress={() => router.push("/(tabs)/farms")}
                      variant="primary"
                    >
                      Browse Farms
                    </Button>
                  }
                />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

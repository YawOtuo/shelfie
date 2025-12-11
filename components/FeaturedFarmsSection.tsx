import { useState } from "react";
import { FlatList, View } from "react-native";
import { useClosestFarms, useNewestFarms, useTopRatedFarms } from "../lib/hooks/useFarms";
import { Farm } from "../lib/types/farm";
import { FarmCard } from "./FarmCard";
import { EmptyState } from "./ui/EmptyState";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { Tabs } from "./ui/Tabs";
import { Text } from "./ui/Text";

interface FeaturedFarmsSectionProps {
  searchQuery: string;
  onFarmPress: (farmId: number) => void;
}

const FARM_TABS = [
  { id: "closest", label: "Closest to You" },
  { id: "newest", label: "New Farms" },
  { id: "top-rated", label: "Top Rated" },
];

export function FeaturedFarmsSection({
  searchQuery,
  onFarmPress,
}: FeaturedFarmsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("closest");

  // Fetch farms based on active tab
  const { farms: closestFarms, isLoading: loadingClosest, error: errorClosest } = useClosestFarms({
    limit: 10,
    search_query: searchQuery.trim() || undefined,
  });

  const { farms: newestFarms, isLoading: loadingNewest, error: errorNewest } = useNewestFarms({
    limit: 10,
    search_query: searchQuery.trim() || undefined,
  });

  const { farms: topRatedFarms, isLoading: loadingTopRated, error: errorTopRated } = useTopRatedFarms({
    limit: 10,
    search_query: searchQuery.trim() || undefined,
  });

  // Get current farms based on active tab
  const getCurrentFarms = () => {
    switch (activeTab) {
      case "closest":
        return { farms: closestFarms, isLoading: loadingClosest, error: errorClosest };
      case "newest":
        return { farms: newestFarms, isLoading: loadingNewest, error: errorNewest };
      case "top-rated":
        return { farms: topRatedFarms, isLoading: loadingTopRated, error: errorTopRated };
      default:
        return { farms: closestFarms, isLoading: loadingClosest, error: errorClosest };
    }
  };

  const { farms, isLoading, error } = getCurrentFarms();
  const renderFarmItem = ({ item }: { item: Farm }) => (
    <View className="mr-4 pb-4">
      <FarmCard
        farm={item}
        onPress={() => onFarmPress(item.id)}
        width={200}
      />
    </View>
  );

  return (
    <View className="mt-6">
      <View className="px-4 mb-3 flex-row items-center justify-between">
        <Text className="text-xl text-primary-dark" variant="bold">
          Featured Farms
        </Text>
        {farms.length > 0 && (
          <Text className="text-sm text-gray-500">
            {farms.length} {farms.length === 1 ? "farm" : "farms"}
          </Text>
        )}
      </View>

      {/* Farm Tabs */}
      <Tabs
        tabs={FARM_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {isLoading ? (
        <View className="px-4 py-8">
          <LoadingSpinner size="large" color="#11964a" text="Loading farms..." />
        </View>
      ) : error ? (
        <View className="px-4 py-8">
          <Text className="text-center text-red-500 text-base">
            Error loading farms.
          </Text>
        </View>
      ) : farms.length > 0 ? (
        <FlatList
          data={farms}
          renderItem={renderFarmItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />
      ) : (
        <EmptyState
          iconType={searchQuery ? "search" : "building"}
          title={
            searchQuery
              ? "No farms found"
              : activeTab === "closest"
              ? "No farms nearby"
              : activeTab === "newest"
              ? "No new farms"
              : "No top rated farms"
          }
          message={
            searchQuery
              ? `We couldn't find any farms matching "${searchQuery}". Try adjusting your search.`
              : activeTab === "closest"
              ? "There are no farms in your area at the moment. Check back later or try a different location."
              : activeTab === "newest"
              ? "No new farms have been added recently. Check back soon for updates."
              : "There are no top rated farms available at the moment."
          }
        />
      )}
    </View>
  );
}


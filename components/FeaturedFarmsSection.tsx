import { useState } from "react";
import { FlatList, View } from "react-native";
import { useGetClosestFarms, useGetNewestFarms, useGetTopRatedFarms } from "../lib/hooks/useFarms";
import { Farm } from "../lib/types/farm";
import { FarmCardV3 } from "./FarmCardV3";
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
  const { data: closestFarms = [], isLoading: loadingClosest, error: errorClosest } = useGetClosestFarms({
    limit: 10,
    search_query: searchQuery.trim() || undefined,
  });

  const { data: newestFarms = [], isLoading: loadingNewest, error: errorNewest } = useGetNewestFarms({
    limit: 10,
    search_query: searchQuery.trim() || undefined,
  });

  const { data: topRatedFarms = [], isLoading: loadingTopRated, error: errorTopRated } = useGetTopRatedFarms({
    limit: 10,
    search_query: searchQuery.trim() || undefined,
  });

  // Get current farms based on active tab
  const getCurrentFarms = () => {
    switch (activeTab) {
      case "closest":
        return { farms: closestFarms || [], isLoading: loadingClosest, error: errorClosest };
      case "newest":
        return { farms: newestFarms || [], isLoading: loadingNewest, error: errorNewest };
      case "top-rated":
        return { farms: topRatedFarms || []   , isLoading: loadingTopRated, error: errorTopRated };
      default:
        return { farms: closestFarms || [], isLoading: loadingClosest, error: errorClosest };
    }
  };

  const { farms = [], isLoading, error } = getCurrentFarms();
  const renderFarmItem = ({ item }: { item: Farm }) => (
    <View className="mr-4 pb-4">
      <FarmCardV3
        farm={item}
        onPress={() => onFarmPress(item.id)}
      />
    </View>
  );

  return (
    <View className="mt-4">
      <View className="px-4 mb-3">
        <Text className="text-base text-primary-dark" variant="medium">
          Featured Farms
        </Text>
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
      ) : (farms || []).length > 0 ? (
        <>
          <FlatList
            data={farms || []}
            renderItem={renderFarmItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
          {(farms || []).length > 0 && (
            <View className="px-4 pb-2">
              <Text className="text-sm text-gray-500 text-right">
                {(farms || []).length} {(farms || []).length === 1 ? "farm" : "farms"}
              </Text>
            </View>
          )}
        </>
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


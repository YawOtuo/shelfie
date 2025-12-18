import { useState } from "react";
import { FlatList, View } from "react-native";
import { Listing, LivestockCategory } from "../lib/types/listing";
import { ListingCardV3 } from "./ListingCardV3";
import { EmptyState } from "./ui/EmptyState";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { Tabs } from "./ui/Tabs";
import { Text } from "./ui/Text";

interface LivestockListingsSectionProps {
  listings: Listing[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  activeCategory?: LivestockCategory | "all";
  onCategoryChange?: (category: LivestockCategory | "all") => void;
  onListingPress: (listingId: number) => void;
}

const CATEGORIES: { id: LivestockCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cattle", label: "Cattle" },
  { id: "pigs", label: "Pigs" },
  { id: "sheep", label: "Sheep" },
  { id: "goats", label: "Goats" },
  { id: "poultry", label: "Poultry" },
];

export function LivestockListingsSection({
  listings,
  isLoading,
  error,
  searchQuery,
  activeCategory: externalActiveCategory,
  onCategoryChange,
  onListingPress,
}: LivestockListingsSectionProps) {
  // Use external category if provided, otherwise use internal state
  const [internalCategory, setInternalCategory] = useState<LivestockCategory | "all">("all");
  const activeCategory = externalActiveCategory ?? internalCategory;

  const handleCategoryChange = (category: LivestockCategory | "all") => {
    if (onCategoryChange) {
      onCategoryChange(category);
    } else {
      setInternalCategory(category);
    }
  };

  // Listings are already filtered by API, so use them directly
  const displayListings = listings;

  const renderListingItem = ({ item }: { item: Listing }) => (
    <View className="mr-4 mb-1">
      <ListingCardV3
        listing={item}
        onPress={() => onListingPress(item.id)}
        isHandpicked={item.id === 1}
      />
    </View>
  );

  return (
    <View className="mt-4">
      <View className="px-4 mb-3">
        <Text className="text-base text-primary-dark" variant="medium">
          Top Listings
        </Text>
      </View>

      {/* Category Tabs */}
      <Tabs
        tabs={CATEGORIES}
        activeTab={activeCategory}
        onTabChange={(tabId) => handleCategoryChange(tabId as LivestockCategory | "all")}
      />

      {isLoading ? (
        <View className="px-4 py-8">
          <LoadingSpinner size="large" color="#11964a" text="Loading listings..." />
        </View>
      ) : error ? (
        <View className="px-4 py-8">
          <Text className="text-center text-red-500 text-base">
            Error loading listings. Using mock data.
          </Text>
        </View>
      ) : displayListings.length > 0 ? (
        <>
          <FlatList
            data={displayListings}
            renderItem={renderListingItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
          {displayListings.length > 0 && (
            <View className="px-4 pb-2">
              <Text className="text-sm text-gray-500 text-right">
                {displayListings.length} {displayListings.length === 1 ? "listing" : "listings"}
              </Text>
            </View>
          )}
        </>
      ) : (
        <EmptyState
          iconType={searchQuery ? "search" : "package"}
          title={
            searchQuery
              ? "No listings found"
              : activeCategory === "all"
              ? "No listings available"
              : `No ${activeCategory} listings`
          }
          message={
            searchQuery
              ? `We couldn't find any listings matching "${searchQuery}". Try adjusting your search.`
              : activeCategory === "all"
              ? "Check back soon for new livestock listings."
              : `There are no ${activeCategory} listings available at the moment.`
          }
        />
      )}
    </View>
  );
}


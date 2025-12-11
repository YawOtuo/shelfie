import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { Tabs } from "./ui/Tabs";
import { ListingCard } from "./ListingCard";
import { EmptyState } from "./ui/EmptyState";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { Text } from "./ui/Text";
import { Listing, LivestockCategory } from "../lib/types/listing";

interface LivestockListingsSectionProps {
  listings: Listing[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
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
  onListingPress,
}: LivestockListingsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<LivestockCategory | "all">("all");

  const filteredListings = useMemo(() => {
    if (activeCategory === "all") {
      return listings;
    }
    return listings.filter((listing) => listing.category === activeCategory);
  }, [listings, activeCategory]);

  const renderListingItem = ({ item }: { item: Listing }) => (
    <View className="mr-4 pb-4">
      <ListingCard
        listing={item}
        onPress={() => onListingPress(item.id)}
        isHandpicked={item.id === 1}
        width={200}
      />
    </View>
  );

  return (
    <View className="mt-4">
      <View className="px-4 mb-3 flex-row items-center justify-between">
        <Text className="text-xl text-primary-dark" variant="bold">
          Top Listings
        </Text>
        {filteredListings.length > 0 && (
          <Text className="text-sm text-gray-500">
            {filteredListings.length} {filteredListings.length === 1 ? "listing" : "listings"}
          </Text>
        )}
      </View>

      {/* Category Tabs */}
      <Tabs
        tabs={CATEGORIES}
        activeTab={activeCategory}
        onTabChange={(tabId) => setActiveCategory(tabId as LivestockCategory | "all")}
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
      ) : filteredListings.length > 0 ? (
        <FlatList
          data={filteredListings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />
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


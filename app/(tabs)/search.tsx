import { useLocalSearchParams, useRouter } from "expo-router";
import { Filter, Search, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListingCard } from "../../components/ListingCard";
import { BottomSheet } from "../../components/ui";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Text } from "../../components/ui/Text";
import { useListings } from "../../lib/hooks/useListings";
import { Listing } from "../../lib/types/listing";

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    params.category
  );
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch listings from API
  const { listings, isLoading, error, refetch } = useListings({
    limit: 50,
    search_query: searchQuery.trim() || undefined,
    category: selectedCategory,
    min_price: minPrice ? Number(minPrice) : undefined,
    max_price: maxPrice ? Number(maxPrice) : undefined,
  });

  const categories = ["cattle", "goats", "sheep", "poultry", "pigs"];

  // Update category when route params change
  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category);
    }
  }, [params.category]);

  const handleListingPress = (listingId: number) => {
    router.push(`/listing/${listingId}`);
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setMinPrice("");
    setMaxPrice("");
  };

  const handleCloseFilters = () => {
    setShowFilters(false);
  };

  const hasActiveFilters = selectedCategory || minPrice || maxPrice;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const renderListingItem = ({ item }: { item: Listing }) => {
    const screenWidth = Dimensions.get("window").width;
    const cardWidth = (screenWidth - 32 - 12) / 2; // screen width - padding - gap
    return (
      <ListingCard
        listing={item}
        onPress={() => handleListingPress(item.id)}
        isHandpicked={false}
        width={cardWidth}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-6 pb-3 bg-white">
        <Text className="text-2xl font-bold text-primary mb-3">
          Search Listings
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="flex-1 flex-row items-center bg-white rounded-2xl shadow-md px-4 py-3"
            activeOpacity={1}
            onPress={() => {
              // Focus will be handled by TextInput
            }}
          >
            <Search size={20} color="#9CA3AF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search livestock, farms, or locations..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-base text-gray-900"
              autoFocus={false}
              editable={true}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className={`px-4 py-3 rounded-2xl shadow-md ${
              hasActiveFilters ? "bg-primary" : "bg-white"
            }`}
          >
            <Filter
              size={20}
              color={hasActiveFilters ? "#FFFFFF" : "#9CA3AF"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Listings Grid */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" color="#11964a" text="Loading listings..." />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-center text-red-500 text-base mb-4">
            Error loading listings. Please try again.
          </Text>
        </View>
      ) : listings.length > 0 ? (
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 16, gap: 12 }}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1">
          <EmptyState
            iconType={searchQuery || hasActiveFilters ? "search" : "package"}
            title={searchQuery || hasActiveFilters ? "No listings found" : "No listings available"}
            message={
              searchQuery || hasActiveFilters
                ? `We couldn't find any listings matching your search. Try adjusting your filters.`
                : "There are no listings available at the moment."
            }
          />
        </View>
      )}

      {/* Bottom Sheet Modal */}
      <BottomSheet
        visible={showFilters}
        onClose={handleCloseFilters}
        title="Filters"
        footer={
          <TouchableOpacity
            onPress={handleCloseFilters}
            className="bg-primary rounded-2xl shadow-md py-4 items-center"
          >
            <Text className="text-white font-semibold text-base">Apply Filters</Text>
          </TouchableOpacity>
        }
      >
        <View className="px-6 pt-6">
          {/* Clear all button */}
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearFilters} className="mb-4">
              <Text className="text-primary text-sm font-medium">Clear all</Text>
            </TouchableOpacity>
          )}

          {/* Category Filter */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Category
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() =>
                    setSelectedCategory(
                      selectedCategory === category ? undefined : category
                    )
                  }
                  className={`px-4 py-2.5 rounded-2xl shadow-md ${
                    selectedCategory === category ? "bg-primary" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedCategory === category
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range Filter */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Price Range
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-2">Min (GHS)</Text>
                <TextInput
                  value={minPrice}
                  onChangeText={setMinPrice}
                  placeholder="0"
                  keyboardType="numeric"
                  className="bg-white rounded-2xl shadow-md px-4 py-3 text-gray-900"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-2">Max (GHS)</Text>
                <TextInput
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  placeholder="Any"
                  keyboardType="numeric"
                  className="bg-white rounded-2xl shadow-md px-4 py-3 text-gray-900"
                />
              </View>
            </View>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

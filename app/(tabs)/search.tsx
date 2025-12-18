import { useLocalSearchParams, useRouter } from "expo-router";
import { Filter, Search, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListingCardV3 } from "../../components/ListingCardV3";
import { BottomSheet } from "../../components/ui";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Tabs } from "../../components/ui/Tabs";
import { Text } from "../../components/ui/Text";
import { useListings } from "../../lib/hooks/useListings";
import { Listing, LivestockCategory } from "../../lib/types/listing";

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

  // Category tabs for easy filtering
  const categoryTabs = [
    { id: "all", label: "All" },
    { id: "cattle", label: "Cattle" },
    { id: "goats", label: "Goats" },
    { id: "sheep", label: "Sheep" },
    { id: "poultry", label: "Poultry" },
    { id: "pigs", label: "Pigs" },
  ];

  // Get active tab (either selectedCategory or "all")
  const activeTab = selectedCategory || "all";

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    if (tabId === "all") {
      setSelectedCategory(undefined);
    } else {
      setSelectedCategory(tabId);
    }
  };

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
    return (
      <View className="px-5 mb-4">
        <ListingCardV3
          listing={item}
          onPress={() => handleListingPress(item.id)}
          isHandpicked={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={['left', 'right']}>
      {/* Header */}
      <View className="px-5 pt-2 pb-3 bg-white border-b border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-xl font-bold text-gray-900" variant="bold">
              Browse Listings
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'} available
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className={`px-4 py-2.5 rounded-xl flex-row items-center gap-2 ${
              hasActiveFilters ? "bg-primary" : "bg-gray-100"
            }`}
            activeOpacity={0.7}
          >
            <Filter
              size={18}
              color={hasActiveFilters ? "#FFFFFF" : "#6B7280"}
              strokeWidth={2.5}
            />
            <Text
              className={`text-sm font-semibold ${
                hasActiveFilters ? "text-white" : "text-gray-700"
              }`}
            >
              Filter
            </Text>
            {hasActiveFilters && (
              <View className="w-2 h-2 rounded-full bg-white" />
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-3">
          <Search size={18} color="#6B7280" strokeWidth={2.5} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search livestock..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-gray-900 text-sm"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="ml-2"
              activeOpacity={0.7}
            >
              <X size={18} color="#6B7280" strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Tabs */}
      <View className="bg-white border-b border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
        <Tabs
          tabs={categoryTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </View>

      {/* Listings List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center bg-white" style={{ backgroundColor: '#FFFFFF' }}>
          <LoadingSpinner size="large" color="#11964a" text="Loading listings..." />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4 bg-white" style={{ backgroundColor: '#FFFFFF' }}>
          <Text className="text-center text-red-500 text-base mb-4">
            Error loading listings. Please try again.
          </Text>
        </View>
      ) : listings.length > 0 ? (
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ 
            paddingTop: 16, 
            paddingBottom: 24,
            backgroundColor: '#FFFFFF' 
          }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#11964a"
            />
          }
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: '#FFFFFF' }}
        />
      ) : (
        <View className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }}>
          <EmptyState
            iconType={searchQuery || hasActiveFilters ? "search" : "package"}
            title={searchQuery || hasActiveFilters ? "No listings found" : "No listings available"}
            message={
              searchQuery || hasActiveFilters
                ? `We couldn't find any listings matching your criteria. Try adjusting your filters.`
                : "There are no listings available at the moment."
            }
          />
        </View>
      )}

      {/* Bottom Sheet Modal */}
      <BottomSheet
        visible={showFilters}
        onClose={handleCloseFilters}
        title="Filter Listings"
        footer={
          <View className="px-6 pb-4">
            <TouchableOpacity
              onPress={handleCloseFilters}
              className="bg-primary rounded-2xl py-4 items-center"
              style={{
                shadowColor: "#11964a",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
              activeOpacity={0.9}
            >
              <Text className="text-white font-bold text-base">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        }
      >
        <View className="px-6 pt-4 pb-2">
          {/* Clear all button */}
          {hasActiveFilters && (
            <TouchableOpacity 
              onPress={clearFilters} 
              className="mb-5 self-start"
              activeOpacity={0.7}
            >
              <Text className="text-primary text-sm font-semibold">Clear all filters</Text>
            </TouchableOpacity>
          )}

          {/* Category Filter */}
          <View className="mb-6">
            <Text className="text-base font-bold text-gray-900 mb-4">
              Category
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() =>
                    setSelectedCategory(
                      selectedCategory === category ? undefined : category
                    )
                  }
                  className={`px-4 py-2.5 rounded-xl border ${
                    selectedCategory === category 
                      ? "bg-primary border-primary" 
                      : "bg-white border-gray-200"
                  }`}
                  activeOpacity={0.7}
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
          <View className="mb-4">
            <Text className="text-base font-bold text-gray-900 mb-4">
              Price Range (GHS)
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-600 mb-2">Minimum</Text>
                <TextInput
                  value={minPrice}
                  onChangeText={setMinPrice}
                  placeholder="0"
                  keyboardType="numeric"
                  className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-gray-900 font-medium"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-600 mb-2">Maximum</Text>
                <TextInput
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  placeholder="Any"
                  keyboardType="numeric"
                  className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-gray-900 font-medium"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}


import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Dimensions, FlatList, RefreshControl, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FarmCard } from "../../components/FarmCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Text } from "../../components/ui/Text";
import { useFarms } from "../../lib/hooks/useFarms";
import { Farm } from "../../lib/types/farm";

export default function FarmsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch farms from API
  const { farms, isLoading: loadingFarms, refetch } = useFarms({
    limit: 50,
    search_query: searchQuery.trim() || undefined,
  });

  // Filter farms based on search query (client-side for instant feedback)
  const filteredFarms = useMemo(() => {
    if (!searchQuery.trim()) return farms;
    
    const query = searchQuery.toLowerCase();
    return farms.filter(
      (farm) =>
        farm.name.toLowerCase().includes(query) ||
        farm.location?.toLowerCase().includes(query)
    );
  }, [searchQuery, farms]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const renderFarmItem = ({ item }: { item: Farm }) => {
    const screenWidth = Dimensions.get("window").width;
    const cardWidth = (screenWidth - 32 - 12) / 2; // screen width - padding - gap
    return (
      <FarmCard
        farm={item}
        onPress={() => router.push(`/farm/${item.id}`)}
        width={cardWidth}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-6 pb-2 bg-white">
        <Text className="text-3xl font-bold text-primary">
          Farms
        </Text>
        <Text className="text-gray-600 text-base mt-1">
          Discover quality farms near you
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3 bg-white">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search farms or locations..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-gray-900"
          />
        </View>
      </View>

      {/* Farms Grid */}
      {loadingFarms ? (
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner size="large" color="#11964a" text="Loading farms..." />
        </View>
      ) : filteredFarms.length > 0 ? (
        <FlatList
          data={filteredFarms}
          renderItem={renderFarmItem}
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
            iconType={searchQuery ? "search" : "building"}
            title={searchQuery ? "No farms found" : "No farms available"}
            message={
              searchQuery
                ? `We couldn't find any farms matching "${searchQuery}". Try adjusting your search.`
                : "There are no farms available at the moment."
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}


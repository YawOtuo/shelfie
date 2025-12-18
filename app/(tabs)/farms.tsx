import { useRouter } from "expo-router";
import { Search, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, RefreshControl, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FarmCardV3 } from "../../components/FarmCardV3";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Text } from "../../components/ui/Text";
import { Farm } from "../../lib/types/farm";
import { useGetAllFarms } from "../../lib/hooks/useFarms";

export default function FarmsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch farms from API
  const { data: farms = [], isLoading: loadingFarms, refetch } = useGetAllFarms({
    limit: 50,
    search_query: searchQuery.trim() || undefined,
  });

  // Filter farms based on search query (client-side for instant feedback)
  const filteredFarms = useMemo(() => {
    if (!searchQuery.trim()) return farms || [];
    
    const query = searchQuery.toLowerCase();
    return farms || []  .filter(
      (farm: Farm) =>
        farm.name?.toLowerCase().includes(query) ||
        farm.location?.toLowerCase().includes(query)
    ) || [];
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
    return (
      <View className="px-5 mb-4">
        <FarmCardV3
          farm={item}
          onPress={() => router.push(`/farm/${item.id}`)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ backgroundColor: '#FFFFFF' }} edges={['left', 'right']}>
      {/* Header */}
      <View className="px-5 pt-2 pb-3 bg-white border-b border-gray-100" style={{ backgroundColor: '#FFFFFF' }}>
        <Text className="text-xl font-bold text-gray-900 mb-2" variant="bold">
          Verified Farms
        </Text>
        <Text className="text-sm text-gray-600 mb-3">
          {filteredFarms.length} {filteredFarms.length === 1 ? 'farm' : 'farms'} near you
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-1">
          <Search size={18} color="#6B7280" strokeWidth={2.5} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search farms..."
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

      {/* Farms List */}
      {loadingFarms ? (
        <View className="flex-1 items-center justify-center bg-white" style={{ backgroundColor: '#FFFFFF' }}>
          <LoadingSpinner size="large" color="#11964a" text="Loading farms..." />
        </View>
      ) : filteredFarms.length > 0 ? (
        <FlatList
          data={filteredFarms}
          renderItem={renderFarmItem}
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
            iconType={searchQuery ? "search" : "building"}
            title={searchQuery ? "No farms found" : "No farms available"}
            message={
              searchQuery
                ? `We couldn't find any farms matching "${searchQuery}". Try adjusting your search.`
                : "There are no farms available at the moment. Check back soon!"
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}


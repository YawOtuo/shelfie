import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FeaturedFarmsSection } from "../../components/FeaturedFarmsSection";
import { HeroSearch } from "../../components/HeroSearch";
import { LivestockListingsSection } from "../../components/LivestockListingsSection";
import { RecommendationBucketsSection } from "../../components/RecommendationBucketsSection";
import { useListings } from "../../lib/hooks/useListings";
import { useRecommendationBuckets } from "../../lib/hooks/useRecommendationBuckets";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch listings from API
  const { listings, isLoading: loadingListings, error: listingsError } = useListings({
    limit: 20,
    search_query: searchQuery.trim() || undefined,
  });

  // Fetch recommendation buckets from API
  const { buckets, isLoading: loadingBuckets, error: bucketsError } = useRecommendationBuckets({
    limit: 10,
  });


  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: insets.top,
          paddingBottom: 20 
        }}
      >
        {/* Hero Search Component */}
        <HeroSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchPress={() => {
            // Search is handled automatically via the searchQuery state
          }}
          onFiltersPress={() => {
            // Handle filters
          }}
        />

        {/* Livestock Listings Section */}
        <LivestockListingsSection
          listings={listings}
          isLoading={loadingListings}
          error={listingsError}
          searchQuery={searchQuery}
          onListingPress={(id) => router.push(`/listing/${id}`)}
        />

        {/* Featured Farms Section */}
        <FeaturedFarmsSection
          searchQuery={searchQuery}
          onFarmPress={(id) => router.push(`/farm/${id}`)}
        />

        {/* Recommendation Buckets Section */}
        <RecommendationBucketsSection
          buckets={buckets}
          isLoading={loadingBuckets}
          error={bucketsError}
          onListingPress={(id) => router.push(`/listing/${id}`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

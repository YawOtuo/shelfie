import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CategoryListingsSection } from "../../components/CategoryListingsSection";
import { FeaturedFarmsSection } from "../../components/FeaturedFarmsSection";
import { HeroSearch } from "../../components/HeroSearch";
import { LivestockListingsSection } from "../../components/LivestockListingsSection";
import { RecommendationBucketsSection } from "../../components/RecommendationBucketsSection";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { Button } from "../../components/ui/Button";
import { Text } from "../../components/ui/Text";
import { useListings } from "../../lib/hooks/useListings";
import { useRecommendationBuckets } from "../../lib/hooks/useRecommendationBuckets";
import { useAuthUserStore } from "../../lib/stores/authUserStore";
import { LivestockCategory } from "../../lib/types/listing";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    LivestockCategory | "all"
  >("all");
  const { user } = useAuthUserStore();

  // Fetch listings from API with category filter
  const {
    listings,
    isLoading: loadingListings,
    error: listingsError,
  } = useListings({
    limit: 20,
    search_query: searchQuery.trim() || undefined,
    category: activeCategory !== "all" ? activeCategory : undefined,
  });

  // Fetch recommendation buckets from API
  const {
    buckets,
    isLoading: loadingBuckets,
    error: bucketsError,
  } = useRecommendationBuckets({
    limit: 10,
  });

  // Fetch category-specific listings
  const {
    listings: cattleListings,
    isLoading: loadingCattle,
    error: cattleError,
  } = useListings({
    limit: 10,
    category: "cattle",
  });

  const {
    listings: goatsListings,
    isLoading: loadingGoats,
    error: goatsError,
  } = useListings({
    limit: 10,
    category: "goats",
  });

  const {
    listings: poultryListings,
    isLoading: loadingPoultry,
    error: poultryError,
  } = useListings({
    limit: 10,
    category: "poultry",
  });

  const handleProfilePress = () => {
    if (user) {
      // User is logged in, navigate to profile
      router.push("/(tabs)/profile");
    } else {
      // User is not logged in, show login bottom sheet
      setShowLoginSheet(true);
    }
  };

  const handleLoginPress = () => {
    setShowLoginSheet(false);
    router.push("/login");
  };

  const handleSignupPress = () => {
    setShowLoginSheet(false);
    router.push("/signup");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        {/* Hero Search Component with Integrated Categories */}
        <HeroSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchPress={() => {
            // Search is handled automatically via the searchQuery state
          }}
          onFiltersPress={() => {
            // Handle filters
          }}
          onCategoryPress={(category) => setActiveCategory(category as LivestockCategory)}
          cattleCount={cattleListings.length}
          goatsCount={goatsListings.length}
          poultryCount={poultryListings.length}
        />

        {/* Livestock Listings Section */}
        <LivestockListingsSection
          listings={listings}
          isLoading={loadingListings}
          error={listingsError}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onListingPress={(id) => router.push(`/listing/${id}`)}
        />

        {/* Recommended Cattle Section */}
        <View className="mt-4">
          <CategoryListingsSection
            title="Recommended Cattle"
            listings={cattleListings}
            isLoading={loadingCattle}
            error={cattleError}
            onListingPress={(id) => router.push(`/listing/${id}`)}
          />
        </View>

        {/* Featured Farms Section */}
        <FeaturedFarmsSection
          searchQuery={searchQuery}
          onFarmPress={(id) => router.push(`/farm/${id}`)}
        />

        {/* Goats Section */}
        <CategoryListingsSection
          title="Goats"
          listings={goatsListings}
          isLoading={loadingGoats}
          error={goatsError}
          onListingPress={(id) => router.push(`/listing/${id}`)}
        />

        {/* Recommendation Buckets Section */}
        <RecommendationBucketsSection
          buckets={buckets}
          isLoading={loadingBuckets}
          error={bucketsError}
          onListingPress={(id) => router.push(`/listing/${id}`)}
        />

        {/* Poultry Section */}
        <CategoryListingsSection
          title="Poultry"
          listings={poultryListings}
          isLoading={loadingPoultry}
          error={poultryError}
          onListingPress={(id) => router.push(`/listing/${id}`)}
        />
      </ScrollView>

      {/* Login Bottom Sheet */}
      <BottomSheet
        visible={showLoginSheet}
        onClose={() => setShowLoginSheet(false)}
        title="Sign In Required"
        height={300}
      >
        <View className="flex-1 px-6 py-4">
          <Text className="text-gray-600 text-base mb-6 text-center">
            Please sign in to access your profile and enjoy all features of
            Livestockly.
          </Text>

          <View className="gap-3">
            <Button onPress={handleLoginPress} size="lg" className="w-full">
              Sign In
            </Button>

            <Button
              onPress={handleSignupPress}
              size="lg"
              variant="outline"
              className="w-full"
            >
              Create Account
            </Button>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

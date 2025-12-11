import { FlatList, View } from "react-native";
import { Listing } from "../lib/types/listing";
import { RecommendationBucket } from "../lib/types/recommendation-bucket";
import { ListingCard } from "./ListingCard";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { Text } from "./ui/Text";

interface RecommendationBucketsSectionProps {
  buckets: RecommendationBucket[];
  isLoading: boolean;
  error: Error | null;
  onListingPress: (listingId: number) => void;
}

export function RecommendationBucketsSection({
  buckets,
  isLoading,
  error,
  onListingPress,
}: RecommendationBucketsSectionProps) {
  const renderBucketListingItem = ({ item }: { item: Listing }) => (
    <View className="mr-4 pb-4">
      <ListingCard
        listing={item}
        onPress={() => onListingPress(item.id)}
        isHandpicked={false}
        width={200}
      />
    </View>
  );

  const renderRecommendationBucket = ({ item: bucket }: { item: RecommendationBucket }) => {
    if (!bucket.listings || bucket.listings.length === 0) return null;

    const listings = bucket.listings.map((bucketListing) => bucketListing.listing);

    return (
      <View className="mt-6">
        <View className="px-4 mb-3 flex-row items-center justify-between">
          <Text className="text-xl text-primary-dark" variant="bold">
            {bucket.title}
          </Text>
          {bucket.description && (
            <Text className="text-sm text-gray-500 flex-1 ml-2">
              {bucket.description}
            </Text>
          )}
        </View>
        <FlatList
          data={listings}
          renderItem={renderBucketListingItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="mt-6 mb-6 px-4 py-8">
        <LoadingSpinner size="large" color="#11964a" text="Loading recommendations..." />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-6 mb-6 px-4 py-8">
        <Text className="text-center text-red-500 text-base">
          Error loading recommendations.
        </Text>
      </View>
    );
  }

  if (buckets.length === 0) {
    return null;
  }

  return (
    <View className="">
      <FlatList
        data={buckets}
        renderItem={renderRecommendationBucket}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
    </View>
  );
}


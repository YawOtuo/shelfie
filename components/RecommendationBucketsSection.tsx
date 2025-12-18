import { FlatList, View } from "react-native";
import { Listing } from "../lib/types/listing";
import { RecommendationBucket } from "../lib/types/recommendation-bucket";
import { ListingCardV3 } from "./ListingCardV3";
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
      <ListingCardV3
        listing={item}
        onPress={() => onListingPress(item.id)}
        isHandpicked={false}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View className="mt-4 px-4 py-8">
        <LoadingSpinner size="large" color="#11964a" text="Loading recommendations..." />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-4 px-4 py-8">
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
      {buckets.map((bucket) => {
        if (!bucket.listings || bucket.listings.length === 0) return null;

        const listings = bucket.listings.map((bucketListing) => bucketListing.listing);

        return (
          <View key={bucket.id} className="mt-4">
            <View className="px-4 mb-3">
              <Text className="text-base text-primary-dark" variant="medium">
                {bucket.title}
              </Text>
            </View>

            <FlatList
              data={listings}
              renderItem={renderBucketListingItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
            
            {listings.length > 0 && (
              <View className="px-4 pb-2">
                <Text className="text-sm text-gray-500 text-right">
                  {listings.length} {listings.length === 1 ? "listing" : "listings"}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}


import { FlatList, View } from "react-native";
import { Listing } from "../lib/types/listing";
import { ListingCardV3 } from "./ListingCardV3";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { Text } from "./ui/Text";

interface CategoryListingsSectionProps {
  title: string;
  listings: Listing[];
  isLoading: boolean;
  error: Error | null;
  onListingPress: (listingId: number) => void;
}

export function CategoryListingsSection({
  title,
  listings,
  isLoading,
  error,
  onListingPress,
}: CategoryListingsSectionProps) {
  const renderListingItem = ({ item }: { item: Listing }) => (
    <View className="mr-4 pb-4">
      <ListingCardV3
        listing={item}
        onPress={() => onListingPress(item.id)}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View className="mt-6 px-4">
        <Text className="text-base text-primary-dark mb-3" >
          {title}
        </Text>
        <View className="py-4">
          <LoadingSpinner size="small" color="#11964a" />
        </View>
      </View>
    );
  }

  if (error || listings.length === 0) {
    return null; // Don't show section if no listings
  }

  return (
    <View className="">
      <View className="px-4 mb-3">
        <Text className="text-base font-medium text-primary-dark" >
          {title}
        </Text>
      </View>

      <FlatList
        data={listings}
        renderItem={renderListingItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
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
}






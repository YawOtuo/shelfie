import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { ListingCard } from "../ListingCard";
import { Text } from "../ui/Text";
import { Listing } from "../../lib/types/listing";

interface SimilarListingsProps {
  listings: Listing[];
}

export function SimilarListings({ listings }: SimilarListingsProps) {
  const router = useRouter();

  if (listings.length === 0) {
    return null;
  }

  return (
    <View className="px-4 py-4 bg-white mx-4 my-3 rounded-xl shadow-sm border border-gray-100">
      <Text className="text-lg font-bold text-gray-900 mb-4">Similar Listings</Text>
      <FlatList
        data={listings}
        renderItem={({ item }: { item: Listing }) => (
          <View className="mr-4">
            <ListingCard
              listing={item}
              onPress={() => router.push(`/listing/${item.id}`)}
              width={200}
            />
          </View>
        )}
        keyExtractor={(item: Listing) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 0 }}
      />
    </View>
  );
}

